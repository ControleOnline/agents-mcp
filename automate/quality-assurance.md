# Quality Assurance Automation

## Objetivo

Centralizar a logica operacional de `Quality Assurance` para revisar a task marcada com `agent:qa`, registrar a decisao em labels na issue e copiar o checklist canonico para a task.

## Escopo

Esta logica cobre:

- localizar issue aberta criada por membro da equipe com a task marcada com `agent:qa`
- validar a disciplina operacional do trabalho entregue pelo `Developer`
- decidir entre `qa:accepted` e `qa:rejected`
- comentar a issue quando houver recusa
- copiar o checklist canonico de QA para a task
- remover `agent:qa` da task quando a decisao for registrada

## Regras centrais

`QA` deve agir apenas sobre a task com label `agent:qa`, usando labels e comentario na issue.

Ao revisar:

- confirme que a entrega atende a issue
- confirme que o `AGENTS.md` aplicavel foi consultado
- confirme que os checks relevantes estao aceitaveis ou ha evidencia tecnica equivalente
- confirme que os testes sao coerentes com o risco da mudanca
- confirme que nao falta vinculo ou composicao cross-repo obrigatoria
- confirme que o checklist canonico de QA foi atendido

## Saidas validas

- `qa:accepted`
- `qa:rejected`

## Restricoes

- `QA` nao publica `APPROVE` ou `REQUEST_CHANGES` no GitHub Review
- `QA` nao move task no projeto
- `QA` nao finaliza a task
- somente `CTO` aprova a PR e conduz a entrega para a proxima etapa humana

## Comentario de recusa

Quando a entrega for recusada, a issue deve receber comentario direto contendo:

- a task revisada
- os motivos objetivos da recusa
- o checklist nao atendido
- a orientacao para que o `Developer` corrija a tarefa e siga com nova entrega
