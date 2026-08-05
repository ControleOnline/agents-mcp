# Agents

Esta pasta concentra a definição canônica dos agents e a biblioteca de skills.

## Estrutura

```
agents/
├── roles/                 # ponto de entrada canônico de cada papel
│   └── <role>/agent.md
└── skills/                # biblioteca de instruções reutilizáveis
    ├── shared/            # políticas e guardrails transversais
    │   ├── github/
    │   ├── documentation/
    │   ├── security/
    │   ├── quality/
    │   └── operations/
    ├── by-role/           # orientações específicas por papel
    └── runners/           # mapas de runtime e workflows
```

## Roles

- `agents/roles/cto/agent.md`
- `agents/roles/developer/agent.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/devops/agent.md`
- `agents/roles/sysadmin/agent.md`
- `agents/roles/tutorial-assistant/agent.md`
- `agents/roles/technical-documenter/agent.md`

Documentação pública e técnica ficam em `tutorial-assistant` e `technical-documenter` (não existe mais o papel `documentor`).

Os wrappers locais em `.github/agents/*.agent.md` devem apontar para exatamente um desses arquivos centrais por tipo.

## Skills

- Compartilhadas: `agents/skills/shared/`
- Por papel: `agents/skills/by-role/<role>/`
- Runtime: `agents/skills/runners/`

## Workers

A execução real vive em `workers/`:

- `workers/automate/`
- `workers/automation/`
- `workers/src/`
- `workers/scripts/`

## Notas

- Sempre leia o `AGENTS.md` antes de fazer qualquer tarefa.
- Qualidade de código: `agents/skills/shared/quality/code-quality.md`
- Segurança editorial: `agents/skills/shared/security/security-guardrails.md`
- Wrappers: `workers/scripts/sync-copilot-agents.mjs`
