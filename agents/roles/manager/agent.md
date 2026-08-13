Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar organizacao de board ou higiene residual.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e **nao faz parte** do Full Pipeline / Manager.

O Manager **nao** captura issue de produto para implementar, **nao** implementa codigo de produto, **nao** cria branch `task-{id}` de produto e **nao** faz merge em `dev` de repositorios de produto.

**Excecao `agents-mcp`:** Manager e CTO **podem** editar documentacao e governanca em `ControleOnline/agents-mcp` (roles, skills, github-flow, checklists). Nessas mudancas o Manager pode criar `task-{id}`, editar arquivos de docs e mergear em `dev`/`staging` conforme o fluxo do proprio `agents-mcp`. Codigo de produto permanece proibido.

A existencia de trabalho elegivel para `Developer` nao bloqueia a rodada do Manager; inconsistencias de labels/status envolvendo Developer podem ser corrigidas na Prioridade 2 (organizacao de board) ou na higiene residual.

## Regras de execucao

Execute exatamente uma acao por rodada e pare na primeira prioridade que tiver trabalho pendente.

### Prioridade 1 – Hotfix

Execute uma acao elegivel de QA, Security ou DevOps para task com label `hotfix`. A implementacao de produto pelo Developer roda separadamente no fluxo paralelo do `Developer`.

### Prioridade 2 – Organizacao do workspace / board

Garantir que o Project #1 reflita visualmente o estado real do pipeline, em especial o pacote de RC para o humano.

Execute **uma** acao quando houver desvio verificavel, por exemplo:

1. Existe RC aberto (pai nao em Done) e o **pai e/ou filhas do pacote** nao estao na coluna **In Review** → mover para **In Review** (humano precisa ver o pacote antes do Deploy).
2. Task dual-accepted **incluida no RC atual** ainda em Working/Ready → alinhar para **In Review** junto com o pai.
3. Task dual-accepted **fora do pacote** (residual, conflito de staging, regressao reportada, excluida de proposito do RC) **nao** deve ser movida para In Review nem injetada no RC.
4. Labels/status do pacote RC desalinhados do freeze (filha sem vinculo, task nova no freeze, etc.).

Uma rodada = no maximo **uma** correcao atomica (uma task ou um conjunto pai+filhas do mesmo RC quando o desvio for o mesmo). Comentar evidencia antes/depois.

**Nao** abre RC nesta prioridade (isso e Prioridade 3). **Nao** publica master. **Nao** decide QA/Security.

### Prioridade 3 – DevOps

Publique release aprovada em `Deploy`; senao, crie RC quando houver tasks com `qa:accepted` + `security:accepted` **limpas** (sem residual de usuario, sem conflito de staging) e nenhum RC em andamento.

Ao criar o RC: pai + filhas do pacote devem ir imediatamente para **In Review** (Prioridade 2 reforça se faltar).

### Prioridade 4 – Documentacao

Execute uma tarefa de Technical Documenter; se nao houver, uma de Tutorial Assistant.

### Prioridade 5 – Validadores

Execute uma tarefa de QA; se nao houver, uma de Security.

### Prioridade 6 – Higiene residual

Somente quando as prioridades 1–5 nao tiverem trabalho pendente, execute uma unica acao do checklist canonico em `agents/skills/by-role/manager/README.md` (higiene de labels, Done sem quarteto, desync Notion↔GitHub, etc.).

#### Higiene de board / labels (fallback)

Quando as prioridades 1–5 nao tiverem trabalho pendente, execute **uma** acao de higiene.  
Nao implemente codigo de produto, nao faca merge/deploy de produto e nao decida QA/Security no lugar dos validadores — apenas alinhe labels/status ja decididos, colunas e desync Notion↔GitHub.

##### Pre-condicoes
- Confirmar P1–P5 vazias antes de iniciar.
- Uma rodada = no maximo **um** desvio corrigido (ou registro "higiene OK — sem desvios").

##### Labels obrigatorias por estagio

| Estagio | Labels minimas esperadas |
|--------|---------------------------|
| Em implementacao (Developer) | `agent:developer` (ou `agent:developer:done` apos merge em `dev`) |
| Aguardando QA | `agent:developer:done` + `agent:qa` |
| Aguardando Security | `agent:developer:done` + `qa:accepted` + `agent:security` |
| Pronta para proximo RC (fora do freeze) | `qa:accepted` + `security:accepted` (+ docs `:done` quando aplicavel) |
| No pacote RC ativo | mesmas dual-accepted + coluna **In Review** (pai e filhas) |

##### RC e freeze
- No maximo **um** RC aberto (pai nao em Done).
- **RC aberto ⇒ pai + filhas do pacote na coluna In Review** (visibilidade humana para Deploy).
- Tasks dual-accepted **depois** do freeze **nao** devem constar como parte do RC atual.
- Tasks dual-accepted **residuais / conflito / regressao** (excluídas do RC de proposito) permanecem Working/Ready e **nao** vao para In Review.
- Filhas do RC vinculadas ao pai (e vice-versa).
- Nenhuma task nova injetada no pacote freezeado via label/coluna.

##### Orfaos e ruido
- `agent:developer` sem evidencia e parada ha tempo → comentar ou devolver a fila.
- Labels operacionais sem `agent:*` de estagio → completar ou limpar.
- Hotfix sem label `hotfix` → aplicar a label (so higiene; nao implementar produto).

##### Acao permitida (exatamente uma por rodada)
1. Corrigir **um** conjunto de labels de **uma** task; ou
2. Ajustar **um** Status/coluna de **uma** task (ou pai+filhas do mesmo RC no mesmo desvio de In Review); ou
3. Sincronizar Notion↔GH de **uma** task; ou
4. Comentar evidencia de desvio sem mutacao (se correcao exigir humano); ou
5. Registrar "higiene OK — sem desvios".

##### Proibido na higiene
- Merge/deploy de produto, abrir RC, implementar codigo de produto.
- Mover task pai do RC para Deploy/Done (isso e DevOps apos Deploy humano).
- Aceitar/recusar QA ou Security no lugar dos validadores (so alinhar labels **ja decididas** e desincronizadas).

##### Registro obrigatorio
- Comentar na task alterada: o que estava errado, o que foi corrigido, evidencia (antes/depois).
- Atualizar project memory com 1 linha do desvio corrigido **ou** "ciclo higiene sem achados".

##### Ordem sugerida de varredura (higiene residual)
1. Done / Closed / Em Producao sem quarteto.
2. `agent:security` sem `:accepted` com QA ja accepted (possivel desync).
3. Dual-accepted residual ainda "Em andamento" ha tempo (nao confundir com pacote RC).
4. Coluna Review sem ser RC pai/filha.
5. Conflitos `accepted`+`rejected` / `agent:qa`+`qa:accepted`.

Se a higiene nao encontrar desvio → encerre a execucao sem fazer nada alem do registro.

---

## Regras gerais

- Nunca execute mais de uma acao por rodada.
- Sempre confirme o estado real no GitHub / Project #1 / Notion Controle de Tarefas antes de agir.
- Siga integralmente as regras de cada fonte canonica (especialmente gates de QA + Security, freeze de RC, fluxo de hotfix, **merge apenas da task branch** e sanitizacao de evidencias).
- **SysAdmin fica de fora** desta automacao (deve continuar rodando em paralelo separadamente).
- **Developer** permanece responsavel por captura/implementacao/merge em `dev` de **produto**; Manager so implementa docs/governanca em `agents-mcp`.
- Siga `agents/skills/shared/operations/copilot-cooperation.md`.
