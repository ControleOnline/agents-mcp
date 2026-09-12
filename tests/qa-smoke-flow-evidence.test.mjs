import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const smokeFlows = fs.readFileSync(
  'agents/skills/controleonline/shared-quality-smoke-test-flows/SKILL.md',
  'utf8',
);
const codeQuality = fs.readFileSync(
  'agents/skills/controleonline/shared-quality-code-quality/SKILL.md',
  'utf8',
);
const qaAgent = fs.readFileSync('agents/roles/qa/agent.md', 'utf8');

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

test('automated test integration is code, not generated artifacts', () => {
  assert.match(codeQuality, /Teste automatizado versionado x artefato de execução/);
  assert.match(codeQuality, /não são a entrega do teste, não substituem o código automatizado/);
  assert.match(smokeFlows, /não redefine a\s+entrega de um teste automatizado/);
  assert.match(smokeFlows, /não são a implementação do smoke/);
});

test('QA uses local flow evidence and DevOps owns published flowcharts', () => {
  const qaReadme = fs.readFileSync('agents/skills/controleonline/by-role-qa-README/SKILL.md', 'utf8');

  for (const source of [smokeFlows, codeQuality, qaAgent, qaReadme]) {
    assert.match(source, /prints? por etapa|prints?\/screenshot|screenshot para cada etapa/i);
  }

  assert.match(smokeFlows, /flowchartIds/);
  assert.match(smokeFlows, /\/flowcharts/);
  assert.match(smokeFlows, /Após a promoção[\s\S]*DevOps|Apos a promocao[\s\S]*DevOps/i);
  assert.match(codeQuality, /responsabilidade do DevOps após promoção|responsabilidade do DevOps apos promocao/i);
  assert.match(qaAgent, /não bloqueie o aceite por indisponibilidade de servidor|nao bloqueie o aceite por indisponibilidade de servidor/i);
  assert.match(qaReadme, /QA não exige staging|QA nao exige staging/i);
  assert.match(smokeFlows, /api-token/);
  assert.match(smokeFlows, /app-domain: admin\.controleonline\.com/);
  assert.match(smokeFlows, /admin-api\.json/);
  assert.match(smokeFlows, /nunca no git|Não colar o token/i);
  assert.match(smokeFlows, /outros/);
});
