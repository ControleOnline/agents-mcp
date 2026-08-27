import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const smokeFlows = fs.readFileSync(
  'agents/skills/shared/quality/smoke-test-flows.md',
  'utf8',
);
const codeQuality = fs.readFileSync(
  'agents/skills/shared/quality/code-quality.md',
  'utf8',
);
const qaAgent = fs.readFileSync('agents/roles/qa/agent.md', 'utf8');
const masterPublication = fs.readFileSync(
  'agents/skills/shared/github/master-publication.md',
  'utf8',
);
const githubIssueHandling = fs.readFileSync(
  'agents/skills/shared/github/github-issue-handling.md',
  'utf8',
);

test('canonical smoke flow catalog matches ControleOnline business flows', () => {
  for (const flowId of [
    'produto-cadastro',
    'compra-fluxo',
    'device-configuracao',
    'pedido-criacao',
    'producao-fluxo',
    'integracao-api',
    'outros',
  ]) {
    assert.match(smokeFlows, new RegExp(`\\\`${flowId}\\\``));
  }

  assert.doesNotMatch(smokeFlows, /leilao|embarcador|transportador|viagem/i);
});

test('QA gate requires screenshots for every UI/browser smoke step', () => {
  for (const source of [smokeFlows, codeQuality, qaAgent]) {
    assert.match(source, /fluxo: <id>/);
    assert.match(source, /prints?\/screenshot|prints? por etapa|screenshot para cada etapa/i);
  }

  assert.match(smokeFlows, /QA \*\*não pode aprovar\*\* smoke test de UI\/browser/i);
  assert.match(codeQuality, /evidencia parcial bloqueia QA/i);
  assert.match(qaAgent, /Evidencia visual completa do fluxo/i);
});

test('QA gate requires admin flowchartIds plus per-step prints', () => {
  const qaReadme = fs.readFileSync('agents/skills/by-role/qa/README.md', 'utf8');

  for (const source of [smokeFlows, codeQuality, qaAgent, qaReadme]) {
    assert.match(source, /flowchartIds/);
    assert.match(source, /\/flowcharts/);
    assert.match(source, /prints? por etapa/i);
  }

  assert.match(smokeFlows, /api-token/);
  assert.match(smokeFlows, /app-domain: admin\.controleonline\.com/);
  assert.match(smokeFlows, /admin-api\.json/);
  assert.match(smokeFlows, /nunca no git|Não colar o token/i);
  assert.match(smokeFlows, /outros/);
  assert.match(qaAgent, /falta de flowchart ou falta de print por etapa/);
  assert.match(qaReadme, /falta de flowchart ou falta de print por etapa/);
});

test('browser smoke failures become developer follow-up tasks', () => {
  for (const source of [codeQuality, masterPublication, githubIssueHandling]) {
    assert.match(source, /smoke de browser\/UI|smokes de browser\/UI/i);
    assert.match(source, /Ready/);
    assert.match(source, /`hotfix`/);
    assert.match(source, /`bug`/);
    assert.match(source, /`agent:developer`/);
    assert.match(source, /fluxo: <id>|`fluxo: <id>`/);
    assert.match(source, /sanitizad[ao]|segredo|credenciais/i);
  }

  assert.match(masterPublication, /nao transforme isso em comentario solto/i);
  assert.match(githubIssueHandling, /nao use assignee/i);
  assert.match(githubIssueHandling, /fluxo e erro raiz/i);
});
