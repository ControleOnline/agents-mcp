# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/by-role/devops/README.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **Master primeiro:** coluna `Deploy` → merge do delta → `master` → `Done`.
2. **Staging depois:** 4 accepts → merge `task-{id}` → `staging` → `In Review`.

**Proibido montar RC.** Nao mergear `dev` inteiro em `staging`.

## Captura autonoma

1. `Deploy` → `master`
2. quadruplo-accepted fora de staging → `staging`
3. `agent:devops` residual com acao de merge

Hotfix → staging e P2 do Manager.

## Publicacao

Humano move para `Deploy`. DevOps publica o delta sozinho. Artefato de producao nao dispara no push de `master`.
