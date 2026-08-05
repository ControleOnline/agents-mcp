# Project Status (QA)

## Escopo

A leitura operacional de `QA` acontece pela **task/issue** e pela evidencia da entrega (commits na `task-{id}` e merge em `staging`), nao por coluna do projeto e nao por PR do Developer.

PR do Developer **nao existe** no fluxo normal. Ver `agents/skills/shared/github/github-flow.md`.

## Captura

A automacao de `QA` so pode capturar uma task quando:

- a issue esta aberta
- existe label `agent:qa` (ou a fase compartilhada de revisao equivalente)
- ha evidencia de entrega na task branch e/ou merge em `staging`

## Desvios

Use quando houver qualquer desvio operacional objetivo, incluindo:

- entrega sem merge em `staging`
- branch da tarefa sem o numero da issue
- uso direto de branch proibida (`master`, `main`, `staging`)
- tentativa de PR do Developer no fluxo normal

## Decisao

- registre apenas `qa:accepted` ou `qa:rejected` na task
- comente na issue com motivo objetivo
- nao abra PR, nao aprove PR de produto e nao finalize task
