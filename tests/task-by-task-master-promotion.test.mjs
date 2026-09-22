import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const manager = fs.readFileSync('workers/automate/scripts/github-operations.mjs', 'utf8');
const publication = fs.readFileSync(
  'agents/skills/controleonline/shared-github-master-publication/SKILL.md',
  'utf8',
);
const stagingMerge = fs.readFileSync('workers/automate/staging-merge.md', 'utf8');

test('master promotion is guarded by the frozen RC inventory', () => {
  assert.match(manager, /assertTaskByTaskMasterPromotion/);
  assert.match(manager, /headRef\.toLowerCase\(\) === 'staging'/);
  assert.match(manager, /rc_id/);
  assert.match(manager, /rc_inventory_confirmed/);
  assert.match(manager, /issue_number \?\? operation\.task_id/);
  assert.match(manager, /branchContainsIssueNumber\(headRef, issueNumber\)/);
  assert.match(manager, /await assertTaskByTaskMasterPromotion\(operation\)/);
});

test('publication guidance permits only confirmed RC promotion', () => {
  assert.match(publication, /RC inventariado/i);
  assert.match(publication, /branches inventariadas no \*\*RC\*\*/i);
  assert.match(stagingMerge, /pacote RC/i);
  assert.doesNotMatch(publication, /Recuse qualquer PR com `head=staging`/i);
});
