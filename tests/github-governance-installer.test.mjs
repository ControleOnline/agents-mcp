import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('workers/automate/scripts/apply-github-governance.mjs', 'utf8');
const workflow = fs.readFileSync('.github/workflows/apply-github-governance.yml', 'utf8');

test('governance installer is fail-closed and organization scoped', () => {
  assert.match(source, /ControleOnline/);
  assert.match(source, /WORKING_LIMIT = 5/);
  assert.match(source, /refs\/heads\/dev/);
  assert.match(source, /refs\/heads\/staging/);
  assert.match(source, /refs\/heads\/master/);
  assert.match(source, /required_status_checks/);
  assert.match(source, /bypass_actors: \[\]/);
});

test('installer provisions gate before ruleset and normalizes overflow', () => {
  assert.ok(source.indexOf('installWorkflow(repo)') < source.indexOf('upsertRuleset(repo)'));
  assert.match(source, /working\.slice\(WORKING_LIMIT\)/);
  assert.match(source, /option\.name === 'Ready'/);
});

test('workflow consumes administrative secret without printing it', () => {
  assert.match(workflow, /secrets\.GH_TOKEN/);
  assert.match(workflow, /workflow_dispatch/);
  assert.doesNotMatch(workflow, /echo.*GH_TOKEN/i);
});
