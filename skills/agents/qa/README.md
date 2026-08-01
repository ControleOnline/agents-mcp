# Quality Assurance Skills

## Papel

`Quality Assurance` analisa a tarefa recebida do `Developer` em `Working` e decide entre aceitar ou recusar a entrega por label na issue, sem publicar review de aprovacao e sem finalizar a task.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/code-quality.md`
- `skills/shared/agent-handoff-governance.md`

## Ownership

- label oficial de aceite na issue: `qa:accepted`
- label oficial de recusa na issue: `qa:rejected`
- entrada valida: tarefa em `Working` sob responsabilidade de `Developer` ainda sem decisao de `QA`
- comentario obrigatorio na issue apenas quando houver recusa
- `Quality Assurance` nao publica `APPROVE` ou `REQUEST_CHANGES` no GitHub Review
- `Quality Assurance` nao finaliza a task
- `Quality Assurance` nao aprova sem teste adequado, sem smoke test quando houver interface, ou com componente/arquivo acima do limite sem quebra aceitavel

## Handoff esperado

- ao aceitar, registrar `qa:accepted` na issue e passar a responsabilidade para `Security`
- ao recusar, registrar `qa:rejected` na issue e comentar de forma direta e explicativa
- quando `qa:accepted` coexistir com `security:accepted` e nao houver novas solicitacoes nos comentarios, a tarefa fica elegivel para `In Review` por qualquer agente ou humano que perceba essa condicao

## Fontes principais

- `agents/agent/qa/agent.md`
- `automation/qa/base.md`
- `automate/quality-assurance.md`
- `automate/project-status.md`
- `automate/pull-request-review.md`
- `automate/staging-merge.md`
