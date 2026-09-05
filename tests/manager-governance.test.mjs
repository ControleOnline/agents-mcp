import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/by-role/manager/README.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
const devopsAgent = fs.readFileSync('agents/roles/devops/agent.md', 'utf8');
const devopsSkill = fs.readFileSync('agents/skills/by-role/devops/README.md', 'utf8');
const workerDoc = fs.readFileSync('agents/skills/shared/operations/manager-worker-copilot.md', 'utf8');
const githubFlow = fs.readFileSync('agents/skills/shared/github/github-flow.md', 'utf8');
const githubOperations = fs.readFileSync('workers/automate/scripts/github-operations.mjs', 'utf8');
const githubOperationsDoc = fs.readFileSync('workers/automate/github-operations.md', 'utf8');
const managerWorker = fs.readFileSync('.github/actions/workers/manager/action.yml', 'utf8');
const qaWorker = fs.readFileSync('.github/actions/workers/qa/action.yml', 'utf8');
const securityWorker = fs.readFileSync('.github/actions/workers/security/action.yml', 'utf8');
const agentsMd = fs.readFileSync('AGENTS.md', 'utf8');
const developerAgent = fs.readFileSync('agents/roles/developer/agent.md', 'utf8');

const completionLabels = [
  'agent:qa:accepted',
  'agent:security:accepted',
  'agent:design:accepted',
  'agent:ux:accepted',
];

test('manager is fail-closed before hygiene', () => {
  assert.match(managerAgent, /prioridade fail-closed/i);
  assert.match(managerAgent, /P5 so inicia quando P1 vazia.*P2 vazia.*P3 vazia.*P4 sem/is);
  assert.match(managerAgent, /P6 so inicia quando P1 vazia.*P2 vazia.*P3 vazia.*P4 sem.*P5 sem/is);
  assert.match(managerAgent, /Nao use higiene nem documentacao de produto como fallback/i);
  assert.match(managerSkill, /P5 permanece bloqueada/i);
  assert.match(managerSkill, /P6 permanece bloqueada/i);
});

test('manager priority keeps DevOps before Hotfix and Developer before hygiene', () => {
  const p1 = managerAgent.indexOf('## Prioridade 1 - DevOps');
  const p2 = managerAgent.indexOf('## Prioridade 2 - Hotfix');
  const p5 = managerAgent.indexOf('## Prioridade 5 - Developer');
  const p6 = managerAgent.indexOf('## Prioridade 6 - Higiene residual + organizacao do board');
  const deployFirst = devopsAgent.indexOf('1. publicacao executavel em **`Deploy`**');
  const stagingSecond = devopsAgent.indexOf('2. todas as tasks quadruplo-accepted');

  assert.ok(p1 >= 0, 'manager P1 must be DevOps');
  assert.ok(p2 > p1, 'manager P2 must be Hotfix after DevOps');
  assert.ok(p5 > p2, 'manager P5 must be Developer');
  assert.ok(p6 > p5, 'manager P6 must be hygiene after Developer');
  assert.match(managerAgent, /Publique todas as tasks em `Deploy` → `master`/);
  assert.match(managerAgent, /promova todas as tasks quadruplo-accepted → `staging`/);
  assert.ok(deployFirst >= 0, 'DevOps must publish Deploy first');
  assert.ok(stagingSecond > deployFirst, 'DevOps must promote four-accepted work to staging after Deploy');
  assert.doesNotMatch(managerAgent, /hotfix.*prioridade absoluta/is);
  assert.match(managerSkill, /1\. \*\*DevOps\*/);
  assert.match(managerSkill, /2\. \*\*Hotfix\*/);
  assert.match(managerSkill, /5\. \*\*Developer\*/);
  assert.match(managerSkill, /6\. \*\*Higiene residual \+ board\*/);
  assert.match(devopsSkill, /`Deploy` → `master`; depois quarteto → `staging`; por ultimo PRs\/issues `agent:devops`/);
  assert.match(developerAgent, /Prioridade 5/);
  assert.match(agentsMd, /P5 Developer/);
  assert.match(agentsMd, /P6 Higiene residual \+ board/);
  assert.doesNotMatch(agentsMd, /Developer\*\* \*\*não\*\* participa deste mode/i);
  assert.doesNotMatch(managerAgent, /roda em paralelo e nao faz parte/i);
});

test('scheduled managers recover global backlog independently of push', () => {
  assert.match(managerAgent, /Agendamentos Manager \(Codex, Grok ou equivalente\)/i);
  assert.match(managerAgent, /consultam o estado global/i);
  assert.match(workerDoc, /A recuperacao global de backlog pertence aos agendamentos/i);
  assert.match(managerAgent, /QA.*Security.*P5/is);
});

