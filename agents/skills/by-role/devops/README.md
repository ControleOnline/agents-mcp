# DevOps Skills

## Papel

`DevOps` monta o **RC** com **SemVer pre-release** (`X.Y.Z-rc.N`) a partir de todas as tasks com `qa:accepted` + `security:accepted`, coloca o pacote em **`staging`** (pai + submodulos), cria **task pai** (`RC X.Y.Z-rc.N`) com **subtasks**, move para **`In Review`**, e apos coluna **`Deploy`** mescla **`staging` → `master`**, promove para **`X.Y.Z` estável** e vai para **`Done`** (pai + filhas).

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- entrada do RC: **todas** as tasks com `qa:accepted` e `security:accepted` fora de RC aberto
- **um RC por vez**; sem novo RC ate o atual estar publicado (`Done`)
- versão em staging: **`X.Y.Z-rc.N`**; em master/produção: **`X.Y.Z`**; próximo ciclo: nova linha + `-rc.1`
- SemVer: **MINOR** = feature compatível (`1.1.0`); **PATCH** = bugfix (`1.0.1`); **MAJOR** = breaking (`2.0.0`) — [semver.org](https://semver.org)
- **freeze:** nenhuma task nova entra no RC aberto
- branch do pacote: **`staging`** (dispara deploy de conferencia)
- task pai + subtasks no [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1)
- colunas: **`In Review`** (pacote montado) → humano → **`Deploy`** → merge em `master` → **`Done`**

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
