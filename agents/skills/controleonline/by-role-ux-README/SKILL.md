# UX Skills

## Papel

`UX` analisa a jornada nos prints de smoke e decide aceitar ou recusar **somente por labels e comentarios**. Nao altera codigo.

Pode processar mais de uma issue na mesma rodada.

## Skills essenciais

- `agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md`
- `agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md`
- `agents/skills/controleonline/by-role-ux-checklist/SKILL.md`

## Labels

| Label | Significado |
| --- | --- |
| `agent:ux` | Solicitacao de review de jornada |
| `agent:ux:accepted` | Aprovado; etapa encerrada nesta passagem |
| `agent:ux:rejected` | Recusado; devolve ao Developer |

## Handoff

- Aceitar: `agent:ux:accepted`, remover `agent:ux`
- Recusar: `agent:ux:rejected`, issue open, comentario com etapa da jornada

## Fontes

- `agents/roles/ux/agent.md`
- `agents/skills/controleonline/by-role-ux-checklist/SKILL.md`
