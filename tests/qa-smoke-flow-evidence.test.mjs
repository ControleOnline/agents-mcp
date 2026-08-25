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
