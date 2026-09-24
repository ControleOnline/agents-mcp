import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const managerSkill = fs.readFileSync('agents/skills/controleonline/by-role-manager-README/SKILL.md', 'utf8');
const managerAgent = fs.readFileSync('agents/roles/manager/agent.md', 'utf8');
const queueDiscovery = fs.readFileSync(
  'agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md',
  'utf8',
);
const directExecutionSkill = fs.readFileSync('agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md', 'utf8');
const deliveryProof = fs.readFileSync(
  'agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md',
  'utf8',
);
const conflictResolution = fs.readFileSync(
  'agents/skills/controleonline/shared-github-conflict-resolution/SKILL.md',
  'utf8',
);

test('manager is fail-closed before hygiene', () => {
  assert.match(managerAgent, /prioridade e fail-closed/i);
  assert.match(managerAgent, /P7 e fallback estrito/i);
  assert.match(managerAgent, /P6 \(Developer\) so pode iniciar/i);
  assert.match(managerAgent, /nunca use Higiene \(P7\) como fallback/i);
  assert.match(managerAgent, /Prioridade 4 - Developer: rejeicoes/i);
  assert.match(managerAgent, /Prioridade 5 - Security/i);
  assert.match(managerAgent, /Prioridade 6 - Developer: novos desenvolvimentos/i);
  assert.match(managerAgent, /Prioridade 7 - Higiene residual/i);
});

test('manager prioritizes rejected work before security and new development', () => {
  const order = managerAgent.match(
    /Prioridade 4 - Developer: rejeicoes[\s\S]*Prioridade 5 - Security[\s\S]*Prioridade 6 - Developer: novos desenvolvimentos[\s\S]*Prioridade 7 - Higiene residual/,
  );
  assert.ok(order, 'expected rejection -> security -> new development -> hygiene order');
  assert.doesNotMatch(managerAgent, /Corrija primeiro issues abertas com `agent:qa:rejected`/);
  assert.match(managerAgent, /agent:security:rejected/);
});

test('Deploy is explicit human publication authorization', () => {
  assert.match(managerAgent, /coluna \*\*`Deploy`\*\*[\s\S]*autorizacao humana explicita[\s\S]*deve executar/i);
  assert.doesNotMatch(managerAgent, /P1_SKIPPED_HUMAN_DEPLOY/);
  assert.match(queueDiscovery, /coluna \*\*`Deploy`\*\*[\s\S]*autorizacao humana explicita[\s\S]*publicar em `master`/i);
  assert.doesNotMatch(queueDiscovery, /unico bloqueio for gate humano de Deploy/i);
});

test('Deploy publication uses the frozen RC and active Security gate', () => {
  assert.match(managerAgent, /todas as tasks[\s\S]*`Deploy`[\s\S]*DevOps[\s\S]*master/i);
  assert.match(managerAgent, /Security aceito[\s\S]*`Done`/i);
  assert.match(managerAgent, /faltar Security[\s\S]*`Working`/i);
  assert.match(managerAgent, /agent:security:accepted/);
  assert.match(managerAgent, /QA`, `Design` e `UX` estao temporariamente suspensos/);
  const devopsAgent = fs.readFileSync('agents/roles/devops/agent.md', 'utf8');
  assert.match(devopsAgent, /mesma RC congelada/i);
  assert.match(devopsAgent, /agent:security:accepted/i);
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
  assert.match(managerAgent, /publicacao de governanca do proprio `agents-mcp`[\s\S]*nao aguarda Security/is);
  assert.match(managerSkill, /Governança publicada no próprio `agents-mcp`[\s\S]*sem aprovação ou[\s\S]*handoff para QA/is);
});

test('scheduled managers recover global backlog independently of push', () => {
  assert.match(managerAgent, /Agendamento do Manager.*estado global/is);
  assert.doesNotMatch(managerAgent, /\bCodex\b|\bGrok\b/i);
  assert.doesNotMatch(directExecutionSkill, /\bCodex\b|\bGrok\b/i);
  assert.match(managerAgent, /nao depende de novo push/i);
  assert.match(managerSkill, /consumidores globais.*recuperacao de backlog/is);
  assert.match(managerAgent, /Security[\s\S]*P6|Developer/is);
});

test('direct Paperclip execution is the active surface', () => {
  assert.match(directExecutionSkill, /Paperclip executa os agents diretamente/);
  assert.match(directExecutionSkill, /Nao existe delegacao para wrappers externos/);
  assert.equal(fs.existsSync('.github/workflows/manager-worker.yml'), false);
  assert.equal(fs.existsSync('.github/actions/workers'), false);
  assert.equal(fs.existsSync('.github/agents'), true);
});

test('active completion contract is Security plus Manager revalidation', () => {
  assert.match(managerAgent, /agent:security:accepted/);
  assert.match(managerAgent, /revalidacao do\s+Manager/i);
  assert.match(managerAgent, /QA, Design e UX estao\s+suspensos/i);
  assert.doesNotMatch(managerAgent, /gate de quatro aprovacoes/i);
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


test('manager repairs Working overflow before doing more work', () => {
  assert.match(managerAgent, /mais de 5.*Working/is);
  assert.match(managerAgent, /5 mais antigos.*Working/is);
  assert.match(managerAgent, /excedente.*Ready/is);
  assert.match(managerAgent, /createdAt.*crescente/is);
});
