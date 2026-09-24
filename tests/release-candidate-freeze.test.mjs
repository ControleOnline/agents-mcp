import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const flow = fs.readFileSync('agents/skills/controleonline/shared-github-github-flow/SKILL.md', 'utf8');
const publication = fs.readFileSync('agents/skills/controleonline/shared-github-master-publication/SKILL.md', 'utf8');
const rc = fs.readFileSync('agents/skills/controleonline/shared-github-release-candidate/SKILL.md', 'utf8');
const staging = fs.readFileSync('workers/automate/staging-merge.md', 'utf8');

test('release flow uses frozen RC with at most five tasks', () => {
  assert.match(rc, /1 a 5/);
  assert.match(rc, /frozen: true/);
  assert.match(rc, /rc\/X\.Y\.Z-rc\.N/);
  assert.match(publication, /mesma RC/i);
  assert.match(publication, /Nunca use `staging` como origem/i);
});

test('dev remains task-only while staging and master are RC-only', () => {
  assert.match(flow, /`dev`: origem obrigatória `task-/i);
  assert.match(flow, /`staging`: origem obrigatória `rc\//i);
  assert.match(flow, /`master`: origem obrigatória da \*\*mesma RC homologada\*\*/i);
  assert.match(staging, /staging.*composição congelada/is);
});

test('mutating a frozen RC requires a new candidate', () => {
  assert.match(rc, /rc\.N\+1/);
  assert.match(staging, /rc\.N\+1/);
  assert.match(publication, /rc\.N\+1/);
});
