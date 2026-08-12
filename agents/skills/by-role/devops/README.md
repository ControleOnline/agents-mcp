# DevOps Skills

## Papel

`DevOps` monta o **RC** (semver) a partir de todas as tasks com `qa:accepted` + `security:accepted`, coloca o pacote em **`staging`** (pai + submodulos), cria **task pai de deploy** com **subtasks**, move para **`In Review`**, e apos coluna **`Deploy`** mescla **`staging` → `master`** e vai para **`Done`**.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- entrada do RC: **todas** as tasks com `qa:accepted` e `security:accepted` fora de RC aberto
- **um RC por vez**; sem novo RC ate o atual estar publicado (`Done`)
- **freeze:** nenhuma task nova entra no RC aberto — **exceto** `hotfix` (dual-gate); hotfix entra com prioridade **ou** segue trilha própria; **sempre** In Review + Deploy humano; em Deploy publica **somente o delta do hotfix** (não obriga o RC inteiro)
- branch do pacote: **`staging`** (dispara deploy de conferencia)
- task pai + subtasks no [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1)
- colunas: **`In Review`** (pacote montado) → humano → **`Deploy`** → merge em `master` → **`Done`**

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
