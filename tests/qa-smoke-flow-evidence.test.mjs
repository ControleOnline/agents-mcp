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

test('QA entrypoints require automated tests without a generic smoke gate', () => {
  for (const path of [
    'AGENTS.md',
    'agents/roles/qa/agent.md',
    'agents/skills/controleonline/by-role-qa-README/SKILL.md',
    'agents/skills/controleonline/shared-quality-code-quality/SKILL.md',
    'agents/skills/controleonline/shared-quality-review-checklists/SKILL.md',
    'workers/automation/qa/base.md',
    'workers/automate/quality-assurance.md',
    'workers/automate/scripts/pr-label-review-runner.mjs',
  ]) {
    const source = fs.readFileSync(path, 'utf8');
    assert.match(source, /testes automatizados/i, path);
    assert.match(source, /criada por humano/i, path);
    assert.doesNotMatch(source, /qualquer mudanca visivel em browser exige smoke|faltar smoke test em mudanca de UI|smoke obrigatório|smoke tests foram executados ou atualizados sempre que a interface foi tocada|nao aprova sem verificacao runtime\/UI/i, path);
  }
  assert.match(qaAgent, /QA não exige smokes/);
  assert.match(qaAgent, /Testes ausentes, falhando ou sem evidência de\s+execução justificam recusa/);
});

test('automated test integration is code, not generated artifacts', () => {
  assert.match(codeQuality, /Teste automatizado versionado x artefato de execução/);
  assert.match(codeQuality, /não são a entrega do teste, não substituem o código automatizado/);
  assert.match(smokeFlows, /não redefine a\s+entrega de um teste automatizado/);
  assert.match(smokeFlows, /não são a implementação do smoke/);
});

test('new smoke work requires verified human task provenance across roles', () => {
  for (const source of [smokeFlows, codeQuality, qaAgent]) {
    assert.match(source, /Nenhum agente pode adicionar testes smoke sem (?:uma )?tarefa específica criada por humano/);
    assert.match(source, /autoria/);
    assert.match(source, /escopo/);
    assert.match(source, /link/);
    assert.match(source, /mesmo usando conta\s+humana/);
  }
  assert.match(codeQuality, /Agentes não podem criar uma tarefa de smoke para autorizar o próprio trabalho/);
  assert.match(codeQuality, /todos os papéis/);
  assert.match(smokeFlows, /Não exigir sua publicação como condição geral de QA/);
});
