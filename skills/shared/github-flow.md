# GitHub Flow

## Overview

Use esta skill como fonte canonica do fluxo de branches e entrega tecnica do ecossistema ControleOnline.

Este fluxo e uma adaptacao do **GitHub Flow**: trabalho curto em branch derivada da linha principal, integracao continua na branch de integracao e promocao controlada para producao.

No ControleOnline a linha principal de desenvolvimento e `master`. A integracao diaria acontece em `staging`. A unica PR formal do fluxo normal e a promocao `staging` -> `master`, aberta pelo `DevOps` no ponto certo do release candidate (RC) e do deploy.

## O que e GitHub Flow neste contexto

GitHub Flow classico:

1. branch a partir da linha principal
2. commits pequenos e focados
3. integracao via revisao
4. merge na linha principal
5. deploy a partir da linha principal

Adaptacao ControleOnline:

1. branch de tarefa a partir de `master`
2. commits na branch `task-{id_issue}`
3. entrega da tarefa em `staging` **sem PR do Developer**
4. revisao de qualidade e seguranca sobre a entrega (labels e handoff por `agent:*`)
5. `DevOps` cria a release tecnica / RC e, no ponto autorizado, abre a **unica PR** do fluxo normal: `staging` -> `master`
6. apos aprovacao humana em `Deploy`, `DevOps` publica a build

## Regras de branch

### Nome

- branch de trabalho obrigatoria: `task-{id_issue}`
- o numero deve ser o da issue GitHub correspondente
- exemplos validos: `task-42`, `task-1087`

### Origem

- derive sempre de `master` atualizado (`origin/master`)
- se `task-{id_issue}` ja existir, reutilize-a
- antes de implementar, sincronize a branch com `origin/master`
- resolva conflitos antes de continuar a implementacao

### Branches proibidas para trabalho direto

Nenhum agent de produto (`Developer`, `QA`, `Security`) pode commitar ou pushar diretamente em:

- `master`
- `main`
- `staging`
- qualquer branch que nao seja a `task-{id_issue}` da tarefa em execucao

## Papel do Developer neste fluxo

O `Developer`:

1. captura issue elegivel
2. cria ou reutiliza `task-{id_issue}` a partir de `master`
3. implementa e valida na branch da tarefa
4. mantem a branch sincronizada com `origin/master`
5. **entrega em `staging` sem abrir PR**
6. registra evidencia na issue e faz handoff por label `agent:*` (tipicamente para `QA` / `Security`)

### Proibicao de PR para o Developer

- o `Developer` **nao abre PR**
- PR nao e o mecanismo de handoff nem de encerramento da etapa de desenvolvimento
- o handoff operacional e a troca de `agent:*`, comentario objetivo na issue e estado da task no ProjectV2
- abrir PR como Developer no fluxo normal e desvio e deve ser evitado

### Como entregar em staging

A entrega em `staging` e a integracao do resultado da `task-{id_issue}` na branch `staging`, sem PR do Developer.

Regras:

- a origem da mudanca continua sendo apenas `task-{id_issue}`
- nao trabalhe diretamente em `staging`; integre o resultado da task branch
- preserve rastreabilidade issue <-> branch <-> commits
- se a integracao em `staging` exigir resolucao de conflito ou desvio de trilha, isso pode cair para `DevOps` como excecao operacional, sem transformar `DevOps` no executor de produto

## Revisao (QA e Security)

- `QA` e `Security` atuam sobre a task e a evidencia da entrega
- registram apenas `qa:accepted` / `qa:rejected` e `security:accepted` / `security:rejected`
- nao finalizam task e nao abrem PR de promocao
- recusa devolve prioridade ao `Developer` na mesma `task-{id_issue}`

## Papel do DevOps e a unica PR do fluxo

Somente o `DevOps` abre a PR formal do fluxo normal, e apenas no ponto certo:

### Quando

- `qa:accepted` e `security:accepted` coexistirem
- a release tecnica / RC estiver preparada
- a promocao para a linha de producao estiver autorizada pelo rito do board (`In Review` -> aprovacao humana -> `Deploy`, conforme governanca vigente)

### O que a PR representa

- base: `master`
- head: `staging` (ou o conjunto ja consolidado em `staging` que compoe o RC)
- objetivo: promover o RC aprovado para `master`
- a PR nao substitui a validacao de `QA`/`Security` nem a aprovacao humana de deploy

### Depois da PR

- merge da PR `staging` -> `master` so ocorre quando a promocao estiver liberada
- em `Deploy`, `DevOps` publica a build em producao
- apos publicar, move a task para a trilha documental conforme as skills de `DevOps`

Detalhes de publicacao em `master` continuam em `skills/shared/master-publication.md`.

## Resumo do fluxo ponta a ponta

```text
master
  └─ task-{id}          (Developer cria a partir de master)
       └─ entrega       (Developer integra em staging, sem PR)
            └─ staging  (integracao continua)
                 └─ QA + Security (labels na task)
                      └─ DevOps prepara RC / release tecnica
                           └─ PR staging -> master   (somente DevOps)
                                └─ Deploy / producao (DevOps apos aprovacao humana)
```

## Relacao com outras skills

- criacao de issue/backlog: `skills/agents/cto/github-backlog-task-creation.md`
- criterios de conclusao de etapa: `skills/shared/task-completion-criteria.md`
- publicacao em master: `skills/shared/master-publication.md`
- hotfix a partir de master: `skills/shared/operational-github-workflow.md`
- ownership e handoff: `skills/shared/agent-handoff-governance.md` e `AGENTS.md`

## Quality Bar

- nao derive branch de trabalho de `staging` ou de outra task
- nao nomeie branch sem o numero da issue
- nao permita que `Developer`, `QA` ou `Security` abram PR no fluxo normal
- nao trate comentario ou diagnostico como entrega em `staging`
- nao promova para `master` sem o rito de RC/DevOps
- nao use assignee como ownership da trilha
- nao feche issue; `closed` pertence apenas a humanos
