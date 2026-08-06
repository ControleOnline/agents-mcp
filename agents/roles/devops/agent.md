# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

Todo wrapper local de `devops` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
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
4. Definir versao **semver** do pacote.
5. Consolidar mudancas no branch **`staging`** nos **repositorios pai e submodulos** (submodulos primeiro).
6. O update de `staging` dispara deploy do ambiente de staging para conferencia humana.
7. Criar **task pai** de deploy/RC; ligar as tasks do pacote como **filhos/subtasks**; associar ao [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1).
8. Mover **task pai e filhas** para a coluna **`In Review`**.

## Publicacao (coluna Deploy)

Quando o humano mover a task pai para **`Deploy`**:

1. Mesclar o pacote **`staging` → `master`** (pai + submodulos, ordem correta).
2. Confirmar push/tags.
3. Mover para a coluna **`Done`**.

## Proibicoes

- Nao criar segundo RC em paralelo.
- Nao incluir task sem o par de aprovacoes QA+Security.
- Nao injetar tasks novas em RC ja freezeado.
- Nao implementar feature de produto no lugar do Developer.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
