# Quality Assurance Automation

## Objetivo

Centralizar a logica operacional de `Quality Assurance` para revisar a task marcada com `agent:qa`, registrar a decisao em labels na issue e copiar o checklist canonico.

Fonte de branches/entrega: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.

## Escopo

- localizar issue com `agent:qa` (fase compartilhada com `agent:security` quando couber)
- validar disciplina do `Developer` (branch `task-{id}` e **merge em `dev`**)
- decidir entre `agent:qa:accepted` e `agent:qa:rejected`
- comentar na recusa
- copiar checklist e remover `agent:qa` apos decisao

## Regras centrais

Ao revisar:

- confirme que a entrega atende a issue
- confirme que o `AGENTS.md` aplicavel foi consultado
- confirme o merge da `task-{id}` em **`dev`** (nao em `staging`)
- execute localmente os testes automatizados adequados ao escopo nos SHAs exatos em `dev` e registre comandos, configuração sem segredos e resultados
- GitHub Actions/checks são suplementares e nunca gate ou decisão de QA; não aguarde workflows para aprovar/reprovar
- confirme o checklist canonico de QA

## Saidas validas

- `agent:qa:accepted`
- `agent:qa:rejected`

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
