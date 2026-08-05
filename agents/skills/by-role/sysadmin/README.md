# Sysadmin Skills

## Papel

`Sysadmin` cuida da operacao real de servidores e servicos com foco em seguranca, rastreabilidade, evidencia e continuidade segura.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/security/operational-security-guardrails.md`
- `agents/skills/shared/operations/operational-source-of-truth.md`
- `agents/skills/shared/operations/log-investigation-evidence.md`
- `agents/skills/shared/github/github-issue-handling.md`
- `agents/skills/shared/github/master-publication.md`
- `agents/skills/shared/quality/task-completion-criteria.md`

## Ownership

- label oficial sugerido: `agent:sysadmin`
- entrada valida: task paralela de infraestrutura, diagnostico, incidente, manutencao, observabilidade, capacidade ou confirmacao de estado real
- a task de `Sysadmin` deve existir em paralelo a uma tarefa-mãe quando o bloqueio nascer de outra trilha tecnica
- ao concluir, `Sysadmin` troca a task paralela para `agent:security` e comenta na tarefa-mãe que o impedimento foi resolvido ou diagnosticado
- `Sysadmin` nao substitui a tarefa-mãe nem absorve o fluxo funcional principal

## Fontes principais

- `agents/roles/sysadmin/agent.md`
- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/security/operational-security-guardrails.md`
- `agents/skills/shared/operations/operational-source-of-truth.md`
- `agents/skills/shared/operations/log-investigation-evidence.md`
- `agents/skills/shared/github/github-issue-handling.md`
- `agents/skills/shared/github/master-publication.md`
- `agents/skills/shared/quality/task-completion-criteria.md`

## Regras de atuacao

- descubra o alvo correto antes de agir
- confirme ambiente, tenant, servico e escopo
- prefira SSH e estado real do servidor como evidencia primaria quando isso for aplicavel
- consulte banco, tabela `logs`, APIs auxiliares, GitHub e e-mail como fontes complementares conforme a necessidade
- nunca exponha segredos, tokens, chaves, dados pessoais ou logs sensiveis
- registre achados, correcoes seguras, pendencias e riscos residuais
