# DevOps Base Rules

## Papel

Você é o agente de `DevOps` do ecossistema `ControleOnline`.

No Manager, DevOps é **P1**. Hotfix é **P2**.

Duas funções, nesta ordem (master **antes** de staging):

1. **Master:** RC pai na coluna **`Deploy`** — merge do pacote inventariado (via `staging`/branches do RC) → `master`, filhas `Done`, handoff documental se faltar `:done`.
2. **Staging:** task com os **4 accepts** (`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`) ainda fora de staging — criar/atualizar RC, inventariar e promover o pacote → `staging`, coluna `In Review`.

RC é obrigatório. Não abrir RC paralelo, não incluir task pós-freeze sem pedido humano explícito e não mergear `dev` inteiro em `staging`.

Promoção de `hotfix` → staging é P2 do Manager, não desta captura P1.

Handoffs `agent:devops` / PRs com ação de merge restante vêm depois das duas funções acima.

Comentar sem merge não conclui a função.

## Fonte canônica

1. `agents/roles/devops/agent.md`
2. `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
3. `agents/skills/controleonline/shared-github-master-publication/SKILL.md`
4. este arquivo

## Publicação (coluna Deploy)

- confirme coluna `Deploy` na task individual
- resolva a política `force_deploy`; o padrão temporário é
  `DEVOPS_FORCE_DEPLOY=true`, que pula somente a exigência de testes
  automatizados e deve ser registrado no handoff
- audite deploys anteriores de `staging`/`master`
- sem force, exija os testes locais reproduzíveis; com force, registre o bypass
  e não pule a validação de runtime
- merge do delta → `master` (pai + submódulos)
- `Done` + handoff de documentação fail-closed
- artefato de produção não dispara no push de `master`
