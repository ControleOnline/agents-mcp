import test from 'node:test';
import assert from 'node:assert/strict';
import { resetIntegrationBranches } from '../workers/automate/scripts/reset-integration-branches.mjs';

process.env.GH_TOKEN ??= 'test-token';

function githubFixture({ mergeBlocked = true } = {}) {
  const calls = [];
  const manifest = {
    branch: 'rc/1.10.31-rc.11',
    version: '1.10.31',
    rc: 11,
    frozen: true,
    repositories: { 'ControleOnline/sample': 'source-sha' },
  };
  const encodedManifest = Buffer.from(JSON.stringify(manifest)).toString('base64');
  const response = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

  const fetchImpl = async (input, options = {}) => {
    const url = new URL(String(input));
    const method = options.method ?? 'GET';
    const body = options.body ? JSON.parse(options.body) : {};
    calls.push({ path: `${url.pathname}${url.search}`, method, body });

    if (url.pathname === '/repos/ControleOnline/api-community/git/ref/heads/master') {
      return response(200, { object: { sha: 'release-master-sha' } });
    }
    if (url.pathname === '/repos/ControleOnline/api-community/contents/.release/rc-manifest.json') {
      return response(200, { content: encodedManifest });
    }
    if (url.pathname === '/repos/ControleOnline/api-community/git/ref/heads/rc/1.10.31-rc.11') {
      return response(200, { object: { sha: 'rc-commit' } });
    }
    if (url.pathname === '/repos/ControleOnline/api-community/git/commits/rc-commit') {
      return response(200, { tree: { sha: 'rc-tree' } });
    }
    if (url.pathname === '/repos/ControleOnline/api-community/compare/rc-commit...release-master-sha') {
      return response(200, { status: 'ahead', behind_by: 0 });
    }
    if (url.pathname === '/orgs/ControleOnline/repos') {
      return response(200, [{ full_name: 'ControleOnline/sample', archived: false }]);
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/ref/heads/master') {
      return response(200, { object: { sha: 'sample-master' } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/commits/source-sha') {
      return response(200, { tree: { sha: 'rc-tree' } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/commits/sample-master') {
      return response(200, { tree: { sha: 'master-tree' } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/ref/heads/dev') {
      return response(200, { object: { sha: 'dev-sha' } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/commits/dev-sha') {
      return response(200, { tree: { sha: 'old-tree' } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/git/ref/heads/staging') {
      return response(404, { message: 'Not Found' });
    }
    if (url.pathname.startsWith('/repos/ControleOnline/sample/git/ref/heads/automation/')) {
      return response(404, { message: 'Not Found' });
    }
    if (method === 'POST' && url.pathname === '/repos/ControleOnline/sample/git/commits') {
      assert.deepEqual(body.parents, ['dev-sha']);
      assert.equal(body.tree, 'master-tree');
      return response(201, { sha: 'reset-commit' });
    }
    if (method === 'POST' && url.pathname === '/repos/ControleOnline/sample/git/refs') {
      return response(201, { object: { sha: body.sha } });
    }
    if (url.pathname === '/repos/ControleOnline/sample/pulls') {
      if (method === 'POST') return response(201, { number: 42, state: 'open' });
      return response(200, []);
    }
    if (method === 'GET' && url.pathname === '/repos/ControleOnline/sample/pulls/42') {
      return response(200, {
        number: 42,
        state: 'open',
        mergeable: !mergeBlocked,
        mergeable_state: mergeBlocked ? 'blocked' : 'clean',
      });
    }
    if (method === 'PUT' && url.pathname === '/repos/ControleOnline/sample/pulls/42/merge') {
      return mergeBlocked
        ? response(405, { message: 'Required checks are pending' })
        : response(200, { merged: true });
    }
    throw new Error(`Unexpected fake GitHub request: ${method} ${url.pathname}${url.search}`);
  };

  return { calls, fetchImpl };
}

test('dry-run proposes normal PRs and creates missing refs without any writes', async () => {
  const { calls, fetchImpl } = githubFixture();
  const log = [];
  const result = await resetIntegrationBranches({
    fetchImpl,
    rcBranch: 'rc/1.10.31-rc.11',
    log: (line) => log.push(line),
  });

  assert.deepEqual(result, { repositories: 1, merged: 0, pending: 1, created: 1, unchanged: 0, errors: [] });
  assert.ok(log.some((line) => line.includes('DRY-RUN PR ControleOnline/sample:dev -> master')));
  assert.ok(log.some((line) => line.includes('DRY-RUN CREATE ControleOnline/sample:staging')));
  assert.ok(calls.every(({ method }) => method === 'GET'));
});

test('apply uses a protected pull request reset; it never force-updates an existing ref', async () => {
  const { calls, fetchImpl } = githubFixture();
  const result = await resetIntegrationBranches({
    apply: true,
    fetchImpl,
    rcBranch: 'rc/1.10.31-rc.11',
    log() {},
  });

  assert.deepEqual(result, { repositories: 1, merged: 0, pending: 1, created: 1, unchanged: 0, errors: [] });
  assert.ok(calls.some(({ method, path }) => method === 'POST' && path === '/repos/ControleOnline/sample/pulls'));
  assert.ok(calls.some(({ method, path }) => method === 'GET' && path.endsWith('/pulls/42')));
  assert.ok(calls.every(({ method, path }) => !(method === 'PUT' && path.endsWith('/pulls/42/merge'))));
  assert.ok(calls.every(({ method, path }) => !(method === 'PATCH' && path.includes('/git/refs/'))));
  const resetCommit = calls.find(({ method, path }) => method === 'POST' && path.endsWith('/git/commits'));
  assert.deepEqual(resetCommit.body.parents, ['dev-sha']);
  assert.equal(resetCommit.body.tree, 'master-tree');
});

test('apply merges the reset through GitHub when repository rules and checks permit it', async () => {
  const { fetchImpl } = githubFixture({ mergeBlocked: false });
  const result = await resetIntegrationBranches({
    apply: true,
    fetchImpl,
    rcBranch: 'rc/1.10.31-rc.11',
    log() {},
  });

  assert.equal(result.merged, 1);
  assert.equal(result.pending, 0);
});
