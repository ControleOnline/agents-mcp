import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const publication = fs.readFileSync('agents/skills/controleonline/shared-github-master-publication/SKILL.md', 'utf8');
const stagingMerge = fs.readFileSync('workers/automate/staging-merge.md', 'utf8');
const rc = fs.readFileSync('agents/skills/controleonline/shared-github-release-candidate/SKILL.md', 'utf8');

test('master promotion rejects aggregate staging and requires homologated RC', () => {
  assert.match(publication, /Release Candidate congelada/i);
  assert.match(publication, /Nunca use `staging` como origem/i);
  assert.match(publication, /1 a 5 tasks/i);
  assert.match(stagingMerge, /mesma RC/i);
});

test('RC is technical composition, never an aggregator issue', () => {
  assert.match(rc, /artefato tecnico/i);
  assert.match(rc, /nao task de produto/i);
  assert.match(rc, /1 a 5/i);
});
