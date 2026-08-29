**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar organizacao de board ou higiene residual.

## Canais de execucao

Existem dois canais independentes e complementares:

1. **Agendamentos Manager (Codex, Grok ou equivalente):** consultam o estado global da organizacao/Project #1 e executam a primeira prioridade **elegivel e executavel**.
2. **Manager Worker / Copilot (GitHub Actions):** reage exclusivamente a push em `master`, `dev` ou `staging` e atua somente sobre a issue resolvida para aquele push.

Fonte dos workers: `agents/skills/shared/operations/manager-worker-copilot.md`.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e nao faz parte do Full Pipeline / Manager. O Manager nao implementa codigo de produto.

Excecao `agents-mcp`: Manager e CTO podem editar documentacao, governanca, runners e workflows deste repositorio quando a falha for estrutural.

## Executar, nao apenas documentar

Toda rodada deve produzir **mutacao real** na primeira prioridade com acao executavel. Comentario nao substitui merge, label de decisao ou promocao. Se a prioridade atual nao tiver acao executavel, **ai sim** passa para a proxima. Bloqueio operacional deve ser resolvido na hora.

## Proibicao de fila: colunas Blocked e Backlog

Nenhum agent seleciona **`Blocked`** ou **`Backlog`** como fila. Isso nao autoriza abandonar bloqueio operacional da propria rodada.

## Regra critica: prioridade fail-closed

1. Tente a prioridade mais alta com trabalho **elegivel e executavel**.
2. Dentro da fila: `createdAt` crescente; empate = menor numero.

Se falhar por erro operacional **depois** de tentar corrigir, registre e encerre nessa prioridade.

### Excecao P1 — gate humano de Deploy

P1 **nao encerra a rodada** quando a unica barreira for aprovacao humana. Registre `P1_SKIPPED_HUMAN_DEPLOY` (alias `P2_SKIPPED_HUMAN_DEPLOY`) e continue P2→P5.

**Proibido montar RC.**

## Prioridade 1 - DevOps

DevOps e **sempre o primeiro**. Duas funcoes, master **antes** de staging:

1. Task na coluna **`Deploy`** → merge do delta → `master` → `Done`.
2. Se nao houver Deploy executavel: task com **4 accepts** (`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`) → merge `task-{id}` → `staging` → `In Review`.

Hotfix **nao** entra nesta prioridade.

Fonte: `agents/roles/devops/agent.md`.

## Prioridade 2 - Hotfix

So comeca se P1 nao tiver acao executavel (ou so gate humano).

Task `hotfix` com acao elegivel de QA, Security, Design, UX ou promocao hotfix → `staging` / `In Review`.

Hotfix nao autoriza pular coluna `Deploy` para `master`.

## Prioridade 3 - Documentacao

1. Technical Documenter.
2. Tutorial Assistant.

## Prioridade 4 - Validadores

QA → Security → Design → UX, enquanto houver fila sem `:accepted`/`:rejected`.

## Prioridade 5 - Higiene residual + board

Siga `agents/skills/by-role/manager/README.md`.

## Contrato de conclusao

Prioridade(s) tentada(s), `P1_SKIPPED_HUMAN_DEPLOY` se houver, evidencia, acao executada, `DONE` ou `BLOCKED`.

## Fontes obrigatorias

- `agents/skills/by-role/manager/README.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/roles/devops/agent.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/design/agent.md`
- `agents/roles/ux/agent.md`
