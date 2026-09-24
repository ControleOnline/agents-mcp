import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');
const policy = read('agents/skills/controleonline/shared-github-published-module-dependencies/SKILL.md');
const developer = read('agents/roles/developer/agent.md');
const devops = read('agents/roles/devops/agent.md');
const rc = read('agents/skills/controleonline/shared-github-release-candidate/SKILL.md');
const publication = read('agents/skills/controleonline/shared-github-master-publication/SKILL.md');

test('Developer and DevOps are directed to the published-module release contract', () => {
  const skillPath = 'shared-github-published-module-dependencies/SKILL.md';
  assert.ok(developer.includes(skillPath));
  assert.ok(devops.includes(skillPath));
  assert.ok(rc.includes(skillPath));
  assert.ok(publication.includes(skillPath));
});

test('production uses published packages and deterministic lockfiles, development keeps local modules', () => {
  assert.match(policy, /Development:.*`modules\//is);
  assert.match(policy, /Production frontend:.*`node_modules`/is);
  assert.match(policy, /Production PHP:.*`vendor\//is);
  assert.match(policy, /exact version.*`package-lock\.json`/is);
  assert.match(policy, /exact stable version.*`composer\.lock`/is);
  assert.match(policy, /Use `npm ci`/);
  assert.match(policy, /Do not rewrite `composer\.json`/);
});

test('release candidate freezes application version and package version-to-SHA mapping', () => {
  assert.match(rc, /Antes do freeze, atualize todos os arquivos de versao da aplicacao.*`X\.Y\.Z`/is);
  assert.match(rc, /"packages": \[/);
  for (const key of ['ecosystem', 'version', 'repository', 'sourceSha', 'tag']) {
    assert.ok(rc.includes(`"${key}"`), `RC manifest example lacks ${key}`);
  }
  assert.match(policy, /Only after explicit human authorization in\s+`Deploy`/i);
  assert.match(policy, /Never move or reuse an existing release tag\/version/i);
});
