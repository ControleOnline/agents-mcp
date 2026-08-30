# Integracao (dev) e staging (por task)

## Regra geral

No fluxo normal de task:

- o `Developer` integra a `task-{id_issue}` em **`dev`** por **merge** (sem PR)
- o `DevOps` promove **somente** `task-{id}` → **`staging`** quando houver as quatro `:accepted`, move a task para **`In Review`**
- humano confere staging e move a task para **`Deploy`**
- o `DevOps` mescla o delta (`staging` / `task-{id}`) → **`master`** e move a task para **`Done`**

Fonte canônica: `agents/skills/shared/github/github-flow.md` e `agents/roles/devops/agent.md`.

**Proibido** montar RC, task pai de RC, freeze de pacote ou inventário de filhas.

## Entrega do Developer → `dev`

- origem: `task-{id_issue}`
- operacao: **merge** em **`dev`**
- proibido: PR do Developer; merge em `staging` ou `master`; push direto de commits soltos em `dev`/`staging`/`master`

## Staging = delta por task (DevOps)

- `staging` **nao** e destino do Developer
- `DevOps` faz merge **somente** de `task-{id}` → `staging` apos as quatro aprovacoes:
  - `agent:qa:accepted`
  - `agent:security:accepted`
  - `agent:design:accepted`
  - `agent:ux:accepted`
- move a task para a coluna **`In Review`**
- update de `staging` dispara deploy de conferencia
- apos coluna **`Deploy`** (acao humana): merge do delta → `master` → coluna `Done`

## Quando o DevOps promove para staging

Quando houver task com as quatro `:accepted` e ainda fora de `staging` / `In Review`:

- promover **uma a uma** (ordem `createdAt` crescente; empate = menor numero)
- merge **somente** `task-{id}` → `staging` (pai + submodulos na ordem correta)
- mover a task para **`In Review`**
- conflito: abortar aquele merge, comentar na issue, seguir a proxima task

Hotfix → staging fica na **P2** do Manager (sem esperar o quadruplo); `master` ainda exige coluna `Deploy`.

## Bloqueios

- faltar qualquer uma das quatro aprovacoes (exceto hotfix na P2)
- existir `agent:qa:rejected` / `agent:security:rejected` / `agent:design:rejected` / `agent:ux:rejected`
- integracao em `dev` (Developer) ou `staging` (DevOps) em conflito sem resolucao
- branch da tarefa nao vinculada ao numero da issue

## Restricao de ownership

- `Developer`, validadores **nao abrem PR** no fluxo normal
- `Developer` entrega por **merge** em **`dev`**
- somente `DevOps` usa `staging` e promove para `master` apos coluna `Deploy`
