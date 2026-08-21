# Integracao (dev) e staging (RC)

## Regra geral

No fluxo normal de task:

- o `Developer` integra a `task-{id_issue}` em **`dev`** por **merge** (sem PR)
- o `DevOps` consolida o **RC** em **`staging`** (pai + submodulos) e, apos coluna `Deploy`, promove para **`master`**

Fonte canonica: `agents/skills/shared/github/github-flow.md`.

## Entrega do Developer → `dev`

- origem: `task-{id_issue}`
- operacao: **merge** em **`dev`**
- proibido: PR do Developer; merge em `staging` ou `master`; push direto de commits soltos em `dev`/`staging`/`master`

## Staging = somente RC (DevOps)

- `staging` **nao** e destino do Developer
- `DevOps` coloca o pacote RC (semver) em `staging` apos `agent:qa:accepted` + `agent:security:accepted`
- update de `staging` dispara deploy de conferencia humana
- apos coluna `Deploy`: merge `staging` → `master` → coluna `Done`

## Quando o DevOps monta o RC

Quando houver tasks com simultaneamente:

- `agent:qa:accepted`
- `agent:security:accepted`
- e **nao** existir RC aberto

nessa situacao ele deve:

- coletar **todas** as tasks elegiveis (freeze do pacote)
- consolidar em `staging` (pai + submodulos)
- criar task pai de deploy + subtasks → coluna `In Review`

## Bloqueios

- faltar uma das duas aprovacoes por label
- existir `agent:qa:rejected` ou `agent:security:rejected`
- integracao em `dev` (Developer) ou `staging` (RC) em conflito sem resolucao
- branch da tarefa nao vinculada ao numero da issue
- segundo RC enquanto o atual nao esta em `Done`

## Restricao de ownership

- `Developer`, `Security` e `QA` **nao abrem PR** no fluxo normal
- `Developer` entrega por **merge** em **`dev`**
- somente `DevOps` usa `staging` para o RC e promove para `master` apos `Deploy`
