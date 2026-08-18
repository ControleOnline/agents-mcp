# DevOps Skills

## Papel

`DevOps` monta o **RC** a partir de todas as tasks com `agent:qa:accepted` + `agent:security:accepted`, coloca o pacote em **`staging`** (pai + submodulos) com versão **numérica** nos arquivos (`package.json` / `app.json`), cria **task pai** (título operacional `RC X.Y.Z-rc.N`) com **subtasks**, move para **`In Review`**, e apos coluna **`Deploy`** mescla **`staging` → `master`**, confirma a versão numérica e vai para **`Done`** (pai + filhas).

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- se o prompt nao informar issue, descubra a proxima prioridade no GitHub (template DevOps em `issue-queue-discovery.md`); **nao peca ao usuario**
- prioridade: publicacao/`Deploy` e hotfix → RC aberto → montar RC → **PRs/issues** `agent:devops` (PRs soltas no board e handoffs)
- **PRs** com `agent:devops` (ou item de PR no Project #1): decidir merge/alinhar/fechar na mesma passagem; a PR e objeto de trabalho; comentar evidencia; atualizar board
- desempate: `createdAt` crescente; empate pelo menor numero da issue; `updatedAt` nao altera posicao
- entrada do RC: **todas** as tasks com `agent:qa:accepted` e `agent:security:accepted` fora de RC aberto
- **um RC por vez**; sem novo RC ate o atual estar publicado (`Done`)
- **freeze:** nenhuma task nova entra no RC aberto — **exceto** `hotfix`; hotfix entra com prioridade **ou** trilha própria **sem** exigir dual-gate prévio (QA/Security depois); **sempre** In Review + Deploy humano; em Deploy publica **somente o delta do hotfix** (não obriga o RC inteiro)
- versão em arquivos (`package.json` / `app.json`): **somente números** — `RC X.Y.Z-rc.1` → `X.Y.1`, `RC X.Y.Z-rc.2` → `X.Y.2`; controle operacional pode usar `RC X.Y.Z-rc.N`
- `app.json`: `version` = `package.json`; `versionCode` = MAJOR*10000 + MINOR*100 + PATCH (ex.: `1.5.1` → `15001`)
- SemVer: **MINOR** = feature compatível; **PATCH** = bugfix ou reempacote do RC; **MAJOR** = breaking — [semver.org](https://semver.org)
- **freeze:** nenhuma task nova entra no RC aberto
- branch do pacote: **`staging`** (dispara deploy de conferencia)
- task pai + subtasks no [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1)
- colunas: **`In Review`** (pacote montado) → humano → **`Deploy`** → merge em `master` → **`Done`**

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
