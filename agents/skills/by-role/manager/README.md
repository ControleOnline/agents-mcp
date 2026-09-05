## Proibicao de fila Blocked / Backlog

Em **qualquer** prioridade (incluindo P6 higiene): **nao usar** issues/PRs com Status **`Blocked`** ou **`Backlog`** como fila.

Bloqueio operacional da rodada (API, conflito, label, board) deve ser resolvido, nao apenas documentado.

# Manager Skills

## Papel

O `Manager` executa o Full Pipeline na ordem definida em `agents/roles/manager/agent.md`. O Developer e a Prioridade 5 desse ciclo.

Toda rodada **executa**. Documentacao de produto nao e fallback enquanto P1/P2/P4 tiverem acao. Higiene nao e fallback enquanto P5 tiver Developer elegivel.

Ordem resumida:

1. **DevOps** - sempre primeiro. **Sempre** publicar todos os itens em `Deploy` para `master` (sem bloqueio por aprovacao/smoke/seguranca). Apos publicar → **Done**. Working so em **segunda rodada** (falha pos-publicacao). Se nao houver Deploy, promover quadruplo-accepted → `staging` + `In Review`. Gate humano (coluna vazia) **nao** encerra a rodada. **Nao montar RC.**
2. **Hotfix** - QA / Security / Design / UX em tasks `hotfix`, e promocao hotfix → staging se ainda faltar. So depois de P1 sem acao executavel.
3. **Documentacao** - Technical Documenter / Tutorial Assistant (so se P1/P2 sem acao executavel).
4. **Validadores** - QA, Security, Design, UX (nesta ordem enquanto houver fila).
5. **Developer** - exatamente uma issue elegivel; executar `agents/roles/developer/agent.md`.
6. **Higiene residual + board** - somente com P1-P5 sem acao executavel.

## Entrada obrigatoria

Antes de atuar: consulte GitHub e Project #1; descubra P1-P5; tente a primeira prioridade elegivel e executavel; `createdAt` crescente; releia a issue antes de mutar.

## Fail-closed operacional vs skip de P1 humano

Se a prioridade selecionada falhar por ferramenta/credencial/API **depois** de tentar corrigir: registre, `BLOCKED`, nao execute prioridade inferior.

Excecao: P1 so com gate humano de Deploy (coluna vazia / In Review aguardando) → `P1_SKIPPED_HUMAN_DEPLOY` e continue P2-P6. Item **ja em Deploy** nao e gate: **sempre publicar**.

`In Review` = task individual ja em staging aguardando conferencia humana. Nao remover da coluna sem autorizacao humana; se parecer indevida, comentar + handoff `agent:devops` e esperar humano. Nao e freeze nem inventario de filhas.

## Prioridade 4 - validadores

Ordem: QA → Security → Design → UX.

Enquanto existir qualquer um desses elegivel sem decisao final (`:accepted` / `:rejected`), P5 permanece bloqueada e DevOps nao promove task comum.

Agendamento Manager executa o validador diretamente quando o runtime puder; senao `BLOCKED` em P4.

## Prioridade 5 - Developer

Enquanto existir issue elegivel de Developer, P6 permanece bloqueada.

Agendamento Manager executa o papel Developer diretamente quando o runtime puder; senao `BLOCKED` em P5. Nao use higiene como fallback.

## Gate de staging (quatro aprovacoes)

DevOps so promove task comum quando existirem juntas:

- `agent:qa:accepted`
- `agent:security:accepted`
- `agent:design:accepted`
- `agent:ux:accepted`

Documentadores (`:done`) nao fazem parte dessas quatro.

## Output Contract

Prioridade tentada, evidencia P1-P5, tasks, acao executada, `DONE` ou `BLOCKED`.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/developer/agent.md`
- `agents/roles/design/agent.md`
- `agents/roles/ux/agent.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
