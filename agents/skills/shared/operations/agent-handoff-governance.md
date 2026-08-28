# Agent Handoff Governance

## Overview

Use esta skill para padronizar tags, transicao de etapa, handoff tecnico e desvio operacional entre agents.

## Workflow

1. confirme a tag `agent:*` esperada para a etapa atual
2. nunca atribua a task a pessoas, bots ou fallbacks tecnicos; assignee nao faz parte do fluxo
3. agentes nao fecham tasks fora do rito de colunas; humanos controlam `closed` quando aplicavel
4. se a task estiver em `Ready` ou `Working` sem `agent:*`, a entrada padrao e `Developer`
5. fluxo tecnico padrao (integracao continua, **sem RC**):
   - `Developer` implementa em `task-{id}` (de `master`), **merge em `dev`**, handoff com `agent:qa` + `agent:security` + `agent:design` + `agent:ux`, task em `Working`
   - `QA` registra `agent:qa:accepted` ou `agent:qa:rejected`
   - `Security` registra `agent:security:accepted` ou `agent:security:rejected`
   - `Design` registra `agent:design:accepted` ou `agent:design:rejected` (prints de smoke)
   - `UX` registra `agent:ux:accepted` ou `agent:ux:rejected` (jornada nos prints)
   - quando a task tiver as **quatro** aprovacoes, `DevOps` promove **somente** `task-{id}` → `staging` e move a task para **`In Review`**
   - humano confere staging e move a task para **`Deploy`**
   - item em **`Deploy`** entra **sozinho** em `master`: `DevOps` mescla o delta `staging`/`task-{id}` → `master` e move para **`Done`**
   - documentacao (`tutorial-assistant` / `technical-documenter`): no publish (fail-closed) aplicar labels de solicitacao ausentes; so os documentadores marcam `:done`
6. **Pulo de etapa ja concluida:** se o passo ja estiver feito (evidencia no GitHub), pule, avance e comente a justificativa. QA/Security/Design/UX ainda registram aceite/recusa da propria etapa.
7. qualquer etapa pode abrir task paralela de infraestrutura com `agent:sysadmin`; nunca substitui a tarefa-mae
8. quando o `Sysadmin` concluir a paralela, comenta na mae e aplica o handoff cabivel
9. cada agent so troca a tag da propria proxima etapa quando sua etapa estiver concluida (ou pulada com evidencia)
10. **nao ha RC.** Nao criar task pai `RC X.Y.Z-rc.N`. Nao freeze de pacote. Cada task quádruplo-accepted sobe sozinha para staging/In Review.
11. nao faca handoff sem evidencia concreta

## Output Contract

- tag operacional atual
- proxima tag / coluna
- evidencia do handoff, bloqueio ou pulo
- se houve devolucao, por que

## Quality Bar

- nao retenha task na fila errada
- nao use assignee como ownership
- nao trate conflito de merge como detalhe
- nao mova tarefa por aproximacao textual
- nao abra RC
- nao refaca passo ja evidenciado; documente o pulo
