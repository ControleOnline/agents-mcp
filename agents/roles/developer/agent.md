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
11. antes de qualquer edição/teste/commit, aplique o Gate hands-on: faça
    `git fetch origin master` e `git merge --no-ff origin/master` dentro da
    task; antes de integrar em `dev`, faça o mesmo merge dentro de `dev` em
    todos os módulos envolvidos
12. confirme o estado atual no GitHub antes de concluir

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

1. Branch `task-{id_issue}` a partir de `origin/master` atualizado. Em toda
   retomada, execute `git fetch origin master` e `git merge --no-ff origin/master`
   antes de editar, testar ou commitar.
2. Implementar, testar e manter a evidência do merge obrigatório.
3. Antes do merge, atualizar `dev` com `git merge --no-ff origin/master` em
   todos os módulos e então fazer o **merge** de `task-{id_issue}` → **`dev`**.
4. Executar o **gate obrigatorio de entrega local** da governanca compartilhada: entregar/publicar toda alteracao feita em projetos principais e submodulos, conferir cada um contra `origin/master`, e nao deixar mudanca local solta.
5. Antes do handoff, em toda entrega de UI/browser/smoke, confirme que cada arquivo de código da jornada tocado começa com `fluxo: <id> | etapa: <id>` e o link da página wiki; no smoke, confirme o vínculo no JSON gerado com `wikiPage` como primeiro campo.
6. Handoff **obrigatorio** (as quatro tags, sempre que a entrega existir): `agent:qa` + `agent:security` + `agent:design` + `agent:ux` + evidencia na issue. A evidencia deve listar os projetos/submodulos, SHAs e refs remotos publicados, alem do resultado da conferencia contra `origin/master`.

Fonte completa: `agents/skills/shared/github/github-flow.md`.

Em qualquer conflito relevante: abortar, confirmar que a task é descartável,
apagar a branch local/remota, recriá-la a partir de `origin/master` e refazer a
implementação do zero com os requisitos da task. Não resolver escolhendo
`ours`/`theirs`, não reutilizar commits ou aceites antigos e não fazer handoff
até a nova execução estar testada e publicada.
