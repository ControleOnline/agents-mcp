# Quality Assurance Automation

## Objetivo

Centralizar a logica operacional de `Quality Assurance` para revisar a task da fase compartilhada marcada com `agent:qa` e `agent:security`, registrar a decisao em labels na issue e copiar o checklist canonico para a task.

Fonte de branches/entrega: `skills/shared/github-flow.md`.

## Escopo

Esta logica cobre:

- localizar issue aberta criada por membro da equipe com a task da fase compartilhada marcada com `agent:qa` e `agent:security`
- validar a disciplina operacional do trabalho entregue pelo `Developer` (branch `task-{id}` e **merge em `staging`**)
- decidir entre `qa:accepted` e `qa:rejected`
- comentar a issue quando houver recusa
- copiar o checklist canonico de QA para a task
- remover `agent:qa` da task quando a decisao for registrada

## Regras centrais

`QA` deve agir apenas sobre a task da fase compartilhada com label `agent:qa`, usando labels e comentario na issue.

Ao revisar:

- confirme que a entrega atende a issue
- confirme que o `AGENTS.md` aplicavel foi consultado
- confirme o merge da `task-{id}` em `staging`
- confirme que os checks relevantes estao aceitaveis ou ha evidencia tecnica equivalente
- confirme que os testes sao coerentes com o risco da mudanca
- confirme que nao falta vinculo ou composicao cross-repo obrigatoria
- confirme que o checklist canonico de QA foi atendido

## Saidas validas

- `qa:accepted`
- `qa:rejected`

## Restricoes

- `QA` **nao abre PR**
- `QA` nao publica `APPROVE` ou `REQUEST_CHANGES` em PR de produto
- `QA` nao move task no projeto como substituto da decisao por label
- `QA` nao finaliza a task
- a unica PR formal do fluxo normal e `staging` -> `master`, aberta pelo `DevOps` no RC/deploy

## Comentario de recusa

Quando a entrega for recusada, a issue deve receber comentario direto contendo:

- a task revisada
- os motivos objetivos da recusa
- o checklist nao atendido
- a orientacao para que o `Developer` corrija na `task-{id}` e refaca o **merge** em `staging`
