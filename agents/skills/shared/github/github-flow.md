# GitHub Flow

## Overview

Fonte canonica do fluxo de branches e entrega tecnica do ecossistema ControleOnline.

## Branches

| Branch | Papel |
| --- | --- |
| `master` | Linha principal / producao |
| `dev` | Integracao continua das tasks do Developer (apos implementacao) |
| `staging` | **Somente** o pacote RC do DevOps (versionamento semântico); dispara deploy para conferencia humana |
| `task-{id_issue}` | Branch de trabalho do Developer |

## Fluxo ponta a ponta

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ merge em dev                 (Developer; SEM PR)
            └─ dev                     (integracao continua das tasks)
                 └─ QA + Security      (labels na task; sem PR)
                      └─ DevOps empacota RC (semver)
                           └─ staging  (pai + submodulos; dispara deploy staging)
                                └─ task pai Deploy + subtasks  → coluna In Review
                                     └─ humano aprova → coluna Deploy
                                          └─ DevOps merge staging → master → coluna Done
```

## Etapas ja concluidas (pular com justificativa)

Se o estado real do GitHub mostrar que o passo da etapa **ja foi feito** (por qualquer motivo — merge manual, reexecucao, trabalho previo, hotfix operacional), o agent **nao precisa refazer** o passo. Deve:

1. **Confirmar** a evidencia no Git (commits, merge-base, branch atualizada, labels, coluna).
2. **Pular** apenas o que ja estiver concluido.
3. **Avancar** a task para o **proximo estagio** do fluxo (labels `agent:*`, handoff, coluna quando couber ao papel).
4. **Comentar na issue** com justificativa objetiva: o que ja estava feito, como foi verificado, e qual estagio passa a valer.

Exemplos:

- `task-{id}` ja mergeada em `dev` → Developer nao re-mergeia; aplica `agent:qa` + `agent:security` e comenta a justificativa.
- Conteudo do RC ja esta em `staging` nos repos do pacote → DevOps nao reconstrói o mesmo delta; segue task pai / coluna `In Review` (ou o proximo passo faltante) com comentario.
- `staging` ja esta em `master` para o RC da task pai em `Deploy` → DevOps nao re-mergeia; move para `Done` com comentario da evidencia.

**Nao** pule etapas por intuicao ou titulo da issue. So com evidencia verificavel. **Nao** use o atalho para omitir QA/Security quando a entrega ainda nao foi revisada por labels.

## Developer

1. Captura issue elegivel.
2. Cria ou reutiliza `task-{id_issue}` **a partir de `master`** atualizado.
3. Implementa e valida na branch da tarefa.
4. Sincroniza com `origin/master` antes de continuar/encerrar.
5. **Faz merge de `task-{id_issue}` em `dev`** (sem abrir PR) — ou **pula** se ja estiver mergeada (com comentario de justificativa).
6. Registra evidencia na issue e handoff por labels (`agent:qa` e `agent:security`).

### Proibicoes do Developer

- **Nao** abre PR no fluxo normal.
- **Nao** mergeia em `staging` nem em `master`.
- **Nao** commit/push direto em `master`, `main`, `dev`, `staging`.
- Trabalho so na `task-{id_issue}`; chegada em `dev` e por **merge** da task branch.

### Entrega = merge em `dev`

- Origem: apenas `task-{id_issue}`.
- Destino: `dev`.
- Operacao: merge (nao PR, nao commits soltos em `dev`).
- Rastreabilidade: issue ↔ branch ↔ commits ↔ `dev`.

## Revisao (QA e Security)

- Atuam sobre a task/issue e a evidencia da entrega (commits na task branch e o que foi mergeado em **`dev`**).
- Registram `qa:accepted` / `qa:rejected` e `security:accepted` / `security:rejected`.
- **Nao** abrem PR; **nao** finalizam task; **nao** mexem em branches de integracao.
- Recusa devolve prioridade ao Developer na mesma `task-{id_issue}` (corrigir e re-mergear em `dev`).

## DevOps — Release Candidate (RC)

### Entrada

- Todas as issues **open** (ou elegiveis) que tenham **ao mesmo tempo** `qa:accepted` **e** `security:accepted`.
- Essas tasks ainda **nao** estao vinculadas a um RC aberto.

### Regras de exclusividade do RC

- **Nao** se cria um novo RC enquanto existir um RC aberto (task pai de deploy ainda nao publicada / nao em `Done`).
- **Nenhuma** task nova entra no RC ja aberto depois que ele foi criado (freeze do pacote).
- Tasks aprovadas depois do freeze aguardam o **proximo** RC.

### Montagem do pacote

1. Coletar **todas** as tasks elegiveis no momento da abertura do RC.
2. Definir **versionamento semantico** do pacote (ex.: `vX.Y.Z` / tag RC coerente com o monorepo/repos).
3. Consolidar as mudancas aprovadas (vindas de `dev` / commits das tasks) no branch **`staging`** — pule consolidacao ja presente com evidencia + comentario.
4. Fazer isso nos **repositorios pai e nos submodulos** afetados (ordem: submodulos primeiro, depois pai; pins/gitlinks coerentes).
5. O push/atualizacao de `staging` **dispara o deploy** do ambiente de staging para **conferencia humana**.

### Task pai de deploy + subtasks

1. Criar **uma nova task pai** de deploy/RC (titulo com versao semver, ex.: `RC vX.Y.Z`).
2. Associar ao [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1).
3. Colocar as tasks do pacote como **filhos/subtasks** da task pai (e/ou links bidirecionais claros issue pai ↔ filhas).
4. Mover a **task pai e as filhas** para a coluna **`In Review`**.
5. Label operacional tipica na pai: `agent:devops` (ou manter ownership de deploy no board).

### Aprovacao humana e publicacao

1. Humano confere o ambiente de staging.
2. Quando aprovar o pacote, move a task pai para a coluna **`Deploy`**.
3. Em `Deploy`, o DevOps:
   - **mescla o pacote (`staging`) em `master`** (pai + submodulos na ordem correta) — ou confirma que ja esta em `master` e avanca;
   - confirma push remoto e tags/versao quando aplicavel;
   - move a task pai (e filhas, conforme governanca do board) para a coluna **`Done`**;
   - se pulou merge por ja estar feito, **comente a justificativa** na task pai.

Detalhes de publicacao: `agents/skills/shared/github/master-publication.md`.

### O que o DevOps nao faz

- Nao implementa feature de produto no lugar do Developer.
- Nao abre RC novo com RC ainda aberto.
- Nao inclui task sem o par `qa:accepted` + `security:accepted`.
- Nao injeta tasks novas no RC ja freezeado.

## Quem pode o que

| Acao | Developer | QA | Security | DevOps |
|------|-----------|----|----------|--------|
| Branch `task-{id}` a partir de `master` | sim | nao | nao | so excecao |
| Merge `task-{id}` → `dev` | sim | nao | nao | so se conflito/desvio |
| Merge em `staging` (pacote RC) | **nao** | **nao** | **nao** | **sim** |
| Abrir PR de produto / task | **nao** | **nao** | **nao** | **nao** (salvo excecao documentada) |
| Labels `qa:*` / `security:*` | nao | sim | sim | nao |
| Criar task pai RC + subtasks | nao | nao | nao | **sim** |
| Merge `staging` → `master` | **nao** | **nao** | **nao** | **sim** (apos coluna Deploy) |
| Deploy / publicacao | nao | nao | nao | sim |
| Pular passo ja evidenciado + comentar | sim | sim* | sim* | sim |

\*QA/Security podem reconhecer merge ja feito em `dev` como evidencia, mas **nao** pulam a propria decisao de aceite/recusa sem analisar.

## Relacao com outras skills

- publicacao em master: `agents/skills/shared/github/master-publication.md`
- ownership e handoff: `agents/skills/shared/operations/agent-handoff-governance.md`
- criterios de conclusao: `agents/skills/shared/quality/task-completion-criteria.md`
- board / Project #1: `agents/skills/shared/operations/issue-queue-discovery.md`


## Hotfix (prioridade absoluta)

Hotfixes são correções urgentes em produção (ou risco crítico iminente) que **não esperam** o ciclo normal de RC.

### Identificação

- Label obrigatória: `hotfix` (criar no repositório se ausente).
- Pode coexistir com `bug` / `enhancement`.
- Qualquer agent (Manager, Developer, QA, Security, DevOps) deve tratar issues com `hotfix` como **prioridade 1**.

### Fluxo acelerado

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ merge em dev                 (Developer; SEM PR) — prioridade máxima
            └─ QA + Security           (labels; prioridade máxima; mesma passagem se possível)
                 └─ DevOps promove     (pode montar RC de item único ou promover direto
                                        o delta do hotfix para staging → Deploy → master
                                        sem esperar freeze de outras tasks, desde que
                                        qa:accepted + security:accepted existam)
```

