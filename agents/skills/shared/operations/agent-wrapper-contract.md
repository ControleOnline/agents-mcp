# Agent Wrapper Contract

Wrappers locais em `.github/agents/*.agent.md` devem permanecer finos.

## Regras

1. apontar para `agents/roles/<role>/agent.md` como fonte canônica
2. listar apenas o contexto local mínimo (repo, branch base, AGENTS.md)
3. não duplicar biblioteca operacional que vive em `agents/skills/`
4. regenerar via `workers/scripts/sync-copilot-agents.mjs` quando a estrutura canônica mudar
