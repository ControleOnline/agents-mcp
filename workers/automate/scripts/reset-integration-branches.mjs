import { pathToFileURL } from 'node:url';

const API_ROOT = 'https://api.github.com';
const ORG = 'ControleOnline';
const BRANCHES = ['dev', 'staging'];

async function githubRequest(path, options = {}, fetchImpl = fetch) {
  const response = await fetchImpl(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`GitHub API ${options.method ?? 'GET'} ${path}: ${response.status} ${detail}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

async function getAll(path, fetchImpl) {
  const results = [];
  for (let page = 1; ; page += 1) {
    const items = await githubRequest(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`, {}, fetchImpl);
    results.push(...items);
    if (items.length < 100) return results;
  }
}

export function repositoryFromUrl(url) {
  const match = String(url || '').match(/(?:github\.com[:/])ControleOnline\/([A-Za-z0-9_.-]+?)(?:\.git)?$/i);
  if (match?.[1].endsWith('.wiki')) return null;
  return match ? `${ORG}/${match[1]}` : null;
}

export function parseGitmodules(content) {
  const modules = [];
  let current = null;
  for (const line of String(content).split(/\r?\n/)) {
    const section = line.match(/^\s*\[submodule\s+"([^"]+)"\]\s*$/i);
    if (section) {
      if (current?.path && current?.url) modules.push(current);
      current = { name: section[1] };
      continue;
    }
    if (!current) continue;
    const field = line.match(/^\s*(path|url|branch)\s*=\s*(.*?)\s*$/i);
    if (field) current[field[1].toLowerCase()] = field[2];
  }
  if (current?.path && current?.url) modules.push(current);
  return modules;
}

export function setGitmoduleBranches(content, branch) {
  const lines = String(content).split(/\r?\n/);
  const modules = new Map(parseGitmodules(content).map((module) => [module.name, module]));
  const output = [];
  let section = [];

  const flush = () => {
    if (!section.length) return;
    const header = section[0].match(/^\s*\[submodule\s+"([^"]+)"\]\s*$/i);
    const module = header && modules.get(header[1]);
    if (module && repositoryFromUrl(module.url)) {
      let branchUpdated = false;
      section = section.map((line) => {
        if (!/^\s*branch\s*=/.test(line)) return line;
        branchUpdated = true;
        return line.replace(/^(\s*branch\s*=\s*).*/, `$1${branch}`);
      });
      if (!branchUpdated) {
        let insertionIndex = section.length;
        while (insertionIndex > 1 && !section[insertionIndex - 1].trim()) insertionIndex -= 1;
        section.splice(insertionIndex, 0, `\tbranch = ${branch}`);
      }
    }
    output.push(...section);
    section = [];
  };

  for (const line of lines) {
    if (/^\s*\[submodule\s+"[^"]+"\]\s*$/i.test(line)) {
      flush();
      section.push(line);
    } else if (section.length) {
      section.push(line);
    } else {
      output.push(line);
    }
  }
  flush();
  return output.join('\n');
}

async function getBranchRef(repository, branch, fetchImpl) {
  return githubRequest(`/repos/${repository}/git/ref/heads/${branch}`, {}, fetchImpl);
}

