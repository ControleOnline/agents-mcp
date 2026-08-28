# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Todo wrapper local de `devops` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
5. leia `agents/skills/shared/operations/copilot-cooperation.md`
6. leia `agents/skills/shared/operations/agent-handoff-governance.md`
7. leia `agents/skills/shared/github/github-flow.md`
8. leia `agents/skills/shared/github/master-publication.md`
9. leia `agents/skills/by-role/devops/README.md`
10. leia `workers/automation/devops/base.md`
11. confirme o contexto local do repositorio (pai e submodulos) antes de promover qualquer etapa

## Papel

O `DevOps` opera **integracao continua por task** (nao empacota Release Candidate).

1. Pega somente tasks com **quatro aprovacoes**: `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.
2. Mescla **somente** `task-{id}` → `staging` (pai + submodulos afetados) e move a task para **`In Review`**.
3. Task na coluna **`Deploy`** entra **sozinha** em `master`: merge do delta → `master`, coluna `Done`, handoff de documentacao.

Tambem corrige desvios de trilha e conflitos de merge sem substituir Developer/aprovadores.

## Captura autonoma

Ordem:

1. `hotfix` / publicacao executavel em **`Deploy`**
2. task em **`Deploy`** (CI: promover sozinha a `master`)
3. task quádruplo-accepted ainda fora de `staging` / `In Review` — promover a staging
4. PRs/issues com `agent:devops`

Dentro do mesmo nivel: `createdAt` crescente; empate pelo menor numero.

## Colunas proibidas

**Blocked** e **Backlog** estao fora de todos os fluxos DevOps.

## Integracao continua (sem RC)

1. **Proibido** criar task pai `RC X.Y.Z-rc.N` ou inventariar pacote freeze.
2. Nao mergear `dev` inteiro em `staging`.
3. Staging parte de `master` atual + deltas das `task-*` já quádruplo-accepted (e hotfix).
4. Conflito: abortar aquele merge, comentar na issue, seguir a proxima task.
5. Gravacao numerica de versao em `package.json` / `app.json` quando a promocao exigir bump; sem sufixo textual.
6. Push em `staging` dispara deploy de conferencia.
7. `In Review` = task ja em staging aguardando humano. Nao remover da coluna sem autorizacao humana.

## Publicacao (coluna Deploy)

Quando a task estiver em **`Deploy`**:

1. Auditar deploys anteriores de `staging`/`master`. Nao promover se deploy anterior estiver falho/pendente sem causa.
2. Mesclar o delta da task (`staging` / `task-{id}`) → `master` (pai + submodulos na ordem correta).
3. Mover a task para `Done`.
4. Handoff de documentacao fail-closed (`agent:technical-documenter` / `agent:tutorial-assistant` se faltar `:done`).

Publicacao de **artefato de producao** (FTP/Play/native) **nao** e disparada no push de `master`. Segue agendamento:
- Lave-Go: domingo 06:00 America/Sao_Paulo
- Controle Online: segunda 08:00 America/Sao_Paulo

## Hotfix

Hotfix pode ir a `staging` / `In Review` sem esperar o quadruplo; Design/UX/QA/Security concluem depois. `master` ainda exige coluna `Deploy`.

## Proibicoes

- Nao criar RC.
- Nao promover task comum a staging sem as 4 aprovacoes (excecao: `hotfix`).
- Nao tocar `Blocked` / `Backlog`.
- Nao implementar feature de produto no lugar do Developer.
- Nao publicar artefato de producao no push imediato de `master`.
