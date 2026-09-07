import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/by-role/manager/README.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
const workerDoc = fs.readFileSync('agents/skills/shared/operations/manager-worker-copilot.md', 'utf8');
const qaWorker = fs.readFileSync('.github/actions/workers/qa/action.yml', 'utf8');
const securityWorker = fs.readFileSync('.github/actions/workers/security/action.yml', 'utf8');
const deliveryProof = fs.readFileSync(
  'agents/skills/shared/operations/delivery-proof-contract.md',
  'utf8',
);

const completionLabels = [
  'qa:accepted',
  'security:accepted',
  'agent:technical-documenter:done',
  'agent:tutorial-assistant:done',
];

test('manager is fail-closed before hygiene', () => {
  assert.match(managerAgent, /prioridade e fail-closed/i);
  assert.match(managerAgent, /P6 e fallback estrito/i);
  assert.match(managerAgent, /P5 \(Developer\) so pode iniciar/i);
  assert.match(managerAgent, /nunca use higiene \(P6\) como fallback/i);
  assert.match(managerAgent, /Prioridade 5 - Developer/i);
  assert.match(managerAgent, /Prioridade 6 - Higiene residual/i);
});

test('manager cannot close a round with commentary-only progress', () => {
  assert.match(managerAgent, /delivery-proof-contract\.md/i);
  assert.match(managerAgent, /coment[aá]rio.*substitui|coment[aá]rio.*não é entrega/i);
  assert.match(managerAgent, /DELIVERY_PROOF/i);
  assert.match(managerSkill, /agent:<papel>:blocked/i);
  assert.match(managerSkill, /mesmos SHAs, labels, coluna e evid[eê]ncia/i);
  assert.match(deliveryProof, /Um comentário só pode acompanhar a mutação/i);
  assert.match(deliveryProof, /commit novo publicado.*ref remota/is);
  assert.match(deliveryProof, /mova o item atual.*Blocked/is);
  assert.match(deliveryProof, /mesmos SHAs, labels, coluna e evidência.*não repita/is);
  assert.match(deliveryProof, /DELIVERY_PROOF:/);
});

test('agents-mcp governance is published directly without validator approval', () => {
  assert.match(deliveryProof, /Governança \(`agents-mcp`\)[\s\S]*não aguarda QA, Security, Design, UX ou aprovação humana/i);
  assert.match(deliveryProof, /governança do próprio `agents-mcp`[\s\S]*Não se cria[\s\S]*handoff para validadores/i);
  assert.match(managerAgent, /publicacao de governanca do proprio `agents-mcp`[\s\S]*nao aguarda QA/is);
  assert.match(managerSkill, /Governança publicada no próprio `agents-mcp`[\s\S]*sem aprovação ou[\s\S]*handoff para QA/is);
});

test('scheduled managers recover global backlog independently of push', () => {
  assert.match(managerAgent, /Codex, Grok.*scheduler/is);
  assert.match(managerAgent, /nao dependem de novo push/i);
  assert.match(managerSkill, /consumidores globais.*recuperacao de backlog/is);
  assert.match(managerAgent, /QA.*Security.*P5|Developer/is);
});

test('workers remain push scoped and do not become backlog schedulers', () => {
  assert.match(workerDoc, /estritamente reativos a push/i);
  assert.match(workerDoc, /nao recuperam backlog historico/i);
  assert.match(workerDoc, /nao devem receber `schedule`/i);
  assert.match(qaWorker, /push-scoped/i);
  assert.match(securityWorker, /push-scoped/i);
});

test('manager worker does not mask critical label assignment failures', () => {
  const managerAction = fs.readFileSync('.github/actions/workers/manager/action.yml', 'utf8');
  const managerWorkflow = fs.readFileSync('.github/workflows/manager-worker.yml', 'utf8');
  assert.doesNotMatch(managerAction, /gh issue edit[^\n]*--add-label[^\n]*\|\| true/);
  assert.doesNotMatch(managerWorkflow, /gh issue edit[^\n]*--add-label[^\n]*\|\| true/);
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
