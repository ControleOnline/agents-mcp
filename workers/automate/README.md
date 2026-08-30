# Automate

Esta pasta concentra a politica e a base executavel dos runners operacionais do ecossistema `ControleOnline`.

## Agentes cobertos

- `Developer`: seleciona issue elegivel, implementa em `task-{id}` a partir de `master`, merge em `dev`, handoff com as quatro labels de validador, task em `Working`
- `Quality Assurance` / `Security` / `Design` / `UX`: validam a entrega, registram `:accepted` ou `:rejected` e removem a label de solicitacao
- `DevOps`: (1) publica tasks em coluna **`Deploy`** → `master` → `Done`; (2) promove tasks com quatro `:accepted` → `staging` + coluna **`In Review`**
- `GitHub Operations Runner`: executa mutacoes de GitHub a partir do proprio GitHub Actions quando o runtime local dos agents nao consegue concluir a operacao

## Arquivos principais

- `workers/scripts/developer-pr-dispatch.mjs`: selecao do backlog do `Developer`
- `workers/scripts/pr-label-review-runner.mjs`: review runner compartilhado entre validadores para fluxo por labels e issue
- `workers/scripts/github-operations.mjs`: executor generico de mutacoes REST, GraphQL e atualizacoes de projeto no GitHub
- `review-checklists.md`: checklists canonicos que devem ser copiados para a task durante a revisao
- `staging-merge.md`: regra de promocao `task-{id}` → `staging` / `In Review` (sem RC)
- politica de master: `agents/skills/shared/github/master-publication.md`

## Objetivo

Fluxo padronizado (integracao continua **por task**, **sem RC**):

1. `Developer` captura issue elegivel em `Ready` / fila P5
2. `Developer` trabalha somente na `task-{id}` derivada de `master`
3. `Developer` faz **merge** de `task-{id}` → `dev` (sem PR)
4. Handoff obrigatorio: `agent:qa` + `agent:security` + `agent:design` + `agent:ux`
5. Validadores registram `:accepted` / `:rejected` e removem a label de solicitacao
6. Com as **quatro** `:accepted`, `DevOps` faz merge **somente** `task-{id}` → `staging` e move a task para **`In Review`**
7. **Humano** confere staging e move a task para **`Deploy`**
8. Em **`Deploy`**, `DevOps` mescla o delta → `master` e move a task para **`Done`**
9. No publish, handoff documental fail-closed (`agent:technical-documenter` / `agent:tutorial-assistant` se faltar `:done`)

## Observacoes

- Validadores operam por labels e comentario na issue (nao APPROVE/REQUEST_CHANGES de PR de produto).
- A fila oficial de entrada e `Ready`; `Working` e ownership ativo ate o handoff dos validadores.
- Tasks recusadas voltam ao `Developer` antes de capturas novas.
- **Nao** montar RC, task pai de RC, freeze de pacote ou inventario de filhas.
- Quando houver conflito entre script e politica, siga os arquivos `.md` canonicos em `agents/roles/` e `agents/skills/shared/github/`.
