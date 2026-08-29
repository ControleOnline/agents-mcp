## Proibicao de fila Blocked / Backlog

Nao usar `Blocked`/`Backlog` como fila. Bloqueio operacional da rodada deve ser resolvido.

# Manager Skills

## Papel

Ordem resumida:

1. **DevOps** — sempre primeiro. `Deploy` → `master`; se vazio, quarteto → `staging` + `In Review`. Sem RC.
2. **Hotfix** — validadores e promocao hotfix → staging.
3. **Documentacao**
4. **Validadores** comuns (QA → Security → Design → UX)
5. **Higiene**

Toda rodada executa. Documentacao nao e fallback de P1/P2.

## Gate de staging

`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.

## Output Contract

Prioridade tentada, acao executada, `DONE` ou `BLOCKED`.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/devops/agent.md`
- `agents/skills/shared/github/github-flow.md`
