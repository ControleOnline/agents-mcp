import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/controleonline/by-role-manager-README/SKILL.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
const queueDiscovery = fs.readFileSync(
  'agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md',
  'utf8',
);
const workerDoc = fs.readFileSync('agents/skills/controleonline/shared-operations-manager-worker-copilot/SKILL.md', 'utf8');
const qaWorker = fs.readFileSync('.github/actions/workers/qa/action.yml', 'utf8');
const securityWorker = fs.readFileSync('.github/actions/workers/security/action.yml', 'utf8');
const deliveryProof = fs.readFileSync(
  'agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md',
  'utf8',
);
const conflictResolution = fs.readFileSync(
  'agents/skills/controleonline/shared-github-conflict-resolution/SKILL.md',
  'utf8',
);
const githubOperations = fs.readFileSync('workers/automate/scripts/github-operations.mjs', 'utf8');
const githubOperationsDoc = fs.readFileSync('workers/automate/github-operations.md', 'utf8');
const issueHandling = fs.readFileSync(
  'agents/skills/controleonline/shared-github-github-issue-handling/SKILL.md',
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
  assert.match(managerAgent, /P7 e fallback estrito/i);
  assert.match(managerAgent, /P6 \(Developer\) so pode iniciar/i);
  assert.match(managerAgent, /nunca use Higiene \(P7\) como fallback/i);
  assert.match(managerAgent, /Prioridade 4 - Developer: rejeicoes/i);
  assert.match(managerAgent, /Prioridade 5 - Validadores/i);
  assert.match(managerAgent, /Prioridade 6 - Developer: novos desenvolvimentos/i);
  assert.match(managerAgent, /Prioridade 7 - Higiene residual/i);
});

test('manager prioritizes rejected work before validators and new development', () => {
  const order = managerAgent.match(
    /Prioridade 4 - Developer: rejeicoes[\s\S]*Prioridade 5 - Validadores[\s\S]*Prioridade 6 - Developer: novos desenvolvimentos[\s\S]*Prioridade 7 - Higiene residual/,
  );
  assert.ok(order, 'expected rejection -> validators -> new development -> hygiene order');
  assert.match(managerAgent, /agent:qa:rejected/);
  assert.match(managerAgent, /agent:security:rejected/);
});

test('Deploy is explicit human publication authorization', () => {
  assert.match(managerAgent, /coluna \*\*`Deploy`\*\*[\s\S]*autorizacao humana explicita[\s\S]*deve executar/i);
  assert.doesNotMatch(managerAgent, /P1_SKIPPED_HUMAN_DEPLOY/);
  assert.match(queueDiscovery, /coluna \*\*`Deploy`\*\*[\s\S]*autorizacao humana explicita[\s\S]*publicar em `master`/i);
  assert.doesNotMatch(queueDiscovery, /unico bloqueio for gate humano de Deploy/i);
});

test('Deploy publication branches by validator quartet', () => {
  assert.match(managerAgent, /coluna \*\*`Deploy`\*\*[\s\S]*master[\s\S]*quatro[\s\S]*Done[\s\S]*sem o quarteto[\s\S]*Working[\s\S]*segunda rodada/i);
  const devopsAgent = fs.readFileSync('agents/roles/devops/agent.md', 'utf8');
  assert.match(devopsAgent, /coluna `Deploy`[\s\S]*master[\s\S]*quatro accepts[\s\S]*Done[\s\S]*sem o quarteto[\s\S]*Working/i);
});

test('rejection recovery includes GitHub workflow and publication repair', () => {
  assert.match(managerAgent, /responsabilidade do Developer vai ate a entrega publicavel/i);
  assert.match(managerAgent, /GitHub Actions.*workflow.*build/is);
  assert.match(managerAgent, /repetir a execucao, rerotear ou reconstruir/is);
  assert.match(managerAgent, /publicacao\/deploy.*DevOps/is);

  const developerAgent = fs.readFileSync('agents/roles/developer/agent.md', 'utf8');
  assert.match(developerAgent, /Obrigacao reforcada para rejeicoes/i);
  assert.match(developerAgent, /workflow.*build/is);
  assert.match(developerAgent, /publicacao\/deploy.*DevOps/is);
  assert.match(developerAgent, /Nao mascare\s+falhas/i);
});

test('confusing merges restart the task from remote master and reset Notion flow', () => {
  assert.match(conflictResolution, /em qualquer etapa.*confuso/is);
  assert.match(conflictResolution, /apagar a branch.*recri[aá].*master.*passos iniciais/is);
  assert.match(conflictResolution, /retroceda o item no Notion.*Working/is);
  assert.match(conflictResolution, /Nunca herde labels, accepts, screenshots.*execução apagada/is);
  assert.match(managerAgent, /descartar a branch.*recriar.*master.*passos iniciais/is);
  assert.match(managerAgent, /retroceder a task no Notion.*labels.*evidências/is);
});

test('manager cannot close a round with commentary-only progress', () => {
  assert.match(managerAgent, /delivery-proof-contract(?:\.md|\/SKILL\.md)/i);
  assert.match(managerAgent, /coment[aá]rio.*substitui|coment[aá]rio.*não é entrega/i);
  assert.match(managerAgent, /DELIVERY_PROOF/i);
  assert.match(managerSkill, /NEXT_ACTION/i);
  assert.doesNotMatch(managerSkill, /agent:<papel>:blocked/i);
  assert.match(managerSkill, /mesmos SHAs, labels, coluna e evid[eê]ncia/i);
  assert.match(deliveryProof, /Um comentário só pode acompanhar a mutação/i);
  assert.match(deliveryProof, /commit novo publicado.*ref remota/is);
  assert.match(deliveryProof, /não crie,[\s\S]*tag `agent:\*:blocked`/is);
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
  assert.match(managerAgent, /QA.*Security.*P6|Developer/is);
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

test('agents cannot create or apply blocking labels or terminal blocks', () => {
  assert.match(managerAgent, /Proibicao de tags de bloqueio/i);
  assert.match(managerAgent, /labels `agent:\*:blocked`/i);
  assert.match(managerSkill, /labels `agent:\*:blocked`/i);
  assert.match(deliveryProof, /não crie[\s\S]*tag `agent:\*:blocked`/i);
  assert.doesNotMatch(managerAgent, /`agent:<papel>:blocked`/i);
  assert.doesNotMatch(managerSkill, /`agent:<papel>:blocked`/i);
});

test('In Review protection is per-task, not an RC inventory', () => {
  assert.match(githubOperations, /function hasHumanAuthorizedInReviewRemoval/);
  assert.match(githubOperations, /human_authorized_in_review_removal=true/);
  assert.match(githubOperationsDoc, /Protecao de `In Review`/i);
  assert.doesNotMatch(githubOperations, /frozen RC package|changes the RC inventory/i);
  assert.doesNotMatch(githubOperationsDoc, /pacote de RC|remocao de item do RC|Protecao de freeze/i);
  assert.match(issueHandling, /nao em uma task pai de pacote/);
  assert.match(issueHandling, /referencia para a task\/-?`Deploy`/);
});
