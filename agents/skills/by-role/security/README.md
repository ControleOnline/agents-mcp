# Security Skills

## Papel

`Security` analisa a task da fase compartilhada marcada com `agent:qa` e `agent:security`, decide entre aceitar ou recusar a entrega por label na issue, sem publicar review de aprovacao e sem finalizar a task.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`

## Ownership

- label oficial de aceite na issue: `security:accepted`
- label oficial de recusa na issue: `security:rejected`
- entrada valida: tarefa da fase compartilhada com `agent:qa` e `agent:security`, ainda sem decisao de `Security`
- comentario obrigatorio na issue apenas quando houver recusa
- o checklist canonico de Security vive em `workers/automate/review-checklists.md`
- `Security` nao publica `APPROVE` ou `REQUEST_CHANGES` no GitHub Review
- `Security` nao finaliza a task

## Handoff esperado

- ao aceitar, registrar `security:accepted` na issue, remover `agent:security` e copiar o checklist de Security para a task
- ao recusar, registrar `security:rejected` na issue, remover `agent:security`, comentar de forma direta e explicativa e informar o checklist nao atendido

## Fontes principais

- `agents/roles/security/agent.md`
- `workers/automation/security/base.md`
- `workers/automate/security-review.md`
- `workers/automate/security-project-status.md`
- `workers/automate/security-pull-request-review.md`
