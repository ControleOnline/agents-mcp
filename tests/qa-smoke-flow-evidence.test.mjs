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
const githubFlow = fs.readFileSync(
  'agents/skills/shared/github/github-flow.md',
  'utf8',
);
const agentsMd = fs.readFileSync('AGENTS.md', 'utf8');
const githubIssueHandling = fs.readFileSync(
  'agents/skills/shared/github/github-issue-handling.md',
  'utf8',
);
const qaReadme = fs.readFileSync('agents/skills/by-role/qa/README.md', 'utf8');
const qaBase = fs.readFileSync('workers/automation/qa/base.md', 'utf8');
const reviewChecklist = fs.readFileSync('workers/automate/review-checklists.md', 'utf8');

test('canonical smoke flow catalog matches ControleOnline business flows', () => {
  for (const flowId of [
    'produto-cadastro',
    'compra-fluxo',
    'device-configuracao',
    'pedido-criacao',
    'sales-production',
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

test('QA gate requires central wiki flow, top-level page step, and per-step prints', () => {
  for (const source of [smokeFlows, codeQuality, qaAgent, qaReadme]) {
    assert.match(source, /página wiki|wiki.*fonte|wiki.*fluxo/i);
    assert.match(source, /etapa/);
    assert.match(source, /prints? por etapa/i);
  }

  assert.match(smokeFlows, /índice central/);
  assert.match(smokeFlows, /`sales-production`/);
  assert.match(smokeFlows, /comentário de topo/);
  assert.doesNotMatch(smokeFlows, /GET .*\/flowcharts|admin\.controleonline\.com\/admin\/flowcharts/);
  assert.doesNotMatch(qaAgent, /GET .*\/flowcharts|admin\.controleonline\.com\/admin\/flowcharts/);
});

test('direct-master exceptions are explicit and bounded', () => {
  const sources = `${agentsMd}\n${githubFlow}\n${masterPublication}`;
  assert.match(sources, /documentação pura/i);
  assert.match(sources, /exclusivamente de testes/i);
  assert.match(sources, /sem runtime de produto/i);
  assert.match(sources, /task-\{id\}.*master/is);
  assert.match(sources, /issue\/task.*Done|task.*Done/is);
  assert.match(sources, /issue\/task/i);
  assert.match(sources, /diff revisado/i);
  assert.match(sources, /confirmação do push|confirmação do SHA remoto/i);
});

test('browser smoke failures become developer follow-up tasks', () => {
  for (const source of [codeQuality, githubIssueHandling]) {
    assert.match(source, /smoke de browser\/UI|smokes de browser\/UI/i);
    assert.match(source, /Ready/);
    assert.match(source, /`hotfix`/);
    assert.match(source, /`bug`/);
    assert.match(source, /`agent:developer`/);
    assert.match(source, /fluxo: <id>|`fluxo: <id>`/);
    assert.match(source, /sanitizad[ao]|segredo|credenciais/i);
  }

  assert.match(masterPublication, /hotfix estrutural.*agents-mcp/i);
  assert.match(githubIssueHandling, /nao use assignee/i);
  assert.match(githubIssueHandling, /fluxo e erro raiz/i);
});

test('QA rejects when required tests did not run', () => {
  for (const source of [qaAgent, qaReadme, qaBase, reviewChecklist]) {
    assert.match(source, /testes obrigatorios do escopo/i);
    assert.match(source, /agent:qa:rejected/);
    assert.match(source, /Developer/);
  }

  assert.match(reviewChecklist, /se nao houver evidencia de execucao.*recusar imediatamente/is);
  assert.match(qaAgent, /nao houver evidencia objetiva de execucao.*recusar imediatamente/is);
  assert.match(qaBase, /sem prova de testes executados.*devolva para o `Developer`/is);
});
