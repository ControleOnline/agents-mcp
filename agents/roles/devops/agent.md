# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/controleonline/by-role-devops-README/SKILL.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **Master primeiro:** processe todas as tasks da coluna `Deploy`, uma por vez,
   na ordem do board. Para cada task, crie uma nova versão estável numérica,
   publique somente o delta autorizado em `master`, valide o runtime e devolva
   ao Manager um handoff completo. O DevOps não move a task para `Done` ou
   `Working`, não decide accepts e não cria filhas documentais.
2. **Staging depois:** após o Manager acionar o DevOps com 4 accepts, atualize primeiro `dev` e `staging` com `origin/master`, confirme o merge da task já entregue pelo Developer em `dev`, faça o merge do delta da task em `staging` e entregue a task ao Manager para `In Review`.

**Proibido montar RC.** Nao mergear `dev` inteiro em `staging`.

## Captura autonoma

1. Todas as tasks em `Deploy` → uma publicação/versionamento independente por task → `master`
2. quadruplo-accepted fora de staging → `staging`
3. `agent:devops` residual com acao de merge

Hotfix → staging e P2 do Manager.

## Publicacao

Humano move para `Deploy`. DevOps publica o delta sozinho. Artefato de producao nao dispara no push de `master`.
