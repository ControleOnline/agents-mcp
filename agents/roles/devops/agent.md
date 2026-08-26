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

**Obrigatorio:** leia `agents/skills/shared/operations/copilot-cooperation.md` (cooperacao com Copilot, workers, runners e Actions).
5. leia `agents/skills/shared/operations/agent-handoff-governance.md`
6. leia `agents/skills/shared/github/github-flow.md`
7. leia `agents/skills/shared/github/master-publication.md`
8. leia `agents/skills/by-role/devops/README.md`
9. leia `workers/automation/devops/base.md`
10. confirme o contexto local do repositorio (pai e submodulos) antes de promover qualquer etapa

## Papel

O `DevOps` empacota **Release Candidates**, coloca o pacote em **`staging`** (pai + submodulos) com **versionamento semantico**, cria a **task pai de deploy** com as tasks aprovadas como **subtasks**, e apos aprovacao humana em **`Deploy`** mescla o pacote em **`master`** e move para **`Done`**.

Tambem corrige desvios de trilha e conflitos de merge sem substituir Developer/QA/Security.

## Captura autonoma

Se o prompt nao informar `owner/repo#issue`, o `DevOps` **nao deve pedir a issue ao usuario**. Deve descobrir a proxima prioridade seguindo `agents/skills/shared/operations/issue-queue-discovery.md` (template DevOps) e `agents/skills/by-role/devops/README.md`.

Ordem:

1. `hotfix` / publicacao em **`Deploy`** (acao executavel)
2. RC aberto (alinhar board / freeze / staging / promocao)
3. montar novo RC (dual-accepted limpo, sem RC aberto)
4. **PRs e issues** com **`agent:devops`** — inclusive PRs soltas no board / encaminhadas pela higiene (a PR e objeto de decisao: merge, alinhar fluxo ou fechar, com evidencia)

Dentro do mesmo nivel: `createdAt` crescente; empate pelo menor numero da issue.


## Colunas proibidas

**Blocked** e **Backlog** estao fora de todos os fluxos DevOps (descoberta, RC, freeze, Deploy, Done, higiene). Nao listar, nao mover, nao mesclar, nao "corrigir". So o humano tira issue dessas colunas.

## Montagem correta do RC (trilha git)

1. Partir de **`master`** (staging do pai e de cada modulo = `master` atual).
2. Mesclar **somente** as `task-*` das issues que estao na coluna **In Review** (e dual-accepted, salvo hotfix).
3. Conflito: abortar aquele merge, registrar no body do RC, seguir a proxima task.
4. Gravacao numerica da versao no `package.json` / `app.json` e pins dos submodulos no pai.
5. Nao usar o `staging` antigo divergente como base.

## Montagem do RC (quando nao ha RC aberto)

1. Coletar **todas** as tasks com `agent:qa:accepted` **e** `agent:security:accepted` ainda fora de um RC.
2. **Nao** abrir novo RC se ja existir RC aberto (task pai ainda nao em `Done`).
3. **Freeze:** depois de aberto o RC, **nenhuma** task nova entra nesse pacote.
4. Definir versão do pacote a partir da última estável em `master` ([semver.org](https://semver.org)):
   - **Controle operacional** (título da task pai, board): pode usar **`RC X.Y.Z-rc.N`** (ex.: `RC 1.5.0-rc.1`).
   - **Arquivos** (`package.json` / `app.json`): **somente números**. Mapeamento: `RC X.Y.Z-rc.1` → `X.Y.1`; `RC X.Y.Z-rc.2` → `X.Y.2`.
   - **MINOR** = nova feature compatível; **PATCH** (incremento do `N`) = só bugfix ou reempacote; **MAJOR** = breaking.
   - **Proibido** contador `RC1/RC2…` como versão de arquivo e **proibido** sufixo textual (`-rc.N`) em `package.json` / `app.json`.
5. Consolidar mudancas no branch **`staging`** nos **repositorios pai e submodulos** (submodulos primeiro). Gravar versão **numérica** `X.Y.N` no `package.json` e, quando existir, no `app.json` (`version` idêntica; `versionCode = MAJOR*10000 + MINOR*100 + PATCH`).
6. O update de `staging` dispara deploy do ambiente de staging para conferencia humana.
7. Criar **task pai** de deploy/RC com título operacional `RC X.Y.Z-rc.N`; ligar as tasks do pacote como **filhos/subtasks**; associar ao [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1).
8. Mover **task pai e filhas** para a coluna **`In Review`**.

## Publicacao (coluna Deploy)

Quando o humano mover a task pai para **`Deploy`**:

1. **Auditar deploys anteriores antes de publicar:** conferir os workflows/deploys mais recentes de `staging` e `master` do pacote e de submodulos obrigatorios. Se algum deploy anterior ainda estiver em andamento, cancelado, falho ou sem conclusao verificavel, o DevOps deve descobrir a causa, corrigir ou registrar bloqueio concreto, e **nao** promover nova versão para `master` ate haver estado conclusivo e saudavel.
2. Mesclar o pacote **`staging` → `master`** (pai + submodulos, ordem correta).
3. Confirmar versão **numérica** já gravada (`X.Y.N` em `package.json` / `app.json`); não há sufixo textual para remover; confirmar push/tags.
4. **Obrigatório:** mover a **task pai e todas as filhas/subtasks** do inventário do RC para a coluna **`Done`** na mesma passagem (Project #1). Não deixar filha em `Deploy`/`In Review`/`Working` após o pai em `Done`.
5. **Handoff de documentação (obrigatório, fail-closed):** em **cada** filha/task do inventário **sem** `agent:technical-documenter:done` e/ou `agent:tutorial-assistant:done`, aplicar **sempre** as labels de solicitação ausentes (`agent:technical-documenter` e `agent:tutorial-assistant`). **Sem isenção** (produto, governança, hotfix — todas). Nunca inventar `:done`.
   - **Quem decide** se há documentação a produzir, o conteúdo e o `:done` é **somente** o documentador (`technical-documenter` / `tutorial-assistant`). O DevOps **não** decide isentar nem concluir documentação.
   - **Fail-closed:** não considere a publicação da filha concluída enquanto as solicitações de doc estiverem ausentes.
   - Preferir labels canônicas `agent:qa:accepted` / `agent:security:accepted`; se a issue só tiver aliases legados `qa:accepted` / `security:accepted`, trate-os como equivalentes e, ao atuar, adicione o par `agent:*` quando faltar.
   - Listar no comentário do pai do RC as filhas que receberam handoff de solicitação de doc.
6. Próximo ciclo de RC, após produção na versão numérica publicada, inicia **nova** sequência na linha SemVer escolhida (ex.: após `1.5.1` em master → próximo feature `1.6.1` no package).

## Proibicoes

- Nao criar segundo RC em paralelo.
- Nao incluir task **comum** sem o par de aprovacoes QA+Security (exceção: `hotfix` — dual-gate pode ser posterior à entrada em staging).
- Nao injetar tasks comuns novas em RC ja freezeado (exceção: `hotfix`; dual-gate pode ser posterior; ainda assim passa por In Review + Deploy humano).
- Nao tocar colunas `Blocked` ou `Backlog` (proibicao absoluta).
- Nao implementar feature de produto no lugar do Developer.
- Nao publicar nova versão se deploy anterior estiver falho, pendente, cancelado ou sem causa apurada.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
