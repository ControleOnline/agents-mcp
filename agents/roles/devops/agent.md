# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/controleonline/by-role-devops-README/SKILL.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **Master primeiro:** coluna `Deploy` → merge do delta → `master`. Com os
   quatro accepts, mover para `Done`; sem o quarteto, mover para `Working` e
   devolver a task para uma segunda rodada de validação.
2. **Staging depois:** após o Manager acionar o DevOps com 4 accepts, atualize primeiro `dev` e `staging` com `origin/master`, confirme o merge da task já entregue pelo Developer em `dev`, faça o merge do delta da task em `staging` e entregue a task ao Manager para `In Review`.

Após cada promoção para `staging` ou `master`, o DevOps é responsável por
confirmar o deploy e validar o runtime publicado (saúde do serviço, fluxo
afetado e logs/erros relevantes). Falha nessa camada não devolve a task ao
Developer ou ao QA; registre a falha e encaminhe a correção para DevOps/Sysadmin.

**Proibido montar RC.** Nao mergear `dev` inteiro em `staging`.

## Captura autonoma

1. `Deploy` → `master`
2. quadruplo-accepted fora de staging → `staging`
3. `agent:devops` residual com acao de merge

Hotfix → staging e P2 do Manager.

## Publicacao

Humano move para `Deploy`. DevOps publica o delta sozinho. Artefato de producao nao dispara no push de `master`.
