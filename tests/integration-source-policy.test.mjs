import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseTaskBranch,
  validateIntegrationSource,
} from '../workers/automate/devops/integration-source-policy.mjs';

test('protected integration branches accept only individual numeric task branches', () => {
  for (const targetBranch of ['dev', 'staging', 'master']) {
    const result = validateIntegrationSource({ sourceBranch: 'task-827', targetBranch });
    assert.equal(result.allowed, true);
    assert.equal(result.issueNumber, 827);
  }
});

test('aggregate branches are rejected as sources for dev staging and master', () => {
  for (const sourceBranch of ['dev', 'staging', 'master', 'release/1.2.3', 'rc/12', 'tasks-821-826']) {
    for (const targetBranch of ['dev', 'staging', 'master']) {
      assert.equal(validateIntegrationSource({ sourceBranch, targetBranch }).allowed, false);
    }
  }
});

test('task branch syntax is exact and cannot hide an aggregator', () => {
  assert.deepEqual(parseTaskBranch('task-123'), { branch: 'task-123', issueNumber: 123 });
  for (const branch of ['task-0', 'task-12-extra', 'task-12-13', 'task-abc', 'feature/task-12']) {
    assert.equal(parseTaskBranch(branch), null);
  }
});
