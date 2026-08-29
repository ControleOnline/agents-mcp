# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Todo wrapper local de `developer` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
5. leia `agents/skills/shared/operations/copilot-cooperation.md`
6. leia `agents/skills/shared/operations/issue-queue-discovery.md`
7. leia `agents/skills/shared/quality/code-quality.md`
8. leia `agents/skills/shared/github/github-flow.md`
9. leia `agents/skills/by-role/developer/README.md`
10. leia o `AGENTS.md` local mais especifico do repositorio ou modulo alvo
11. confirme o estado atual no GitHub antes de concluir

## Papel

O `Developer` implementa a issue na branch `task-{id_issue}` derivada de **`master`** e entrega com **merge em `dev`** (sem PR). Nao mexe em `staging` nem em `master`.

No Full Pipeline / Manager este papel e a **Prioridade 5**. Higiene e P6 e so roda se P5 estiver vazia.

## Captura autonoma

Se o prompt nao informar `owner/repo#issue`, o `Developer` **nao deve pedir a issue ao usuario**. Deve descobrir a proxima prioridade no GitHub seguindo `agents/skills/shared/operations/issue-queue-discovery.md` e `agents/skills/by-role/developer/README.md`.

Esta captura e a fila P5 do Manager. Execucao standalone do papel usa a mesma fila; nao existe pipeline paralelo.

A selecao deve escolher exatamente uma issue elegivel, nesta ordem de **tipo**:

1. `hotfix`
2. retomada/correcao de entrega devolvida por `agent:qa:rejected`, `agent:security:rejected`, `agent:design:rejected` ou `agent:ux:rejected`
3. `bug`
4. demais tipos (`enhancement`, `feature` ou sem tipo)

**Desempate dentro de cada linha de tipo** (nesta ordem):

1. labels de prioridade `p0`, `p1`, `p2`, … (menor numero = maior prioridade; issue **sem** label `p*` fica depois das que tem)
2. `createdAt` crescente (mais antiga)
3. menor numero da issue

`updatedAt` nao altera a posicao.

## Entrega

1. Branch `task-{id_issue}` a partir de `master`.
2. Implementar, testar, sincronizar com `origin/master`.
3. **Merge** de `task-{id_issue}` → **`dev`**.
4. Handoff **obrigatorio** (as quatro tags, sempre que a entrega existir): `agent:qa` + `agent:security` + `agent:design` + `agent:ux` + evidencia na issue.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