test('workers remain push scoped and do not become backlog schedulers', () => {
  assert.match(workerDoc, /estritamente reativos a push/i);
  assert.match(workerDoc, /nao recuperam backlog historico/i);
  assert.match(workerDoc, /nao devem receber `schedule`/i);
  assert.match(workerDoc, /nao.*scheduler de backlog de Developer/is);
  assert.match(qaWorker, /push-scoped/i);
  assert.match(securityWorker, /push-scoped/i);
});

test('critical worker dispatch failures are not masked', () => {
  assert.doesNotMatch(qaWorker, /gh issue edit[^\n]*\|\| true/);
  assert.doesNotMatch(securityWorker, /gh issue edit[^\n]*\|\| true/);
  assert.match(workerDoc, /nao usar `\|\| true`.*criticas/is);
});

test('closed and Done tasks require the complete four-label contract', () => {
  const governanceSource = `${agentsMd}\n${managerSkill}`;
  for (const label of completionLabels) {
    assert.ok(governanceSource.includes(`\`${label}\``), `missing completion label: ${label}`);
  }
  assert.match(managerSkill, /Gate de staging \(quatro aprovacoes\)/i);
});

test('queue ordering is oldest first and never updatedAt', () => {
  assert.match(managerAgent, /createdAt.*crescente/i);
  assert.match(managerAgent, /updatedAt.*nao ordena/i);
});

test('In Review is protected as a per-task human-review column', () => {
  assert.match(managerAgent, /In Review.*task ja em staging aguardando conferencia humana/is);
  assert.match(managerAgent, /Nao remover da coluna/i);
  assert.match(managerSkill, /In Review.*task ja em staging/i);
  assert.match(githubFlow, /In Review[\s\S]*Nenhum Manager\/higiene remove da coluna/is);
});

test('generic project_status runner refuses automatic In Review removal', () => {
  assert.match(githubOperations, /function assertAllowedProjectStatusTransition/);
  assert.match(githubOperations, /from !== 'in review'/);
  assert.match(githubOperations, /human_authorized_rc_removal=true/);
  assert.match(githubOperationsDoc, /Protecao de freeze/i);
  assert.match(githubOperationsDoc, /recusa `In Review` → `Working`\/`Ready`/i);
});

test('Blocked and Backlog are human-only columns for agents and workers', () => {
  const issueDiscovery = fs.readFileSync('agents/skills/shared/operations/issue-queue-discovery.md', 'utf8');
  const agentDispatch = fs.readFileSync('workers/automate/scripts/agent-project-dispatch.mjs', 'utf8');
  const developerDispatch = fs.readFileSync('workers/automate/scripts/developer-project-dispatch.mjs', 'utf8');
  const flowSync = fs.readFileSync('workers/automate/scripts/agent-flow-sync.mjs', 'utf8');
  const ctoSupervisor = fs.readFileSync('workers/automate/scripts/cto-project-supervisor.mjs', 'utf8');
  const directPushIngest = fs.readFileSync('workers/src/direct-push-ingest.js', 'utf8');

  assert.match(managerAgent, /Nenhum agent seleciona a coluna \*\*`Blocked`\*\* ou \*\*`Backlog`\*\* como fila normal/i);
  assert.match(managerSkill, /qualquer.*prioridade.*nao usar.*Blocked.*Backlog/is);
  assert.match(workerDoc, /se a issue resolvida ja estiver.*Blocked.*Backlog.*nao despachar/is);
  assert.match(managerWorker, /blocked\|backlog/i);
  assert.match(managerWorker, /run_qa=false/);
  assert.match(managerWorker, /exit 0/);
  assert.match(issueDiscovery, /Se for \*\*`Blocked`\*\* ou \*\*`Backlog`\*\*: descarte/i);

  for (const [path, source] of [
    ['github-operations', githubOperations],
    ['agent-project-dispatch', agentDispatch],
    ['developer-project-dispatch', developerDispatch],
    ['agent-flow-sync', flowSync],
    ['cto-project-supervisor', ctoSupervisor],
    ['direct-push-ingest', directPushIngest],
  ]) {
    assert.match(source, /PROTECTED_PROJECT_STATUSES/, path);
    assert.match(source, /blocked.*backlog|backlog.*blocked/is, path);
  }

  assert.match(githubOperations, /Blocked and Backlog are human-only columns/i);
});
