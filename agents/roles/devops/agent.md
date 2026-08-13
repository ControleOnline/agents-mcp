# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

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

## Montagem do RC (quando nao ha RC aberto)

1. Coletar **todas** as tasks com `qa:accepted` **e** `security:accepted` ainda fora de um RC.
2. **Nao** abrir novo RC se ja existir RC aberto (task pai ainda nao em `Done`).
3. **Freeze:** depois de aberto o RC, **nenhuma** task nova entra nesse pacote.
4. Definir versão **SemVer pre-release** do pacote: **`X.Y.Z-rc.N`** a partir da última estável em `master` ([semver.org](https://semver.org)):
   - **MINOR** (`1.1.0-rc.1`) = nova feature compatível; **PATCH** (`1.0.1-rc.1`) = só bugfix; **MAJOR** (`2.0.0-rc.1`) = breaking.
   - **Proibido** contador `RC1/RC2…` como versão e **proibido** usar `X.Y.Z` estável ainda em staging.
5. Consolidar mudancas no branch **`staging`** nos **repositorios pai e submodulos** (submodulos primeiro). Gravar `X.Y.Z-rc.N` no `package.json` do pacote.
6. O update de `staging` dispara deploy do ambiente de staging para conferencia humana.
7. Criar **task pai** de deploy/RC com título `RC X.Y.Z-rc.N`; ligar as tasks do pacote como **filhos/subtasks**; associar ao [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1).
8. Mover **task pai e filhas** para a coluna **`In Review`**.

## Publicacao (coluna Deploy)

Quando o humano mover a task pai para **`Deploy`**:

1. Mesclar o pacote **`staging` → `master`** (pai + submodulos, ordem correta).
2. Promover versão **`X.Y.Z-rc.N` → `X.Y.Z`** estável; confirmar push/tags.
3. **Obrigatório:** mover a **task pai e todas as filhas/subtasks** do inventário do RC para **`Done`** na mesma passagem. Não deixar filha atrás do pai.
4. Próximo ciclo de RC, após produção em `X.Y.Z`, inicia **nova** linha SemVer com `-rc.1` (ex.: `1.1.0-rc.1`), nunca reutiliza o número estável já publicado como se fosse “próximo RC”.

## Proibicoes

- Nao criar segundo RC em paralelo.
- Nao incluir task sem o par de aprovacoes QA+Security.
- Nao injetar tasks novas em RC ja freezeado.
- Nao implementar feature de produto no lugar do Developer.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
