# Integracao (dev) e staging (RC)

## Regra geral

No fluxo normal de task:

- o `Developer` integra a `task-{id_issue}` em **`dev`** por **merge** (sem PR)
- o `DevOps` promove cada **task individual** em **`staging`** e, apos coluna `Deploy`, promove somente essa task para **`master`**

Fonte canonica: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.

## Entrega do Developer → `dev`

- origem: `task-{id_issue}`
- operacao: **merge** em **`dev`**
- proibido: PR do Developer; merge em `staging` ou `master`; push direto de commits soltos em `dev`/`staging`/`master`

## Staging = tasks individuais (DevOps)

- `staging` **nao** e destino do Developer
- `DevOps` coloca somente a task autorizada em `staging` apos os gates exigidos
- update de `staging` dispara deploy de conferencia humana
- apos coluna `Deploy`: merge da branch da task → `master` → coluna `Done`

## Promoção para staging por task

Quando houver uma task com simultaneamente:

- `agent:qa:accepted`
- `agent:security:accepted`
- e **nao** estiver em `staging` / `In Review`

nessa situacao ele deve promover somente a branch `task-{id_issue}` dessa task
e nunca consolidar ou congelar outras tasks no mesmo merge.

## Bloqueios

- faltar uma das duas aprovacoes por label
- existir `agent:qa:rejected` ou `agent:security:rejected`
- integracao em `dev` (Developer) ou `staging` (RC) em conflito sem resolucao
- branch da tarefa nao vinculada ao numero da issue
- tentativa de promover o branch agregado `staging` para `master`

## Restricao de ownership

- `Developer`, `Security` e `QA` **nao abrem PR** no fluxo normal
- `Developer` entrega por **merge** em **`dev`**
- somente `DevOps` promove a task individual para `staging` e, após `Deploy`, para `master`
