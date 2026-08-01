# Agents

Esta pasta concentra os pontos de entrada canonicos dos custom agents.

## Estrutura

- `agents/agent/cto/agent.md`
- `agents/agent/developer/agent.md`
- `agents/agent/qa/agent.md`
- `agents/agent/security/agent.md`
- `agents/agent/devops/agent.md`
- `agents/agent/sysadmin/agent.md`
- `agents/agent/tutorial-assistant/agent.md` (Tutorial Assistant)
- `agents/agent/technical-documenter/agent.md`

Os wrappers locais em `.github/agents/*.agent.md` de cada projeto e submodulo devem apontar para exatamente um desses arquivos centrais por tipo.

As regras compartilhadas vivem em `skills/shared/`. As regras detalhadas de execucao continuam em `automation/` e `automate/`.

Os wrappers locais podem ser regenerados pelo script:

- `scripts/sync-copilot-agents.mjs`

- Sempre leia o `AGENTS.md` antes de fazer qualquer tarefa.
- A qualidade de codigo, modularizacao, smoke tests e limite de tamanho de componentes vive em `skills/shared/code-quality.md`.
- A seguranca editorial e de vazamento de informacao vive em `skills/shared/security-guardrails.md`.
- Regras de negocio especificas continuam indo para `AGENTS.md` ou comentarios proximos da implementacao, conforme o caso.
