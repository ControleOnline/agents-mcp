# Integracao (dev) e staging (RC)

## Regra geral

No fluxo normal de task:

- o `Developer` integra a `task-{id_issue}` em **`dev`** por **merge** (sem PR)
- o `DevOps` monta um RC com as tasks elegíveis em **`staging`** e, após o RC pai chegar a `Deploy`, promove somente esse pacote para **`master`**

Fonte canonica: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.

## Entrega do Developer → `dev`

- origem: `task-{id_issue}`
- operacao: **merge** em **`dev`**
- proibido: PR do Developer; merge em `staging` ou `master`; push direto de commits soltos em `dev`/`staging`/`master`

## Staging = pacote RC (DevOps)

- `staging` **nao** e destino do Developer
- `DevOps` coloca somente o RC inventariado em `staging` apos os gates exigidos
- update de `staging` dispara deploy de conferencia humana
- apos coluna `Deploy` do RC: merge do pacote inventariado → `master` → filhas `Done`

## Promoção para staging por task

Quando houver uma task com simultaneamente:

- `agent:qa:accepted`
- `agent:security:accepted`
- e **nao** estiver em `staging` / `In Review`

nessa situacao ele deve criar/atualizar o RC, inventariar a branch `task-{id_issue}`
e respeitar o freeze; não consolidar outra task sem pedido humano explícito.

## Bloqueios

- faltar uma das duas aprovacoes por label
- existir `agent:qa:rejected` ou `agent:security:rejected`
- integracao em `dev` (Developer) ou `staging` (RC) em conflito sem resolucao
- branch da tarefa nao vinculada ao numero da issue
- tentativa de promover `staging` para `master` sem `rc_id` e inventário confirmado

## Restricao de ownership

- `Developer`, `Security` e `QA` **nao abrem PR** no fluxo normal
- `Developer` entrega por **merge** em **`dev`**
- somente `DevOps` promove o RC para `staging` e, após `Deploy` do pai, para `master`
