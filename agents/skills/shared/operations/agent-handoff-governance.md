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


## Sanitização de labels (obrigatória)

**Sempre** que houver **movimentação de coluna** no Project #1 **ou** **reabertura** de issue (`state: closed` → `open`), o agent que mutar deve **sanitizar as labels** na mesma passagem — não deixar labels do estágio anterior contradizendo a nova coluna/estado.

### Ao mover coluna

1. Identificar o **estágio canônico** da coluna de destino (Ready / Working / In Review / Deploy / Done).
2. Garantir as labels **mínimas** desse estágio (ver tabela em `agents/roles/manager/agent.md`).
3. **Remover** labels incompatíveis com o destino, por exemplo:
   - voltar de validação para implementação → remover `qa:accepted` / `security:accepted` **somente** se a evidência foi invalidada ou a entrega foi revertida; caso contrário documentar por que permanecem;
   - sair de fila de QA/Security → remover `agent:qa` / `agent:security` se a decisão (`:accepted`/`:rejected`) já foi registrada;
   - entrar em **Ready**/**Working** para retrabalho pós-`rejected` → garantir `agent:developer` ou `agent:sysadmin` (ownership) e manter `qa:rejected`/`security:rejected` até nova entrega;
   - **Done** → exigir quarteto de conclusão (ou exceção estrutural documentada); não usar Done como atalho com labels de fila (`agent:qa` sem decisão, etc.).
4. Comentar na issue: coluna antes → depois; labels removidas/adicionadas; motivo.

### Ao reabrir issue

1. Remover labels de **conclusão indevida** no novo contexto (ex.: `agent:*:done` sem evidência, ou dual-accepted se a entrega foi revertida/invalidada).
2. Restaurar `agent:<papel>` do **próximo executor** real (Developer, Sysadmin, QA, Security, etc.).
3. Alinhar coluna do Project #1 a **Ready** ou **Working** (nunca deixar reaberta em **Done**).
4. Comentar: por que reabriu; labels sanitizadas; próximo handoff.

### Proibido

- Mover coluna **sem** tocar labels quando o estágio muda de papel.
- Reabrir issue e deixá-la sem `agent:*` de ownership.
- Manter `agent:qa` + `qa:accepted` juntos (decisão já tomada → remover `agent:qa`).
- Usar assignee como substituto de label de handoff.

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
