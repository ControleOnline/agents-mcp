import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const manager = fs.readFileSync('workers/automate/scripts/github-operations.mjs', 'utf8');
const publication = fs.readFileSync(
  'agents/skills/controleonline/shared-github-master-publication/SKILL.md',
  'utf8',
);
const stagingMerge = fs.readFileSync('workers/automate/staging-merge.md', 'utf8');

test('master promotion is guarded per task and rejects aggregate staging', () => {
  assert.match(manager, /assertTaskByTaskMasterPromotion/);
  assert.match(manager, /headRef\.toLowerCase\(\) === 'staging'/);
  assert.match(manager, /issue_number \?\? operation\.task_id/);
  assert.match(manager, /branchContainsIssueNumber\(headRef, issueNumber\)/);
  assert.match(manager, /await assertTaskByTaskMasterPromotion\(operation\)/);
});

test('publication guidance forbids staging-wide promotion', () => {
  assert.match(publication, /nunca use o branch agregado `staging`/i);
  assert.match(publication, /Recuse qualquer PR com `head=staging`/i);
  assert.match(stagingMerge, /tentativa de promover o branch agregado `staging` para `master`/i);
  assert.doesNotMatch(publication, /merge\/promocao autorizada \(`staging` → `master`\)/i);
});