async function alignedTree({ repository, branch, sourceSha, apply, fetchImpl, log }) {
  const commit = await githubRequest(`/repos/${repository}/git/commits/${sourceSha}`, {}, fetchImpl);
  const tree = await githubRequest(`/repos/${repository}/git/trees/${commit.tree.sha}?recursive=1`, {}, fetchImpl);
  const entries = [];
  let gitmodulesBlob = tree.tree.find((entry) => entry.path === '.gitmodules' && entry.type === 'blob');
  const modulesText = gitmodulesBlob
    ? Buffer.from((await githubRequest(`/repos/${repository}/git/blobs/${gitmodulesBlob.sha}`, {}, fetchImpl)).content, 'base64').toString('utf8')
    : '';
  const modules = parseGitmodules(modulesText);

  for (const entry of tree.tree.filter((item) => item.mode === '160000' && item.type === 'commit')) {
    const module = modules.find((item) => item.path === entry.path);
    if (!module) throw new Error(`${repository}: gitlink ${entry.path} has no matching .gitmodules entry.`);
    const child = repositoryFromUrl(module.url);
    if (!child) {
      log(`SKIP ${repository}:${branch}/${entry.path}: external or GitHub Wiki submodule is outside same-branch policy`);
      continue;
    }
    let childRef;
    try {
      childRef = await getBranchRef(child, branch, fetchImpl);
    } catch (error) {
      if (error.status !== 404) throw error;
      const childMaster = await getBranchRef(child, 'master', fetchImpl);
      if (!apply) {
        log(`DRY-RUN CREATE ${child}:${branch} from master`);
        childRef = childMaster;
      } else {
        await githubRequest(`/repos/${child}/git/refs`, {
          method: 'POST',
          body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: childMaster.object.sha }),
        }, fetchImpl);
        childRef = childMaster;
        log(`CREATE ${child}:${branch} from master`);
      }
    }
    if (entry.sha !== childRef.object.sha) {
      entries.push({ path: entry.path, mode: '160000', type: 'commit', sha: childRef.object.sha });
      log(`${apply ? 'ALIGN' : 'DRY-RUN ALIGN'} ${repository}:${branch}/${entry.path} -> ${child}:${branch}@${childRef.object.sha}`);
    }
  }

  if (gitmodulesBlob) {
    const blob = await githubRequest(`/repos/${repository}/git/blobs/${gitmodulesBlob.sha}`, {}, fetchImpl);
    const text = Buffer.from(blob.content, 'base64').toString('utf8');
    const updated = setGitmoduleBranches(text, branch);
    if (updated !== text) {
      if (apply) {
        const newBlob = await githubRequest(`/repos/${repository}/git/blobs`, {
          method: 'POST', body: JSON.stringify({ content: updated, encoding: 'utf-8' }),
        }, fetchImpl);
        entries.push({ path: '.gitmodules', mode: '100644', type: 'blob', sha: newBlob.sha });
      } else {
        entries.push({ path: '.gitmodules', mode: '100644', type: 'blob', sha: 'dry-run' });
      }
    }
  }

  if (!entries.length) return commit.tree.sha;
  if (!apply) return `alignment-needed:${commit.tree.sha}`;
  const updatedTree = await githubRequest(`/repos/${repository}/git/trees`, {
    method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: entries }),
  }, fetchImpl);
  return updatedTree.sha;
}

async function findOpenPullRequest(repository, branch, base, fetchImpl) {
  const head = encodeURIComponent(`${ORG}:${branch}`);
  const pulls = await githubRequest(`/repos/${repository}/pulls?state=all&head=${head}&base=${base}`, {}, fetchImpl);
  return pulls[0] ?? null;
}

export async function queueProtectedReset({ repository, target, targetSha, sourceSha, sourceTree, sourceBranch, fetchImpl, log }) {
  const branchName = `automation/align-${sourceBranch}-${target}-${targetSha.slice(0, 8)}-${sourceTree.slice(0, 8)}`;
  let pull = await findOpenPullRequest(repository, branchName, target, fetchImpl);
  if (pull?.state === 'closed' && !pull.merged_at) {
    pull = await githubRequest(`/repos/${repository}/pulls/${pull.number}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'open' }),
    }, fetchImpl);
  }
  if (!pull) {
    const branchPath = `/repos/${repository}/git/ref/heads/${branchName}`;
    let resetRef;
    try {
      resetRef = await githubRequest(branchPath, {}, fetchImpl);
    } catch (error) {
      if (error.status !== 404) throw error;
      const resetCommit = await githubRequest(`/repos/${repository}/git/commits`, {
        method: 'POST',
        body: JSON.stringify({
          message: `chore(release): align ${target} with ${sourceBranch}`,
          tree: sourceTree,
          parents: [targetSha],
        }),
      }, fetchImpl);
      resetRef = await githubRequest(`/repos/${repository}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: resetCommit.sha }),
      }, fetchImpl);
    }

    const prs = await githubRequest(`/repos/${repository}/pulls?state=all&head=${encodeURIComponent(`${ORG}:${branchName}`)}&base=${target}`, {}, fetchImpl);
    pull = prs.find((candidate) => !candidate.merged_at) ?? null;
    if (pull?.state === 'closed') {
      pull = await githubRequest(`/repos/${repository}/pulls/${pull.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: 'open' }),
      }, fetchImpl);
    }
    if (!pull) {
      pull = await githubRequest(`/repos/${repository}/pulls`, {
        method: 'POST',
        body: JSON.stringify({
          title: `Align ${target} submodules with ${sourceBranch}`,
          head: branchName,
          base: target,
          body: [
            `Align every submodule gitlink in the **${target}** tree with the tip of its **${sourceBranch}** branch.`,
            '',
            `Source commit: \`${sourceSha}\`; reset tree: \`${resetRef.object.sha}\`.`,
            'This is a normal pull request: repository rules and required checks remain enforced.',
          ].join('\n'),
        }),
      }, fetchImpl);
        log(`PR ${repository}#${pull.number}: ${sourceBranch} -> ${target}`);
    }
  }

  try {
    const currentPull = await githubRequest(`/repos/${repository}/pulls/${pull.number}`, {}, fetchImpl);
    if (currentPull.state !== 'open' || currentPull.mergeable !== true || currentPull.mergeable_state !== 'clean') {
      log(`WAIT ${repository}#${pull.number}: awaiting conflict-free PR and all normal reviews/checks`);
      return 'pending';
    }
    await githubRequest(`/repos/${repository}/pulls/${pull.number}/merge`, {
      method: 'PUT',
      body: JSON.stringify({ merge_method: 'merge' }),
    }, fetchImpl);
    log(`MERGED ${repository}#${pull.number}: ${target} now matches ${sourceBranch}`);
    return 'merged';
  } catch (error) {
    if ([405, 409, 422].includes(error.status)) {
      log(`WAIT ${repository}#${pull.number}: GitHub protection/checks still block merge`);
      return 'pending';
    }
    throw error;
  }
}

