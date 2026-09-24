import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { parseRcBranch, validateGovernanceSource, validateIntegrationSource, validateRcManifest } from '../workers/automate/devops/integration-source-policy.mjs';

const manifest = {
  version: '1.10.27',
  rc: 2,
  branch: 'rc/1.10.27-rc.2',
  baseMaster: 'a'.repeat(40),
  tasks: [821, 826, 827],
  repositories: {
    'ControleOnline/app-community': 'b'.repeat(40),
    'ControleOnline/ui-common': 'c'.repeat(40),
  },
  frozen: true,
};

test('dev accepts every source without requiring an RC', () => {
  for (const sourceBranch of ['task-827', 'staging', 'master', 'rc/1.10.27-rc.1', 'automation/reset-master-dev']) {
    assert.equal(validateIntegrationSource({ sourceBranch, targetBranch: 'dev' }).allowed, true);
  }
});

test('staging and master accept only frozen validated RCs', () => {
  for (const targetBranch of ['staging', 'master']) {
    const result = validateIntegrationSource({ sourceBranch: manifest.branch, targetBranch, manifest });
    assert.equal(result.allowed, true);
    assert.equal(result.type, 'rc');
    assert.deepEqual(result.tasks, [821, 826, 827]);
  }
});

test('RC is limited to five unique tasks and immutable manifest identity', () => {
  assert.equal(parseRcBranch('rc/1.10.27-rc.2').version, '1.10.27');
  assert.throws(() => validateRcManifest({ ...manifest, tasks: [1,2,3,4,5,6] }, manifest.branch), /1 and 5/);
  assert.throws(() => validateRcManifest({ ...manifest, tasks: [1,1] }, manifest.branch), /unique/);
  assert.throws(() => validateRcManifest({ ...manifest, frozen: false }, manifest.branch), /frozen/);
  assert.throws(() => validateRcManifest({ ...manifest, branch: 'rc/1.10.28-rc.2' }, manifest.branch), /does not match/);
});

test('the GitHub RC gate requires product metadata to match the frozen version', () => {
  const workflow = fs.readFileSync('.github/workflows/integration-source-gate.yml', 'utf8');
  assert.match(workflow, /package\.json/);
  assert.match(workflow, /app\.json/);
  assert.match(workflow, /pkg\.version !== m\.version \|\| app\.expo\?\.version !== m\.version/);
});

test('aggregate/manual sources remain forbidden', () => {
  for (const targetBranch of ['staging', 'master']) {
    for (const sourceBranch of ['dev', 'staging', 'master', 'release/1.10.27', 'tasks-821-826', 'task-827']) {
      assert.equal(validateIntegrationSource({ sourceBranch, targetBranch, manifest }).allowed, false);
    }
  }
});

test('only the exact reset-automation governance branch and file set may target master', () => {
  const allowed = validateGovernanceSource({
    repository: 'ControleOnline/agents-mcp',
    sourceBranch: 'automation/reset-integration-branches',
    targetBranch: 'master',
    changedFiles: [
    '.github/workflows/integration-source-gate.yml',
    '.github/workflows/reset-aggregate-branches.yml',
    'workers/automate/scripts/reset-integration-branches.mjs',
    ],
  });
  assert.equal(allowed.allowed, true);
  assert.equal(validateGovernanceSource({
    repository: 'ControleOnline/agents-mcp',
    sourceBranch: 'automation/reset-integration-branches',
    targetBranch: 'master',
    changedFiles: ['agents/roles/manager/agent.md'],
  }).allowed, false);
  assert.equal(validateGovernanceSource({
    repository: 'ControleOnline/app-community',
    sourceBranch: 'automation/reset-integration-branches',
    targetBranch: 'master',
    changedFiles: ['.github/workflows/reset-aggregate-branches.yml'],
  }).allowed, false);
});

test('only the reviewed agents-mcp governance PR can bypass RC source on master', () => {
  const changedFiles = [
    'AGENTS.md',
    '.github/workflows/github-operations.yml',
    'workers/automate/scripts/github-operations.mjs',
    'tests/qa-local-approval.test.mjs',
  ];
  assert.deepEqual(
    validateGovernanceSource({
      repository: 'ControleOnline/agents-mcp',
      sourceBranch: 'task-paperclip-status-distinction',
      targetBranch: 'master',
      changedFiles,
    }),
    { allowed: true, protectedTarget: true, type: 'governance' },
  );
  for (const override of [
    { repository: 'ControleOnline/app-community' },
    { sourceBranch: 'task-837' },
    { changedFiles: [...changedFiles, 'app/src/product.js'] },
    { changedFiles: [] },
  ]) {
    assert.equal(
      validateGovernanceSource({
        repository: 'ControleOnline/agents-mcp',
        sourceBranch: 'task-paperclip-status-distinction',
        targetBranch: 'master',
        changedFiles,
        ...override,
      }).allowed,
      false,
    );
  }
});
