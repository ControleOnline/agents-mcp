import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGitmodules, queueProtectedReset, repositoryFromUrl, resetIntegrationBranches, setGitmoduleBranches } from '../workers/automate/scripts/reset-integration-branches.mjs';

process.env.GH_TOKEN ??= 'test-token';

test('parses nested submodule paths and rewrites each declared branch', () => {
  const source = [
    '[submodule "shared"]',
    '\tpath = packages/shared',
    '\turl = https://github.com/ControleOnline/shared.git',
    '\tbranch = master',
    '',
    '[submodule "ui"]',
    '\tpath = packages/ui',
    '\turl = git@github.com:ControleOnline/ui.git',
  ].join('\n');

  assert.deepEqual(parseGitmodules(source), [
    { name: 'shared', path: 'packages/shared', url: 'https://github.com/ControleOnline/shared.git', branch: 'master' },
    { name: 'ui', path: 'packages/ui', url: 'git@github.com:ControleOnline/ui.git' },
  ]);
  assert.equal(setGitmoduleBranches(source, 'staging'), [
    '[submodule "shared"]',
    '\tpath = packages/shared',
    '\turl = https://github.com/ControleOnline/shared.git',
    '\tbranch = staging',
    '',
    '[submodule "ui"]',
    '\tpath = packages/ui',
    '\turl = git@github.com:ControleOnline/ui.git',
    '\tbranch = staging',
  ].join('\n'));
});

test('updates only first-party submodule branches and keeps inserted lines inside their sections', () => {
  const source = [
    '[submodule "internal"]',
    '\tpath = modules/internal',
    '\turl = https://github.com/ControleOnline/internal.git',
    '',
    '[submodule "vendor"]',
    '\tpath = public/vendor/pdf.js',
    '\turl = https://github.com/mozilla/pdf.js.git',
    '',
    '[submodule "wiki"]',
    '\tpath = docs/wiki',
    '\turl = https://github.com/ControleOnline/sample.wiki.git',
  ].join('\n');

  assert.equal(repositoryFromUrl('https://github.com/ControleOnline/sample.wiki.git'), null);
  assert.equal(setGitmoduleBranches(source, 'dev'), [
    '[submodule "internal"]',
    '\tpath = modules/internal',
    '\turl = https://github.com/ControleOnline/internal.git',
    '\tbranch = dev',
    '',
    '[submodule "vendor"]',
    '\tpath = public/vendor/pdf.js',
    '\turl = https://github.com/mozilla/pdf.js.git',
    '',
    '[submodule "wiki"]',
    '\tpath = docs/wiki',
    '\turl = https://github.com/ControleOnline/sample.wiki.git',
  ].join('\n'));
});

test('queues and merges the alignment PR with the original source commit recorded', async () => {
  const calls = [];
  const response = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
  const fetchImpl = async (input, options = {}) => {
    const url = new URL(String(input));
    const method = options.method ?? 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({ method, path: `${url.pathname}${url.search}`, body });
    if (method === 'GET' && url.pathname.endsWith('/pulls')) return response(200, []);
    if (method === 'GET' && url.pathname.endsWith('/git/ref/heads/automation/align-dev-dev-12345678-abcdef12')) {
      return response(404, { message: 'Not Found' });
    }
    if (method === 'POST' && url.pathname.endsWith('/git/commits')) return response(201, { sha: 'alignment-commit' });
    if (method === 'POST' && url.pathname.endsWith('/git/refs')) return response(201, { object: { sha: 'alignment-commit' } });
    if (method === 'POST' && url.pathname.endsWith('/pulls')) return response(201, { number: 42, state: 'open' });
    if (method === 'GET' && url.pathname.endsWith('/pulls/42')) return response(200, { state: 'open', mergeable: true, mergeable_state: 'clean' });
    if (method === 'PUT' && url.pathname.endsWith('/pulls/42/merge')) return response(200, { merged: true });
    throw new Error(`Unexpected fake GitHub request: ${method} ${url.pathname}${url.search}`);
  };

  const result = await queueProtectedReset({
    repository: 'ControleOnline/sample',
    target: 'dev',
    targetSha: '12345678-target',
    sourceSha: 'source-commit-sha',
    sourceTree: 'abcdef12-tree',
    sourceBranch: 'dev',
    fetchImpl,
    log: () => {},
  });

  assert.equal(result, 'merged');
  const pr = calls.find(({ method, path }) => method === 'POST' && path.endsWith('/pulls'));
  assert.match(pr.body.title, /Align dev submodules with dev/);
  assert.match(pr.body.body, /source-commit-sha/);
  assert.equal(calls.some(({ method, path }) => method === 'PUT' && path.endsWith('/pulls/42/merge')), true);
});

