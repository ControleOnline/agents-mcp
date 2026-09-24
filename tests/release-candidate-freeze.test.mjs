import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const flow = fs.readFileSync('agents/skills/controleonline/shared-github-github-flow/SKILL.md', 'utf8');
const publication = fs.readFileSync('agents/skills/controleonline/shared-github-master-publication/SKILL.md', 'utf8');
const rc = fs.readFileSync('agents/skills/controleonline/shared-github-release-candidate/SKILL.md', 'utf8');
const staging = fs.readFileSync('workers/automate/staging-merge.md', 'utf8');
const moduleDependencies = fs.readFileSync('agents/skills/controleonline/shared-github-published-module-dependencies/SKILL.md', 'utf8');

test('release flow uses frozen RC with at most five tasks', () => {
  assert.match(rc, /1 a 5/);
  assert.match(rc, /frozen: true/);
  assert.match(rc, /rc\/X\.Y\.Z-rc\.N/);
  assert.match(publication, /mesma RC/i);
  assert.match(publication, /Nunca use `staging` como origem/i);
});

test('dev remains task-only while staging and master are RC-only', () => {
  assert.match(flow, /`dev`: origem obrigatória `task-/i);
  assert.match(flow, /`staging`: recebe RC congelada/i);
  assert.match(flow, /`master`: sua árvore de dependências deve apontar somente para branches `master`/i);
  assert.match(flow, /`staging`.*`staging` nos submódulos/i);
  assert.match(staging, /staging.*composição congelada/is);
});

test('mutating a frozen RC requires a new candidate', () => {
  assert.match(rc, /rc\.N\+1/);
  assert.match(staging, /rc\.N\+1/);
  assert.match(publication, /rc\.N\+1/);
});

test('RC updates application versions and freezes exact package release mapping', () => {
  assert.match(rc, /Antes do freeze, atualize todos os arquivos de versao da aplicacao para `X\.Y\.Z`/i);
  assert.match(rc, /mapeamento\/tag das dependencias publicadas/i);
  assert.match(rc, /"packages": \[/);
  assert.match(rc, /sourceSha/);
  assert.match(rc, /somente apos Deploy autorizado/i);
  assert.match(moduleDependencies, /Development:.*`modules\//is);
  assert.match(moduleDependencies, /Production frontend:.*`node_modules`/is);
  assert.match(moduleDependencies, /Production PHP:.*`vendor\//is);
  assert.match(moduleDependencies, /do not rewrite `composer\.json`/i);
  assert.match(moduleDependencies, /exact version.*`package-lock\.json`/is);
  assert.match(moduleDependencies, /Packagist.*VCS tags/i);
  assert.match(moduleDependencies, /Only after explicit human authorization in\s+`Deploy`/i);
});
