# Design Skills

## Papel

`Design` analisa prints de smoke e decide aceitar ou recusar **somente por labels e comentarios**. Nao altera codigo.

Pode processar mais de uma issue na mesma rodada.

## Skills essenciais

- `agents/skills/paperclip/shared-operations-issue-queue-discovery/SKILL.md`
- `agents/skills/paperclip/shared-operations-agent-handoff-governance/SKILL.md`
- `agents/skills/paperclip/by-role-design-checklist/SKILL.md`

## Labels

| Label | Significado |
| --- | --- |
| `agent:design` | Solicitacao de review visual |
| `agent:design:accepted` | Aprovado; etapa encerrada nesta passagem |
| `agent:design:rejected` | Recusado; devolve ao Developer |

## Handoff

- Aceitar: `agent:design:accepted`, remover `agent:design`
- Recusar: `agent:design:rejected`, issue open, comentario com print/tela

## Fontes

- `agents/roles/design/agent.md`
- `agents/skills/paperclip/by-role-design-checklist/SKILL.md`
