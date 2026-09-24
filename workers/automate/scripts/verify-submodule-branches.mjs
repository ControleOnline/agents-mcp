import { parseGitmodules, repositoryFromUrl } from './reset-integration-branches.mjs';

const API = 'https://api.github.com';
const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const commitSha = process.env.GITHUB_SHA;
const targetBranch = process.env.GITHUB_BASE_REF;

async function request(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${path}: ${response.status} ${await response.text()}`);
  return response.json();
}

async function blobText(repo, sha) {
  const blob = await request(`/repos/${repo}/git/blobs/${sha}`);
  return Buffer.from(blob.content, 'base64').toString('utf8');
}

async function verifyTree(repo, branch, sha, visited = new Set()) {
  const key = `${repo}@${sha}`;
  if (visited.has(key)) return;
  visited.add(key);

  const commit = await request(`/repos/${repo}/git/commits/${sha}`);
  const tree = await request(`/repos/${repo}/git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated) throw new Error(`${repo}:${branch} tree is truncated; cannot verify all submodules.`);
  const gitlinks = tree.tree.filter((entry) => entry.mode === '160000' && entry.type === 'commit');
  if (!gitlinks.length) return;

  const gitmodules = tree.tree.find((entry) => entry.path === '.gitmodules' && entry.type === 'blob');
  if (!gitmodules) throw new Error(`${repo}:${branch} has gitlinks but no .gitmodules file.`);
  const modules = parseGitmodules(await blobText(repo, gitmodules.sha));
  for (const entry of gitlinks) {
    const module = modules.find((item) => item.path === entry.path);
    if (!module) throw new Error(`${repo}:${branch} gitlink ${entry.path} has no .gitmodules entry.`);
    const child = repositoryFromUrl(module.url);
    if (!child) continue;
    if (module.branch !== branch) {
      throw new Error(`${repo}:${branch} submodule ${entry.path} declares branch=${module.branch || '(unset)'}.`);
    }
    const ref = await request(`/repos/${child}/git/ref/heads/${branch}`);
    if (entry.sha !== ref.object.sha) {
      throw new Error(`${repo}:${branch} gitlink ${entry.path} points to ${entry.sha}; ${child}:${branch} is ${ref.object.sha}.`);
    }
    await verifyTree(child, branch, ref.object.sha, visited);
  }
}

async function main() {
  if (!token || !repository || !commitSha || !['master', 'dev', 'staging'].includes(targetBranch)) {
    throw new Error('Expected GH_TOKEN, GITHUB_REPOSITORY, GITHUB_SHA, and GITHUB_BASE_REF=master|dev|staging.');
  }
  await verifyTree(repository, targetBranch, commitSha);
  console.log(`All recursive submodule gitlinks match ${targetBranch} branch heads for ${repository}@${commitSha}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