export async function resetIntegrationBranches({
  apply = false,
  fetchImpl = fetch,
  log = console.log,
} = {}) {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) throw new Error('Set GH_TOKEN (or GITHUB_TOKEN) with write access to the ControleOnline organization.');

  const repos = await getAll(`/orgs/${ORG}/repos?type=all`, fetchImpl);
  const active = repos.filter((repo) => !repo.archived);
  const errors = [];
  let merged = 0;
  let pending = 0;
  let unchanged = 0;
  let created = 0;

  await mapLimit(active, 4, async (repo) => {
    try {
      let masterRef;
      try {
        masterRef = await githubRequest(`/repos/${repo.full_name}/git/ref/heads/master`, {}, fetchImpl);
      } catch (error) {
        if (error.status !== 404) throw error;
        log(`SKIP ${repo.full_name}: no master branch`);
        return;
      }
      for (const target of BRANCHES) {
        let targetRef;
        try {
          targetRef = await githubRequest(`/repos/${repo.full_name}/git/ref/heads/${target}`, {}, fetchImpl);
        } catch (error) {
          if (error.status !== 404) throw error;
          if (!apply) {
            created += 1;
            log(`DRY-RUN CREATE ${repo.full_name}:${target} -> master`);
            continue;
          }
          await githubRequest(`/repos/${repo.full_name}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({ ref: `refs/heads/${target}`, sha: masterRef.object.sha }),
          }, fetchImpl);
          created += 1;
          log(`CREATE ${repo.full_name}:${target} -> master`);
          targetRef = { object: { sha: masterRef.object.sha } };
        }

        const sourceSha = targetRef.object.sha;
        const sourceBranch = target;
        const sourceTree = await alignedTree({
          repository: repo.full_name,
          branch: target,
          sourceSha,
          apply,
          fetchImpl,
          log,
        });
        const targetCommit = await githubRequest(`/repos/${repo.full_name}/git/commits/${targetRef.object.sha}`, {}, fetchImpl);
        if (targetCommit.tree.sha === sourceTree) {
          unchanged += 1;
          continue;
        }
        if (!apply) {
          pending += 1;
          log(`DRY-RUN PR ${repo.full_name}:${target}: recursive submodule alignment`);
          continue;
        }
        const result = await queueProtectedReset({
          repository: repo.full_name,
          target,
          targetSha: targetRef.object.sha,
          sourceSha,
          sourceTree,
          sourceBranch,
          fetchImpl,
          log,
        });
        if (result === 'merged') merged += 1;
        else pending += 1;
      }
    } catch (error) {
      errors.push(`${repo.full_name}: ${error.message}`);
    }
  });

  log(`Summary: ${active.length} active repositories; ${merged} protected PRs merged, ${pending} waiting for GitHub rules/checks${apply ? '' : ' (dry-run)'}, ${created} missing refs${apply ? ' created' : ' to create'}, ${unchanged} already aligned, ${errors.length} errors.`);
  if (errors.length) throw new AggregateError(errors.map((message) => new Error(message)), 'One or more repositories could not be reconciled.');
  return { repositories: active.length, merged, pending, created, unchanged, errors: [] };
}

async function mapLimit(items, limit, callback) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await callback(items[index]);
    }
  });
  await Promise.all(workers);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  resetIntegrationBranches({ apply: process.argv.includes('--apply') }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
