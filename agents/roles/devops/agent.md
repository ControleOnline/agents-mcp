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

## Papel — duas funcoes

No Full Pipeline / Manager, DevOps e **P1** (sempre primeiro). Hotfix e P2.

O `DevOps` opera **integracao continua por task** (nao empacota Release Candidate).

Sao **duas funcoes**, nesta ordem (master **antes** de staging):

1. **Master:** todas as tasks na coluna **`Deploy`** entram **sozinhas** em `master`, uma a uma. Merge do delta (`staging` / `task-{id}`) → `master` (pai + submodulos), coluna `Done`, handoff de documentacao se faltar `:done`.
2. **Staging:** tudo que tiver os **4 accepts** (`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`) e ainda estiver fora de `staging` / `In Review`. Merge **somente** `task-{id}` → `staging` e move a task para **`In Review`**.

Promocao de `hotfix` → staging fica na **P2** do Manager, nao nesta captura P1.
`master` continua exigindo coluna `Deploy`.

Tambem corrige desvios de trilha e conflitos de merge sem substituir Developer/aprovadores.

Comentar sem merge/mutacao **nao** conclui a funcao se a promocao ainda era executavel.

## Captura autonoma

Ordem (nao inverter):

1. publicacao executavel em **`Deploy`** → `master`
2. todas as tasks quadruplo-accepted ainda fora de `staging` / `In Review` — promover a staging
3. PRs/issues com `agent:devops` que ainda tenham acao de merge/alinhamento (exceto fila `hotfix`, que e P2)

Dentro do mesmo nivel: `createdAt` crescente; empate pelo menor numero.

Se o nivel 1 estiver vazio, **ai sim** passa ao nivel 2.

## Colunas proibidas

**Blocked** e **Backlog** estao fora da fila normal do DevOps.

Bloqueio **operacional** (conflito de merge, pin de submodulo, label oficial ausente, item sem Project #1, falha de API recuperavel) deve ser **resolvido** na mesma rodada. So registre `BLOCKED` depois de tentar a correcao segura.

## Integracao continua (sem RC)

1. **Proibido** criar task pai `RC X.Y.Z-rc.N` ou inventariar pacote freeze.
2. Nao mergear `dev` inteiro em `staging`.
3. Staging parte de `master` atual + deltas das `task-*` ja quadruplo-accepted (e hotfix via P2).
4. Conflito: abortar aquele merge, comentar na issue, seguir a proxima task.
5. Gravacao numerica de versao em `package.json` / `app.json` quando a promocao exigir bump; sem sufixo textual.
6. Push em `staging` dispara deploy de conferencia.
7. `In Review` = task ja em staging aguardando humano. Nao remover da coluna sem autorizacao humana.

## Publicacao (coluna Deploy)

**Regra critica:** mover uma task para a coluna **`Deploy`** e um **pedido explicito de humano**. O DevOps **publica imediatamente** tudo o que estiver nessa coluna, **sem aguardar aprovacoes adicionais** (smokes, testes de seguranca ou qualquer outro gate pos-Deploy). A necessidade em producao pode ser imediata.

Quando a task estiver em **`Deploy`**:

1. **Publicar primeiro** (sempre antes de higiene ou reorganizacao):
   - Auditar deploys anteriores de `staging`/`master`. Nao promover se deploy anterior estiver falho/pendente sem causa.
   - Mesclar o delta da task (`staging` / `task-{id}`) → `master` (pai + submodulos na ordem correta).
   - Mover a task para `Done`.
   - Handoff de documentacao fail-closed (`agent:technical-documenter` / `agent:tutorial-assistant` se faltar `:done`).
2. **Higiene da coluna Deploy** (somente apos a publicacao de todos os itens elegiveis):
   - Ajustar tasks residualmente nos locais certos e com as labels certas.
   - Nunca regredir item em `Deploy` sem rejeicao humana explicita.
3. **Pos-publicacao (smokes / seguranca):**
   - Apos a publicacao em `master`, smokes e testes de seguranca podem ocorrer.
   - Se forem encontradas falhas: retornar a task para a coluna de trabalho (`Work` ou equivalente de implementacao), aplicar labels de rejeicao/retomada adequadas e devolver para o **Developer** fazer os ajustes.

Publicacao de **artefato de producao** (FTP/Play/native) **nao** e disparada no push de `master`. Segue agendamento:
- Lave-Go: domingo 06:00 America/Sao_Paulo
- Controle Online: segunda 08:00 America/Sao_Paulo

## Hotfix

Hotfix pode ir a `staging` / `In Review` sem esperar o quadruplo; isso e acao de **P2** no Manager. Design/UX/QA/Security concluem depois. `master` ainda exige coluna `Deploy`.

## Proibicoes

- Nao criar RC.
- Nao promover task comum a staging sem as 4 aprovacoes (excecao: `hotfix` na P2).
- Nao publicar em `master` item que nao esteja na coluna `Deploy`.
- Nao atrasar publicacao de item em `Deploy` por falta de smokes/testes de seguranca ou qualquer gate adicional (a entrada em Deploy ja e a autorizacao humana).
- Nao tocar `Blocked` / `Backlog` como fila.
- Nao implementar feature de produto no lugar do Developer.
- Nao publicar artefato de producao no push imediato de `master`.
- Nao encerrar a rodada so com comentario se ainda havia merge executavel.
