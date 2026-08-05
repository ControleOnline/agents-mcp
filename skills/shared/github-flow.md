# GitHub Flow

## Overview

Use esta skill como fonte canonica do fluxo de branches e entrega tecnica do ecossistema ControleOnline.

Este fluxo e uma adaptacao do **GitHub Flow**: trabalho curto em branch derivada da linha principal, integracao continua na branch de integracao e promocao controlada para producao.

No ControleOnline:

- linha principal de desenvolvimento: `master`
- integracao diaria: `staging`
- entrega do Developer em `staging`: **merge** (nao PR)
- unica PR formal do fluxo normal: `staging` -> `master`, aberta **somente pelo DevOps** no ponto do release candidate (RC) e do deploy

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
3. **merge** de `task-{id_issue}` em `staging` (Developer; sem PR)
4. revisao de qualidade e seguranca sobre a entrega (labels e handoff por `agent:*` na issue/task)
5. DevOps prepara a release tecnica / RC
6. DevOps abre a **unica PR** do fluxo normal: `staging` -> `master`
7. apos aprovacao humana em `Deploy`, DevOps publica a build

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

Trabalho acontece na `task-{id_issue}`. A chegada em `staging` e por **merge** da task branch, nao por commit solto em `staging`.

## Papel do Developer

O `Developer`:

1. captura issue elegivel
2. cria ou reutiliza `task-{id_issue}` a partir de `master`
3. implementa e valida na branch da tarefa
4. mantem a branch sincronizada com `origin/master`
5. **faz merge de `task-{id_issue}` em `staging`** (sem abrir PR)
6. registra evidencia na issue e faz handoff por label `agent:*` (tipicamente para `QA` / `Security`)

### Proibicao de PR para o Developer

- o `Developer` **nao abre PR**
- PR nao e mecanismo de handoff nem de encerramento da etapa de desenvolvimento
- o handoff operacional e a troca de `agent:*`, comentario objetivo na issue e estado da task no ProjectV2
- abrir PR como Developer no fluxo normal e desvio

### Entrega em staging = merge

A entrega em `staging` e o **merge** do resultado de `task-{id_issue}` na branch `staging`.

Regras:

- origem da mudanca: apenas `task-{id_issue}`
- operacao: merge (nao PR, nao push direto de commits soltos em `staging`)
- preserve rastreabilidade issue <-> branch <-> commits
- se o merge em `staging` exigir resolucao de conflito ou desvio de trilha, isso pode cair para `DevOps` como excecao operacional, sem transformar `DevOps` no executor de produto

## Revisao (QA e Security)

- `QA` e `Security` atuam sobre a **task/issue** e a evidencia da entrega (commits na task branch e o que ja foi mergeado em `staging`)
- registram apenas `qa:accepted` / `qa:rejected` e `security:accepted` / `security:rejected`
- **nao abrem PR**, nao aprovam PR de produto e nao finalizam task
- nao dependem de PR do Developer (essa PR nao existe no fluxo normal)
- recusa devolve prioridade ao `Developer` na mesma `task-{id_issue}`

## Papel do DevOps e a unica PR do fluxo

Somente o `DevOps` abre PR no fluxo normal, e apenas no ponto certo do RC/deploy.

### Quando

- `qa:accepted` e `security:accepted` coexistirem
- a release tecnica / RC estiver preparada
- a promocao estiver no rito autorizado do board (`In Review` -> aprovacao humana -> `Deploy`, conforme governanca vigente)

### O que a PR representa

- **unica PR formal do fluxo normal**
- base: `master`
- head: `staging` (RC consolidado)
- objetivo: promover o RC aprovado para `master`
- a PR nao substitui a validacao de `QA`/`Security` nem a aprovacao humana de deploy

### Depois da PR

- merge da PR `staging` -> `master` so ocorre quando a promocao estiver liberada
- em `Deploy`, `DevOps` publica a build em producao
- apos publicar, move a task para a trilha documental conforme as skills de `DevOps`

Detalhes de publicacao em `master`: `skills/shared/master-publication.md`.

## Quem pode o que

| Acao | Developer | QA | Security | DevOps |
|------|-----------|----|----------|--------|
| Branch `task-{id}` a partir de `master` | sim | nao | nao | so excecao operacional |
| Merge `task-{id}` -> `staging` | sim | nao | nao | so se conflito/desvio |
| Abrir PR de produto / task | **nao** | **nao** | **nao** | **nao** |
| Labels `qa:*` / `security:*` na task | nao | sim | sim | nao |
| PR `staging` -> `master` (RC) | **nao** | **nao** | **nao** | **sim** |
| Deploy / publicacao | nao | nao | nao | sim |

## Resumo ponta a ponta

```text
master
  └─ task-{id}                    (Developer cria a partir de master)
       └─ merge em staging        (Developer; SEM PR)
            └─ staging            (integracao continua)
                 └─ QA + Security (labels na task; sem PR)
                      └─ DevOps prepara RC / release tecnica
                           └─ PR staging -> master   (SOMENTE DevOps)
                                └─ merge da PR + Deploy
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
- nao substitua merge em `staging` por PR do Developer
- nao trate comentario ou diagnostico como entrega em `staging`
- nao promova para `master` sem o rito de RC/DevOps
- nao use assignee como ownership da trilha
- nao feche issue; `closed` pertence apenas a humanos
