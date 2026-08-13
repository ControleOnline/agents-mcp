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

- **Nunca** faça merge de `dev` inteiro em `staging`. Merge sempre **apenas** `task-{id}`.
- O único merge de ambiente completo é `staging` (RC) → `master`.


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
3. Consolidar as mudancas aprovadas no branch **`staging`** fazendo merge **somente de cada `task-{id}`** aprovada (nunca merge de `dev` inteiro). Pule consolidacao ja presente com evidencia + comentario.
4. Fazer isso nos **repositorios pai e nos submodulos** afetados (ordem: submodulos primeiro, depois pai; pins/gitlinks coerentes).
5. O push/atualizacao de `staging` **dispara o deploy** do ambiente de staging para **conferencia humana**.

### Task pai de deploy + subtasks

1. Criar **uma nova task pai** de deploy/RC (titulo com versao semver, ex.: `RC vX.Y.Z`).
2. Associar ao [Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1).
3. Colocar as tasks do pacote como **filhos/subtasks** da task pai (e/ou links bidirecionais claros issue pai ↔ filhas).
4. Mover a **task pai e as filhas** para a coluna **`In Review`**.

   Se o pacote ficar fora de `In Review` (pai/filhas ainda em Working/Ready), a **Prioridade 2 do Manager** (organizacao do board) corrige na proxima rodada — o humano precisa ver o pacote visualmente antes do Deploy. Dual-accepted **fora** do pacote (residual/conflito/regressao) **nao** vao para `In Review`.
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
- **Sempre** aplicar a label `hotfix` ao criar uma task pedida como hotfix.
- Pode coexistir com `bug` / `enhancement`.
- Developer, QA, Security e DevOps devem tratar issues com `hotfix` como **prioridade 1**. O Manager trata como prioridade 1 somente as ações elegíveis de QA, Security ou DevOps; implementação continua exclusiva do Developer.

### Fluxo acelerado

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ merge task-{id} → dev        (Developer; SEM PR) — prioridade máxima
            └─ QA + Security           (labels; prioridade máxima)
                 └─ DevOps promove
                      └─ merge **somente** task-{id} → staging
                           (NUNCA merge de `dev` inteiro em staging)
                            └─ task/pai → coluna **In Review** (conferência humana no staging)
                                 └─ humano move para **Deploy**
                                      └─ DevOps merge staging → master → Done
```

**Obrigatório:** mesmo em hotfix, o delta **não** vai direto para `master`. Após promoção a `staging`, a task (ou o RC de item único) **deve** passar pela coluna **In Review** para conferência humana no ambiente de staging. Só após o humano mover para **Deploy** o DevOps promove a `master`.

### Regra crítica de merge (hotfix e fluxo normal)

- **Sempre** faça merge **apenas da branch `task-{id}`** para o destino (`dev` ou, no caminho de promoção prioritária, `staging`).
- **Nunca** faça merge de um ambiente inteiro (`dev` → `staging`).
- O **único** merge de ambiente completo permitido é o **RC em `staging` → `master`** (após coluna Deploy).
- `dev` pode conter tarefas ainda quebradas / incompletas e **não pode** ir para `staging`.
- `staging` deve permanecer **estável** (somente deltas de tasks já aprovadas e selecionadas no pacote ou no hotfix prioritário).

### Regras

1. **Developer**: captura e implementa hotfix antes de qualquer outra issue; branch `task-{id}` a partir de `master`; merge **somente** `task-{id}` → `dev`; handoff imediato `agent:qa` + `agent:security`.
2. **QA / Security**: revisam hotfixes antes de qualquer outra fila; registram `qa:accepted`/`security:accepted` (ou rejected) com prioridade.
3. **DevOps**:
   - Com `hotfix` + `qa:accepted` + `security:accepted`, promove com prioridade:
     - merge **somente** `task-{id}` → `staging` (nunca `dev` inteiro);
     - ou monta RC de item único (semver patch) a partir desse delta;
     - move a task (ou o pai do RC de hotfix) para a coluna **In Review** (nunca pula In Review);
   - **Proibido** promover hotfix direto de `staging`/`dev` para `master` sem a coluna **Deploy** (aprovação humana).
   - Após humano em coluna `Deploy`, merge `staging` → `master` e `Done`.
4. **Manager**: prioridade 1 = executar somente ação elegível de **QA, Security ou DevOps** relacionada a issue com label `hotfix`. O Manager nunca captura a issue para implementar, nunca cria `task-{id}`, não altera código como Developer e não faz merge `task-{id}` → `dev`.
5. Não se abre segundo RC paralelo só por causa de hotfix; se já existir RC aberto, o DevOps pode incluir o delta da `task-{id}` no pacote atual **apenas se ainda não estiver freezeado**, ou documentar RC paralelo excepcional de hotfix com comentário na issue pai.
6. Após publicação, o hotfix deve permanecer refletido em `dev` e `master` para não regredir.

### Quality bar de hotfix

- Mudança mínima e focada no problema crítico.
- Testes/smoke do escopo afetado (mesmo sob urgência).
- Evidência clara na issue (commits da `task-{id}`, merge em `dev`, labels).
- Não usar `hotfix` para feature ou melhoria não urgente.

## Quality Bar

- nao derive task branch de `dev`/`staging` (sempre de `master`)
- nao entregue Developer em `staging` (destino e `dev`)
- nao promova para `master` sem task pai (ou task de hotfix) em coluna `Deploy` e passagem prévia por **In Review** (hotfix também não pula In Review)
- nao promova hotfix direto para `master` sem conferência humana em staging
- nao abra segundo RC em paralelo
- nao refaca merge/passo ja concluido sem necessidade; documente o pulo com comentario
- nao pule etapa sem evidencia verificavel no GitHub
- nao feche issue; `closed`/Done operacional segue o board e humanos conforme governanca
