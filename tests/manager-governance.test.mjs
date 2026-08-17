import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/by-role/manager/README.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
const workerDoc = fs.readFileSync('agents/skills/shared/operations/manager-worker-copilot.md', 'utf8');
const qaWorker = fs.readFileSync('.github/actions/workers/qa/action.yml', 'utf8');
const securityWorker = fs.readFileSync('.github/actions/workers/security/action.yml', 'utf8');

const completionLabels = [
  'qa:accepted',
  'security:accepted',
  'agent:technical-documenter:done',
  'agent:tutorial-assistant:done',
];

test('manager is fail-closed before hygiene', () => {
  assert.match(managerAgent, /prioridade fail-closed/i);
  assert.match(managerAgent, /P5 so pode iniciar.*P1.*P2.*P3.*P4.*vazias/is);
  assert.match(managerAgent, /nunca use higiene como fallback/i);
  assert.match(managerSkill, /P5 e proibida.*P1-P4/is);
});

test('scheduled managers recover global backlog independently of push', () => {
  assert.match(managerAgent, /Codex, Grok.*scheduler/is);
  assert.match(managerAgent, /nao dependem de novo push/i);
  assert.match(managerSkill, /consumidores globais.*recuperacao de backlog/is);
  assert.match(managerAgent, /QA.*Security.*P5/is);
});

test('workers remain push scoped and do not become backlog schedulers', () => {
  assert.match(workerDoc, /estritamente reativos a push/i);
  assert.match(workerDoc, /nao recuperam backlog historico/i);
  assert.match(workerDoc, /nao devem receber `schedule`/i);
  assert.match(qaWorker, /push-scoped/i);
  assert.match(securityWorker, /push-scoped/i);
});

test('critical worker dispatch failures are not masked', () => {
  assert.doesNotMatch(qaWorker, /gh issue edit[^\n]*\|\| true/);
  assert.doesNotMatch(securityWorker, /gh issue edit[^\n]*\|\| true/);
  assert.match(workerDoc, /nao usar `\|\| true`.*criticas/is);
});

test('closed and Done tasks require the complete four-label contract', () => {
  for (const label of completionLabels) {
    assert.ok(managerSkill.includes(`\`${label}\``), `missing completion label: ${label}`);
  }
  assert.match(managerSkill, /closed.*Done.*quarteto/is);
});

test('queue ordering is oldest first and never updatedAt', () => {
  assert.match(managerAgent, /createdAt.*crescente/i);
  assert.match(managerAgent, /updatedAt.*nunca.*orden/i);
});
