# GitHub Flow

## Overview

Fonte canônica do fluxo de branches e entrega técnica do ecossistema ControleOnline.

Integração contínua **por task**. Não se monta Release Candidate, task pai de RC, freeze de pacote nem inventário de filhas. RCs históricos (`RC X.Y.Z-rc.N`) são legado e não orientam execuções novas.

## Branches

| Branch | Papel |
| --- | --- |
| `master` | Linha principal / produção |
| `dev` | Integração contínua das tasks do Developer (após implementação) |
| `staging` | Deltas já quádruplo-accepted (ou hotfix) para conferência humana; dispara deploy de staging |
| `task-{id_issue}` | Branch de trabalho do Developer |

## Fluxo ponta a ponta

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ merge em dev                 (Developer; SEM PR)
            └─ QA + Security + Design + UX
                 └─ quatro :accepted
                      └─ DevOps merge somente task-{id} → staging
                           └─ coluna In Review (task individual)
                                └─ humano → coluna Deploy
                                     └─ DevOps promove o delta → master → Done
```

## Etapas já concluídas (pular com justificativa)

Se o estado real do GitHub mostrar que o passo **já foi feito**, o agent não refaz. Deve confirmar evidência (commits, merge-base, labels, coluna), pular só o concluído, avançar o próximo estágio e comentar a justificativa.

**Não** pule etapas por intuição. **Não** omita QA/Security/Design/UX sem labels de decisão.

## Developer

1. Captura issue elegível.
2. Cria ou reutiliza `task-{id_issue}` **a partir de `master`** atualizado.
3. Implementa e valida na branch da tarefa.
4. Sincroniza com `origin/master` antes de continuar/encerrar.
5. **Faz merge de `task-{id_issue}` em `dev`** (sem abrir PR) — ou **pula** se já estiver mergeada (com comentário).
6. Registra evidência e handoff (`agent:qa` e `agent:security`; Design/UX quando o escopo tiver UI).

### Proibições do Developer

- **Não** abre PR no fluxo normal.
- **Não** mergeia em `staging` nem em `master`.
- **Não** commit/push direto em `master`, `main`, `dev`, `staging`.
- Trabalho só na `task-{id_issue}`; chegada em `dev` é por **merge** da task branch.

### Entrega = merge em `dev`

- **Nunca** faça merge de `dev` inteiro em `staging`. Merge sempre **apenas** `task-{id}`.
- Origem: `task-{id_issue}`. Destino: `dev`. Operação: merge (não PR).

## Revisão (QA, Security, Design, UX)

- Atuam sobre a task/issue e a evidência da entrega (commits na task branch e o que foi mergeado em **`dev`**).
- Registram `agent:<papel>:accepted` ou `agent:<papel>:rejected`.
- **Não** abrem PR; **não** finalizam task; **não** mexem em branches de integração.
- Recusa devolve prioridade ao Developer na mesma `task-{id_issue}`.

Gate de staging (task comum): as **quatro** labels juntas:

- `agent:qa:accepted`
- `agent:security:accepted`
- `agent:design:accepted`
- `agent:ux:accepted`

## DevOps — integração contínua por task (sem RC)

### Entrada

1. Task na coluna **`Deploy`** (publicar o delta sozinho em `master`).
2. Task **quádruplo-accepted** ainda fora de `staging` / `In Review`.
3. `hotfix` para `staging` / `In Review` (gate de validadores pode ser posterior).
4. Issues/PRs com `agent:devops`.

### Proibido

- Criar task pai `RC X.Y.Z-rc.N`.
- Freeze de pacote / inventário de filhas como rito novo.
- Mergear `dev` inteiro em `staging`.
- Abrir segundo “RC” paralelo.
- Promover task comum a staging sem as quatro `:accepted` (exceção: `hotfix`).

### Promoção a staging

1. Staging parte de `master` atual + merge **somente** de `task-{id}`.
2. Pai + submódulos afetados (submódulos primeiro; pins coerentes).
3. Conflito: abortar aquele merge, comentar, seguir a próxima task.
4. Versão em `package.json` / `app.json` quando o bump for necessário: **somente números** (SemVer). Sem sufixo `-rc`.
5. Push em `staging` dispara deploy de conferência.
6. Mover **essa** task para **`In Review`**.

### `In Review`

Sinal de que a **task individual** já está em staging e aguarda humano. Nenhum Manager/higiene remove da coluna. Se parecer indevida: comentar + `agent:devops` + esperar humano.

### Publicação (coluna Deploy)

1. Humano move a task para **`Deploy`**.
2. DevOps mescla o delta (`staging` / `task-{id}`) → `master` (pai + submódulos).
3. Move a task para **`Done`**.
4. Handoff documental fail-closed (`agent:technical-documenter` / `agent:tutorial-assistant` se faltar `:done`).

Nunca direto a `master` sem coluna `Deploy`.

Detalhes: `agents/skills/shared/github/master-publication.md`.

### O que o DevOps não faz

- Não implementa feature de produto no lugar do Developer.
- Não monta RC.
- Não inclui task comum sem as quatro `:accepted` (exceção `hotfix`).

## Quem pode o que

| Acao | Developer | Validadores | DevOps |
|------|-----------|-------------|--------|
| Branch `task-{id}` a partir de `master` | sim | nao | so excecao |
| Merge `task-{id}` → `dev` | sim | nao | so se conflito/desvio |
| Merge `task-{id}` → `staging` | **nao** | **nao** | **sim** |
| Abrir PR de produto / task | **nao** | **nao** | **nao** (salvo excecao) |
| Labels `:accepted` / `:rejected` | nao | sim | nao |
| Criar task pai RC | **nao** | **nao** | **nao** |
| Merge delta → `master` | **nao** | **nao** | **sim** (coluna Deploy) |

## Hotfix (prioridade absoluta)

Label obrigatória: `hotfix`.

```text
master
  └─ task-{id}
       └─ merge task-{id} → dev
            └─ DevOps merge somente task-{id} → staging (sem esperar quádruplo)
                 └─ In Review → humano Deploy → delta → master → Done
                 └─ QA/Security/Design/UX podem concluir depois
```

- Dual-gate **não** bloqueia entrada em `staging` no hotfix.
- `master` ainda exige coluna **Deploy**.
- Publica **somente o delta** da `task-{id}`.
- Manager P1 = ação elegível de QA, Security, Design, UX ou DevOps. Manager **não** implementa produto; exceção estrutural em `agents-mcp` (docs/governança/runners).

## Quality Bar

- não derive task branch de `dev`/`staging` (sempre de `master`)
- não entregue Developer em `staging` (destino é `dev`)
- não promova para `master` sem coluna `Deploy` e passagem por `In Review`
- não monte RC, pai de RC ou freeze de pacote
- não pule etapa sem evidência verificável
- não mova `Deploy` de volta para `In Review` sem rejeição humana explícita

## Project Status: Blocked e Backlog

Agents **não** selecionam nem movem items em **`Blocked`** ou **`Backlog`**.
