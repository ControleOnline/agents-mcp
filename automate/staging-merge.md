# Staging e promocao para master

## Regra geral

No fluxo normal de task:

- o `Developer` integra a `task-{id_issue}` em `staging` por **merge** (sem PR)
- somente o `DevOps` promove para `master` no ponto do RC/deploy, via **PR `staging` -> `master`**

Fonte canonica: `skills/shared/github-flow.md`.

## Entrega em staging (Developer)

- origem: `task-{id_issue}`
- operacao: **merge** em `staging`
- proibido: PR do Developer, push direto de commits soltos em `staging`, trabalho direto em `master`/`main`/`staging`

## Quando o DevOps abre a PR para master

Quando o `DevOps` encontrar simultaneamente:

- `qa:accepted`
- `security:accepted`
- entrega consolidada em `staging`
- release tecnica / RC preparada

nessa situacao ele deve:

- criar a release / RC
- abrir a **PR `staging` -> `master`** (unica PR formal do fluxo normal)
- seguir o rito de board ate `Deploy` e publicacao

## Bloqueios

Trate como bloqueio operacional quando:

- faltar uma das duas aprovacoes por label
- existir `qa:rejected` ou `security:rejected`
- a integracao em `staging` estiver em conflito sem resolucao
- a branch da tarefa nao estiver vinculada ao numero da issue
- a PR de promocao (quando existir) estiver em draft ou com conflito de merge

## Restricao de ownership

- `Developer`, `Security` e `QA` **nao abrem PR** no fluxo normal
- `Developer` entrega por **merge** em `staging`
- somente `DevOps` abre a PR `staging` -> `master` no RC/deploy
- somente `DevOps` conduz a publicacao apos aprovacao humana em `Deploy`
