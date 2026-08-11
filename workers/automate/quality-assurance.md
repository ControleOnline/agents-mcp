# Quality Assurance Automation

## Objetivo

Centralizar a logica operacional de `Quality Assurance` para revisar a task marcada com `agent:qa`, registrar a decisao em labels na issue e copiar o checklist canonico.

Fonte de branches/entrega: `agents/skills/shared/github/github-flow.md`.

## Escopo

- localizar issue com `agent:qa` (fase compartilhada com `agent:security` quando couber)
- validar disciplina do `Developer` (branch `task-{id}` e **merge em `dev`**)
- decidir entre `qa:accepted` e `qa:rejected`
- comentar na recusa
- copiar checklist e remover `agent:qa` apos decisao

## Regras centrais

Ao revisar:

- confirme que a entrega atende a issue
- confirme que o `AGENTS.md` aplicavel foi consultado
- confirme o merge da `task-{id}` em **`dev`** (nao em `staging`)
- confirme checks ou evidencia equivalente
- confirme testes e composicao cross-repo quando obrigatoria
- confirme o checklist canonico de QA

## Saidas validas

- `qa:accepted`
- `qa:rejected`

## Restricoes

- `QA` **nao abre PR**
- `QA` nao publica review de PR de produto
- `QA` nao finaliza a task
- `staging` e exclusivo do RC do `DevOps`

## Comentario de recusa

Quando recusar, comente:

- task revisada
- motivos objetivos
- checklist nao atendido
- orientacao: `Developer` corrige na `task-{id}` e refaz o **merge em `dev`** (nao em `staging`)
