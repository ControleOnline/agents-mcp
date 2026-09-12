# agents-mcp

Repositório de orquestração dos agents, skills e workers do ecossistema ControleOnline.

## Estrutura

```
agents/
├── roles/          # definição canônica de cada papel
└── skills/         # biblioteca de skills
    ├── shared/     # regras transversais (github, documentation, security, quality, operations)
    ├── by-role/    # skills por papel
    └── runners/    # mapas de runtime

workers/            # execução (scripts, runners, automações)
├── automate/
├── automation/
├── src/
└── scripts/
```

## Entradas principais

- `agents/skills/controleonline/README/SKILL.md` — mapa da biblioteca
- `agents/skills/controleonline/shared-README/SKILL.md` — políticas compartilhadas
- `agents/skills/controleonline/by-role-<role>-README/SKILL.md` — orientação por agent
- `agents/roles/*/agent.md` — entradas canônicas
- `AGENTS.md` — regras operacionais centrais

## Nota

Este repositório é a fonte canônica. A execução ocorre diretamente pelo Paperclip usando `agents/roles/*/agent.md`.

## Configuracao do fork (obrigatoria)

Leia **`config/ecosystem.config.json`** antes de executar agents ou workers. Veja `config/README.md`.
