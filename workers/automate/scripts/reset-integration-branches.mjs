const API_ROOT = 'https://api.github.com';
const ORG = 'ControleOnline';
const RELEASE_REPOSITORY = `${ORG}/api-community`;
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

function decodeContent(file) {
  return Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8');
}

async function readRelease({ rcBranch, fetchImpl }) {
  const master = await githubRequest(`/repos/${RELEASE_REPOSITORY}/git/ref/heads/master`, {}, fetchImpl);
  const latestFile = await githubRequest(
    `/repos/${RELEASE_REPOSITORY}/contents/.release/rc-manifest.json?ref=${encodeURIComponent(master.object.sha)}`,
    {}, fetchImpl,
  );
  const latestManifest = JSON.parse(decodeContent(latestFile));
  const branch = rcBranch || latestManifest.branch;
  if (!branch || (rcBranch && latestManifest.branch !== rcBranch)) {
    throw new Error(`Master manifest does not identify requested frozen RC (${rcBranch ?? 'latest'}).`);
  }

  const ref = await githubRequest(`/repos/${RELEASE_REPOSITORY}/git/ref/heads/${branch}`, {}, fetchImpl);
  const rcCommit = await githubRequest(`/repos/${RELEASE_REPOSITORY}/git/commits/${ref.object.sha}`, {}, fetchImpl);
  const rcFile = await githubRequest(
    `/repos/${RELEASE_REPOSITORY}/contents/.release/rc-manifest.json?ref=${encodeURIComponent(ref.object.sha)}`,
    {}, fetchImpl,
  );
  const manifest = JSON.parse(decodeContent(rcFile));
  if (manifest.branch !== branch || manifest.frozen !== true || !manifest.repositories) {
    throw new Error(`RC ${branch} is not a frozen RC manifest.`);
  }

  const comparison = await githubRequest(
    `/repos/${RELEASE_REPOSITORY}/compare/${ref.object.sha}...${master.object.sha}`,
    {}, fetchImpl,
  );
  if (comparison.behind_by !== 0 || !['ahead', 'identical'].includes(comparison.status)) {
    throw new Error(`RC ${branch} has not been published to master.`);
  }

  return {
    branch,
    version: manifest.version,
    releaseCommit: ref.object.sha,
    repositories: { ...manifest.repositories, [RELEASE_REPOSITORY]: ref.object.sha },
  };
}

async function findOpenPullRequest(repository, branch, base, fetchImpl) {
  const head = encodeURIComponent(`${ORG}:${branch}`);
  const pulls = await githubRequest(`/repos/${repository}/pulls?state=all&head=${head}&base=${base}`, {}, fetchImpl);
  return pulls[0] ?? null;
}

async function queueProtectedReset({ repository, target, targetSha, sourceSha, sourceTree, release, fetchImpl, log }) {
  const branchName = `automation/reset-${release.branch.replaceAll('/', '-')}-${target}-${targetSha.slice(0, 8)}-${sourceSha.slice(0, 8)}`;
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
          message: `chore(release): align ${target} with ${release.branch}`,
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
          title: `Reset ${target} to RC ${release.version} (${release.branch})`,
          head: branchName,
          base: target,
          body: [
            `Align the complete ${target} tree with the frozen release candidate **${release.branch}**.`,
            '',
            `Source commit: \`${sourceSha}\`; reset tree: \`${resetRef.object.sha}\`.`,
            'This is a normal pull request: repository rules and required checks remain enforced.',
          ].join('\n'),
        }),
      }, fetchImpl);
      log(`PR ${repository}#${pull.number}: ${target} -> ${release.branch}`);
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
    log(`MERGED ${repository}#${pull.number}: ${target} now matches RC ${release.version}`);
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
  rcBranch = process.env.RC_BRANCH || '',
  fetchImpl = fetch,
  log = console.log,
} = {}) {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) throw new Error('Set GH_TOKEN (or GITHUB_TOKEN) with write access to the ControleOnline organization.');

  const release = await readRelease({ rcBranch, fetchImpl });
  log(`Release ${release.branch} (${release.version}) is frozen and present in master.`);

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
      const sourceSha = release.repositories[repo.full_name] || masterRef.object.sha;
      const sourceCommit = await githubRequest(`/repos/${repo.full_name}/git/commits/${sourceSha}`, {}, fetchImpl);
      const sourceTree = sourceCommit.tree.sha;

      for (const target of BRANCHES) {
        let targetRef;
        try {
          targetRef = await githubRequest(`/repos/${repo.full_name}/git/ref/heads/${target}`, {}, fetchImpl);
        } catch (error) {
          if (error.status !== 404) throw error;
          if (!apply) {
            created += 1;
            log(`DRY-RUN CREATE ${repo.full_name}:${target} -> ${release.branch}`);
            continue;
          }
          await githubRequest(`/repos/${repo.full_name}/git/refs`, {
            method: 'POST',
            body: JSON.stringify({ ref: `refs/heads/${target}`, sha: sourceSha }),
          }, fetchImpl);
          created += 1;
          log(`CREATE ${repo.full_name}:${target} -> ${release.branch}`);
          continue;
        }

        const targetCommit = await githubRequest(
          `/repos/${repo.full_name}/git/commits/${targetRef.object.sha}`, {}, fetchImpl,
        );
        if (targetCommit.tree.sha === sourceTree) {
          unchanged += 1;
          continue;
        }
        if (!apply) {
          pending += 1;
          log(`DRY-RUN PR ${repo.full_name}:${target} -> ${release.branch}`);
          continue;
        }
        const result = await queueProtectedReset({
          repository: repo.full_name,
          target,
          targetSha: targetRef.object.sha,
          sourceSha,
          sourceTree,
          release,
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

if (import.meta.url === `file://${process.argv[1]}`) {
  resetIntegrationBranches({ apply: process.argv.includes('--apply') }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