test('dry-run detects a stale gitlink and reports missing integration refs without writing', async () => {
  const calls = [];
  const gitmodules = Buffer.from([
    '[submodule "shared"]',
    '\tpath = packages/shared',
    '\turl = https://github.com/ControleOnline/shared.git',
    '\tbranch = master',
  ].join('\n')).toString('base64');
  const response = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
  const fetchImpl = async (input, options = {}) => {
    const url = new URL(String(input));
    const method = options.method ?? 'GET';
    calls.push({ method, path: `${url.pathname}${url.search}` });
    const routes = new Map([
      ['/orgs/ControleOnline/repos?type=all&per_page=100&page=1', [
        { full_name: 'ControleOnline/sample', archived: false },
        { full_name: 'ControleOnline/shared', archived: false },
      ]],
      ['/repos/ControleOnline/sample/git/ref/heads/master', { object: { sha: 'sample-master' } }],
      ['/repos/ControleOnline/sample/git/ref/heads/dev', { object: { sha: 'sample-dev' } }],
      ['/repos/ControleOnline/sample/git/commits/sample-dev', { tree: { sha: 'sample-tree' } }],
      ['/repos/ControleOnline/sample/git/trees/sample-tree?recursive=1', { tree: [
        { path: '.gitmodules', type: 'blob', mode: '100644', sha: 'gitmodules-blob' },
        { path: 'packages/shared', type: 'commit', mode: '160000', sha: 'stale-child-sha' },
      ] }],
      ['/repos/ControleOnline/sample/git/blobs/gitmodules-blob', { content: gitmodules }],
      ['/repos/ControleOnline/shared/git/ref/heads/dev', { object: { sha: 'shared-dev' } }],
      ['/repos/ControleOnline/shared/git/ref/heads/master', { object: { sha: 'shared-master' } }],
      ['/repos/ControleOnline/shared/git/commits/shared-master', { tree: { sha: 'shared-tree' } }],
      ['/repos/ControleOnline/shared/git/ref/heads/staging', { object: { sha: 'shared-staging' } }],
      ['/repos/ControleOnline/shared/git/commits/shared-staging', { tree: { sha: 'shared-staging-tree' } }],
      ['/repos/ControleOnline/shared/git/commits/shared-dev', { tree: { sha: 'shared-dev-tree' } }],
      ['/repos/ControleOnline/shared/git/trees/shared-dev-tree?recursive=1', { tree: [] }],
      ['/repos/ControleOnline/shared/git/trees/shared-staging-tree?recursive=1', { tree: [] }],
    ]);
    const route = routes.get(`${url.pathname}${url.search}`);
    if (route) return response(200, route);
    if (url.pathname === '/repos/ControleOnline/sample/git/ref/heads/staging') {
      return response(404, { message: 'Not Found' });
    }
    throw new Error(`Unexpected fake GitHub request: ${method} ${url.pathname}${url.search}`);
  };
  const log = [];
  let result;
  try {
    result = await resetIntegrationBranches({ fetchImpl, log: (line) => log.push(line) });
  } catch (error) {
    throw new Error(error.errors?.map((item) => item.message).join('\n') || error.message);
  }

  assert.deepEqual(result, { repositories: 2, merged: 0, pending: 1, created: 1, unchanged: 2, errors: [] });
  assert.ok(log.some((line) => line.includes('sample:dev/packages/shared -> ControleOnline/shared:dev@shared-dev')));
  assert.equal(calls.every(({ method }) => method === 'GET'), true);
});
