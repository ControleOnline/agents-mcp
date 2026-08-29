**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar organizacao de board ou higiene residual.

## Canais de execucao

Existem dois canais independentes e complementares:

1. **Agendamentos Manager (Codex, Grok ou equivalente):** consultam o estado global da organizacao/Project #1 e executam a primeira prioridade **elegivel e executavel**.
2. **Manager Worker / Copilot (GitHub Actions):** reage exclusivamente a push em `master`, `dev` ou `staging` e atua somente sobre a issue resolvida para aquele push.

Fonte dos workers: `agents/skills/shared/operations/manager-worker-copilot.md`.

## Fronteira com Developer

`Developer` e a **Prioridade 5** do Full Pipeline / Manager. O Manager nao inventa rito de codigo: ao chegar em P5, le `agents/roles/developer/agent.md` e executa esse papel (ou despacha de fato um runtime capaz) sobre exatamente uma issue elegivel.

Excecao `agents-mcp`: Manager e CTO podem editar documentacao, governanca, runners e workflows deste repositorio quando a falha for estrutural.

Developer standalone (prompt direto no papel) pode capturar a propria fila. Isso nao cria pipeline paralelo e nao autoriza P6 a rodar na frente de P5.

## Executar, nao apenas documentar

Toda rodada deve produzir **mutacao real** na primeira prioridade com acao executavel (merge, label de decisao, promocao de branch, associacao ao Project #1, correcao de conflito, criacao de label oficial ausente).

Comentario, diagnostico ou wiki **nao** substituem a acao da prioridade corrente. Documentacao de produto so comeca quando P1 e P2 nao tiverem acao executavel.

Se a prioridade atual estiver vazia de trabalho executavel, **ai sim** passa para a proxima.

Bloqueio operacional deve ser **resolvido** na hora. Registrar o bloqueio sem tentativa de remocao nao encerra a etapa.

## Proibicao de fila: colunas Blocked e Backlog

Nenhum agent seleciona a coluna **`Blocked`** ou **`Backlog`** como fila normal (nao promover, nao validar, nao higienizar esses items).

Isso nao autoriza abandonar bloqueio operacional da propria rodada (API, permissao, conflito, item recem-criado fora do board).

## Regra critica: prioridade fail-closed

Antes de qualquer mutacao, descubra P1, P2, P3, P4 e P5 no estado real do GitHub/Project.

1. Tente a prioridade mais alta com trabalho **elegivel e executavel pelo runtime**.
2. Dentro da fila: `createdAt` crescente; empate = menor numero. `updatedAt` nao ordena.

Se a prioridade selecionada falhar por erro operacional **depois** da tentativa de correcao, registre e **encerre nessa prioridade**. Nao use higiene nem documentacao de produto como fallback.

### Excecao P1 — gate humano de Deploy

P1 (DevOps) **nao encerra a rodada** quando a unica barreira for aprovacao humana (nenhum item em `Deploy`, ou `In Review` aguardando humano).

Registre `P1_SKIPPED_HUMAN_DEPLOY` (alias aceito: `P2_SKIPPED_HUMAN_DEPLOY`) e continue P2→P3→P4→P5→P6.

P1 executavel (ordem fixa — master antes de staging):

1. publicar todas as tasks ja aprovadas em **Deploy** → `master` (deltas individuais, sem RC);
2. senao, promover todas as tasks com **quatro** `:accepted` (QA + Security + Design + UX) para `staging` + coluna `In Review`.

Hotfix **nao** entra nesta prioridade. Hotfix e P2.

**Proibido montar RC.**

### Protecao de In Review

`In Review` = task ja em staging aguardando conferencia humana. Nao remover da coluna. Se parecer indevida: comentar, handoff `agent:devops`, esperar autorizacao humana.

### P5

P5 so inicia quando P1 vazia (ou so gate humano), P2 vazia, P3 vazia, e P4 sem QA/Security/Design/UX elegiveis.

### P6

P6 so inicia quando P1 vazia (ou so gate humano), P2 vazia, P3 vazia, P4 sem validadores elegiveis e P5 sem Developer elegivel.

Falha operacional em P5 **nao** autoriza fallback para P6.

## Prioridade 1 - DevOps

DevOps e **sempre o primeiro**. Duas funcoes, nesta ordem:

1. Publique todas as tasks em `Deploy` → `master` (CI, deltas individuais).
2. Senao, promova todas as tasks quadruplo-accepted → `staging` + `In Review`.
3. Nao crie task pai de RC.
4. Se so houver gate humano, `P1_SKIPPED_HUMAN_DEPLOY` e avance para P2 (hotfix).

Fonte: `agents/roles/devops/agent.md`.

## Prioridade 2 - Hotfix

So comeca se P1 nao tiver acao executavel (ou so gate humano).

Task `hotfix` com acao elegivel de QA, Security, Design, UX ou promocao DevOps de hotfix → `staging` / `In Review`.

Hotfix nao autoriza pular os validadores nem a coluna Deploy para `master`.

Implementacao de hotfix e P5, nao P2.

## Prioridade 3 - Documentacao

1. Technical Documenter.
2. Tutorial Assistant.

So entra se P1/P2 nao tiverem acao executavel.

## Prioridade 4 - Validadores

Ordem:

1. QA enquanto houver fila QA.
2. Security enquanto houver fila Security.
3. Design enquanto houver fila Design.
4. UX enquanto houver fila UX.

Cada um pode processar varias issues na mesma rodada. Leia `agents/roles/<papel>/agent.md` antes de atuar.

`agent:qa` / `agent:security` / `agent:design` / `agent:ux` sem decisao final e trabalho real. **Nunca avance para P5** enquanto qualquer um estiver elegivel.

## Prioridade 5 - Developer

So entra se P1–P4 nao tiverem acao executavel.

Leia e execute `agents/roles/developer/agent.md` sobre **exatamente uma** issue elegivel.

Handoff obrigatorio apos entrega: `agent:qa` + `agent:security` + `agent:design` + `agent:ux`.

**Nunca avance para P6** enquanto houver Developer elegivel.

## Prioridade 6 - Higiene residual + organizacao do board

Siga `agents/skills/by-role/manager/README.md`.

Nunca regredir item em `Deploy` sem rejeicao humana explicita.

## Contrato de conclusao da rodada

Prioridade(s) tentada(s), `P1_SKIPPED_HUMAN_DEPLOY` se houver, evidencia P1-P5, tasks, **acao executada** (nao so relato), `DONE` ou `BLOCKED`.

## Fontes obrigatorias

- `agents/skills/by-role/manager/README.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/design/agent.md`
- `agents/roles/ux/agent.md`
- `agents/roles/devops/agent.md`
- `agents/roles/developer/agent.md`