### Regras

1. **Developer**: captura e implementa hotfix antes de qualquer outra issue; branch `task-{id}` a partir de `master`; merge em `dev`; handoff imediato `agent:qa` + `agent:security`.
2. **QA / Security**: revisam hotfixes antes de qualquer outra fila; registram `qa:accepted`/`security:accepted` (ou rejected) com prioridade.
3. **DevOps**:
   - Com `hotfix` + `qa:accepted` + `security:accepted`, pode:
     - montar RC de **um único item** (semver patch) e colocar em `staging`, **ou**
     - promover o delta já mergeado em `dev` para `staging` de forma prioritária (sem aguardar outras tasks do freeze).
   - Após humano em coluna `Deploy`, merge `staging` → `master` e `Done` com prioridade.
4. **Manager**: prioridade 1 = qualquer ação relacionada a issue com label `hotfix`.
5. Não se abre segundo RC paralelo só por causa de hotfix; se já existir RC aberto, o DevOps pode incluir o hotfix no pacote atual **apenas se ainda não estiver freezeado** ou documentar RC paralelo excepcional de hotfix com comentário na issue pai.
6. Após publicação, o hotfix deve ser mergeado de volta / refletido em `dev` e `master` para não regredir.

### Quality bar de hotfix

- Mudança mínima e focada no problema crítico.
- Testes/smoke do escopo afetado (mesmo sob urgência).
- Evidência clara na issue (commits, merge em `dev`, labels).
- Não usar `hotfix` para feature ou melhoria não urgente.

## Quality Bar

- nao derive task branch de `dev`/`staging` (sempre de `master`)
- nao entregue Developer em `staging` (destino e `dev`)
- nao promova para `master` sem task pai em coluna `Deploy` e RC freezeado
- nao abra segundo RC em paralelo
- nao refaca merge/passo ja concluido sem necessidade; documente o pulo com comentario
- nao pule etapa sem evidencia verificavel no GitHub
- nao feche issue; `closed`/Done operacional segue o board e humanos conforme governanca
