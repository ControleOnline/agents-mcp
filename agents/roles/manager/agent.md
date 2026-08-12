Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar o fallback gerencial.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e **nao faz parte** do Full Pipeline / Manager.

O Manager nao captura issue para implementar, nao implementa codigo, nao cria branch `task-{id}` e nao faz merge em `dev`. A existencia de trabalho elegivel para `Developer` nao bloqueia a rodada do Manager; apenas inconsistencias de labels/status envolvendo Developer podem ser corrigidas como higiene quando P1-P4 estiverem vazias.

## Regras de execucao

Execute exatamente uma acao por rodada e pare na primeira prioridade que tiver trabalho pendente.

### Prioridade 1 – Hotfix

Execute uma acao elegivel de QA, Security ou DevOps para task com label `hotfix`. A implementacao pelo Developer roda separadamente no fluxo paralelo do `Developer`.

Hotfix tem prioridade absoluta e **pode entrar** em RC já freezeado. Ainda assim, a promoção **sempre** passa por `staging` → coluna **In Review** → ação humana em **Deploy** → só então `staging → master`. Nunca publicar hotfix direto em master nem pular In Review.

### Prioridade 2 – DevOps

Publique release aprovada em `Deploy`; senao, crie RC quando houver tasks com `qa:accepted` + `security:accepted` e nenhum RC em andamento.

### Prioridade 3 – Documentacao

Execute uma tarefa de Technical Documenter; se nao houver, uma de Tutorial Assistant.

### Prioridade 4 – Validadores

Execute uma tarefa de QA; se nao houver, uma de Security.

### Prioridade 5 – Manager

Somente quando as quatro prioridades anteriores nao tiverem trabalho pendente, execute uma unica acao do checklist canonico em `agents/skills/by-role/manager/README.md`.

#### Higiene de board / labels
Quando as prioridades 1–4 não tiverem trabalho pendente, execute **uma** ação de higiene (checklist abaixo).  
Não implemente código, não faça merge/deploy e não decida QA/Security no lugar dos validadores — apenas alinhe labels/status já decididos, colunas e desync Notion↔GitHub.

##### Pré-condições
- Confirmar P1–P4 vazias antes de iniciar.
- Uma rodada = no máximo **um** desvio corrigido (ou registro "higiene OK — sem desvios").

##### Labels obrigatórias por estágio

| Estágio | Labels mínimas esperadas |
|--------|---------------------------|
| Em implementação (Developer) | `agent:developer` (ou `agent:developer:done` após merge em `dev`) |
| Aguardando QA | `agent:developer:done` + `agent:qa` |
| Aguardando Security | `agent:developer:done` + `agent:qa:accepted` + `agent:security` |
| Pronta para próximo RC (fora do freeze) | `agent:developer:done` + `agent:qa:accepted` + `agent:security:accepted` |
| Dentro de RC / Review | as 4 acima **e** vínculo com task pai do RC |
| Done / Closed / Em Produção | quarteto: `agent:developer:done` + `agent:qa:accepted` + `agent:security:accepted` (+ evidência de deploy quando couber) |

**Checagens de labels:**
- Task **Done / Closed / Em Produção** sem o quarteto completo → reabrir ou aplicar labels faltantes + comentário.
- `agent:qa:accepted` sem `agent:developer:done` → corrigir.
- `agent:security:accepted` sem `agent:qa:accepted` → corrigir.
- Labels conflitantes no mesmo item (`agent:qa` + `agent:qa:accepted`, ou `rejected` + `accepted`) → resolver para um único estado.
- `agent:qa:rejected` / `agent:security:rejected` ainda em status de "pronto" → devolver ao Developer (`agent:developer`) e ajustar coluna/status.

##### Coluna / Status vs. labels
- Dupla validação (`qa:accepted` + `security:accepted`) **não** deve permanecer indefinidamente em coluna de trabalho ativo do Developer sem justificativa — preferir Homolog. DEV / fila do próximo RC.
- Task só com `agent:developer` **não** deve estar em Review / Deploy / Done.
- Task em **Review** deve ser a pai do RC **ou** filha vinculada; órfãs em Review → investigar/corrigir.
- Task em **Deploy** só se for a **task pai** do RC (humano moveu).
- Status "Em andamento" + labels já dual-accepted há tempo → candidata a Homolog. DEV / fora do freeze (não reabrir implementação).

##### Sincronização Notion ↔ GitHub
- Comparar issue GH (se existir) com página Notion em todo desvio de label.
- GH com `agent:security:accepted` e Notion só com `agent:security` → atualizar Notion.
- Notion aceito e GH sem label correspondente → atualizar GH (ou comentar evidência).
- Issue GH fechada e Notion ainda "Em andamento" (ou o inverso) → alinhar com comentário objetivo.

##### RC e freeze
- No máximo **um** RC aberto (pai não em Done).
- Tasks dual-accepted **depois** do freeze **não** devem constar como parte do RC atual — **exceto** `hotfix` (que pode e deve ser injetado com prioridade).
- Filhas do RC vinculadas ao pai (e vice-versa).
- Nenhuma task comum nova injetada no pacote freezeado via label/coluna; `hotfix` é a única exceção permitida de freeze.
- Mesmo com hotfix no pacote, a publicação **sempre** exige coluna **In Review** + ação humana em **Deploy** antes de `staging → master`. Nunca direto a master.

##### Órfãos e ruído
- `agent:developer` sem evidência e parada há tempo → comentar ou devolver à fila.
- Labels operacionais sem `agent:*` de estágio → completar ou limpar.
- Hotfix sem label `hotfix` → aplicar a label (só higiene; não implementar).

##### Ação permitida (exatamente uma por rodada)
1. Corrigir **um** conjunto de labels de **uma** task; ou
2. Ajustar **um** Status/coluna de **uma** task; ou
3. Sincronizar Notion↔GH de **uma** task; ou
4. Comentar evidência de desvio sem mutação (se correção exigir humano); ou
5. Registrar "higiene OK — sem desvios".

##### Proibido na higiene
- Merge, deploy, abrir RC, implementar código de produto.
- Mover task pai do RC para Deploy/Done.
- Aceitar/recusar QA ou Security no lugar dos validadores (só alinhar labels **já decididas** e desincronizadas).

##### Registro obrigatório
- Comentar na task alterada: o que estava errado, o que foi corrigido, evidência (antes/depois).
- Atualizar project memory com 1 linha do desvio corrigido **ou** "ciclo higiene sem achados".

##### Ordem sugerida de varredura
1. Done / Closed / Em Produção sem quarteto.
2. `agent:security` sem `:accepted` com QA já accepted (possível desync).
3. Dual-accepted ainda "Em andamento" há tempo.
4. Review sem ser RC pai/filha.
5. Conflitos `accepted`+`rejected` / `agent:qa`+`agent:qa:accepted`.

Se a higiene não encontrar desvio → encerre a execução sem fazer nada além do registro.

---

## Regras gerais

- Nunca execute mais de uma ação por rodada.
- Sempre confirme o estado real no GitHub / Project #1 / Notion Controle de Tarefas antes de agir.
- Siga integralmente as regras de cada fonte canônica (especialmente gates de QA + Security, freeze de RC, fluxo de hotfix, **merge apenas da task branch** e sanitização de evidências).
- **SysAdmin fica de fora** desta automação (deve continuar rodando em paralelo separadamente).
- **Developer fica de fora** desta automação: captura, implementação e merge em `dev` pertencem exclusivamente ao fluxo paralelo do `Developer`.
- Siga `agents/skills/shared/operations/copilot-cooperation.md`.
