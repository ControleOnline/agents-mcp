# Agent Handoff Governance

## Overview

Use esta skill para padronizar tags, transicao de etapa, handoff tecnico e desvio operacional entre agents.

## Workflow

1. confirme a tag `agent:*` esperada para a etapa atual
2. nunca atribua a task a pessoas, bots ou fallbacks tecnicos; assignee nao faz parte do fluxo
3. agentes nao fecham tasks fora do rito de colunas; humanos controlam aprovacao de pacote e `closed` quando aplicavel
4. se a task estiver em `Ready` ou `Working` sem `agent:*`, a entrada padrao e `Developer`
5. fluxo tecnico padrao:
   - `Developer` implementa em `task-{id}` (de `master`), **merge em `dev`**, handoff com `agent:qa` + `agent:security`, task em `Working`
   - `QA` registra `qa:accepted` ou `qa:rejected`
   - `Security` registra `security:accepted` ou `security:rejected`
   - quando houver tasks com **ambas** as aprovacoes e **nao** existir RC aberto, `DevOps` monta o **RC** (semver), coloca o pacote em **`staging`** (pai + submodulos), cria **task pai de deploy** com as tasks como **subtasks**, move pai e filhas para **`In Review`**
   - humano confere staging e move a task pai para **`Deploy`**
   - `DevOps` mescla **`staging` → `master`** e move para **`Done`**
   - documentacao (`tutorial-assistant` / `technical-documenter`): **DevOps no publish** aplica labels de solicitação ausentes nas filhas de produto; **Manager na higiene** completa labels de solicitação se `Done`/`closed` ficou sem quarteto; documentadores só marcam `:done` com evidência real
6. **Pulo de etapa ja concluida:** se merge ou passo tecnico **ja estiver feito** (evidencia no GitHub), o agent **pula** esse passo, avanca a task ao **proximo estagio** e **comenta na issue** a justificativa (o que ja estava feito, como verificou, para onde avanca). Nao pule por intuicao. QA/Security ainda precisam registrar aceite/recusa quando for a etapa deles.
7. qualquer etapa pode abrir task paralela de infraestrutura com `agent:sysadmin`; nunca substitui a tarefa-mae
8. quando o `Sysadmin` concluir a paralela, comenta na mae e aplica o handoff de seguranca/revisao cabivel
9. cada agent so troca a tag da propria proxima etapa quando sua etapa estiver realmente concluida (ou legitimamente pulada com evidencia + comentario)
10. **um RC por vez**; freeze do pacote — tasks aprovadas depois do freeze aguardam o proximo RC
11. nao faca handoff sem evidencia concreta do que foi validado, corrigido, bloqueado ou pulado

## Output Contract

Ao concluir, informe objetivamente:

- qual era a tag operacional atual
- qual foi a proxima tag / coluna definida pela sequencia real
- qual evidencia sustentou o handoff, o bloqueio ou o **pulo de etapa**
- se houve devolucao para etapa anterior, por que
- se houve task pai de RC / subtasks, quais ids

## Quality Bar

- nao retenha task na fila errada
- nao use assignee como atalho de ownership
- nao trate conflito de merge como detalhe secundario quando bloqueia o fluxo
- nao mova tarefa por aproximacao textual
- nao abra segundo RC em paralelo
- nao refaca passo ja evidenciado; documente o pulo
- nao substitua a tarefa-mae por task paralela de infraestrutura
