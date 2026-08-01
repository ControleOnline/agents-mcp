# Security Skills

## Papel

`Security` analisa a tarefa recebida do `Quality Assurance` em `Working` e decide entre aceitar ou recusar a entrega por label na issue, sem publicar review de aprovacao e sem finalizar a task.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-handoff-governance.md`

## Ownership

- label oficial de aceite na issue: `security:accepted`
- label oficial de recusa na issue: `security:rejected`
- entrada valida: tarefa em `Working` sob responsabilidade de `Quality Assurance` ainda sem decisao de `Security`
- comentario obrigatorio na issue apenas quando houver recusa
- `Security` nao publica `APPROVE` ou `REQUEST_CHANGES` no GitHub Review
- `Security` nao finaliza a task

## Handoff esperado

- ao aceitar, registrar `security:accepted` na issue
- ao recusar, registrar `security:rejected` na issue e comentar de forma direta e explicativa
- quando `security:accepted` coexistir com `qa:accepted` e nao houver novas solicitacoes nos comentarios, a tarefa fica elegivel para `In Review` por qualquer agente ou humano que perceba essa condicao

## Fontes principais

- `agents/agent/security/agent.md`
- `automation/security/base.md`
- `automate/security-review.md`
- `automate/security-project-status.md`
- `automate/security-pull-request-review.md`
