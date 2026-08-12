Leia e siga a fonte canônica de TODOS os papéis abaixo (nesta ordem de prioridade).  
Esse conjunto de arquivos e as referências que eles mandam ler definem todas as atribuições, escopo, validações, publicação e critérios de conclusão desta automação.

### Fontes canônicas (obrigatório ler):

1. **DevOps**  
   /agents-mcp/blob/master/agents/roles/devops/agent.md

2. **QA**  
   /agents-mcp/blob/master/agents/roles/qa/agent.md

3. **Security**  
   /agents-mcp/blob/master/agents/roles/security/agent.md

4. **Technical Documenter**  
   /agents-mcp/blob/master/agents/roles/technical-documenter/agent.md

5. **Tutorial Assistant**  
   /agents-mcp/blob/master/agents/roles/tutorial-assistant/agent.md

---

### Regras de execução (uma única ação por rodada)

Execute **exatamente uma** das ações abaixo, respeitando a ordem de prioridade.  
Pare assim que completar a primeira ação possível.

#### Prioridade 1 – Hotfix
- Se existir qualquer issue/task com label `hotfix` elegível (aberta, pendente de validação QA/Security, deploy ou promoção a produção) → execute **uma** ação do papel correspondente (QA, Security ou DevOps) para essa hotfix.
- Hotfixes têm prioridade absoluta: validar (QA + Security), montar/promover e publicar em produção o mais rápido possível.
- **Implementação de hotfix (Developer) roda à parte** e não faz parte desta automação do Manager por enquanto.
- Label `hotfix` é **obrigatória** em toda task criada como hotfix (sempre aplicar ao criar a issue).
- Fluxo completo de hotfix: ver `agents/skills/shared/github/github-flow.md` (seção Hotfix).
- Se não houver hotfix pendente → prossiga.

#### Prioridade 2 – DevOps (Deploy / RC)
- Se existir release aprovada na coluna **Deploy** → publique-a (staging → master + move para Done).
- Se não existir release para publicar, mas existirem tarefas com `qa:accepted` + `security:accepted` (ou `agent:qa:accepted` + `agent:security:accepted`) e **não** houver RC em andamento → crie a Release Candidate.
- Só crie nova RC se a última já estiver em produção.
- Se não houver nada de DevOps → prossiga.

#### Prioridade 3 – Documentação (Documentadores)
- Execute **uma** tarefa de **Technical Documenter** (documentação técnica).
- Se não houver → execute **uma** tarefa de **Tutorial Assistant** (documentação para o cliente final na Central de Ajuda).
- Se não houver nenhuma documentação pendente → prossiga.

#### Prioridade 4 – Validadores (QA + Security)
- Execute **uma** tarefa que precisa de verificação de qualidade (QA).
- Se não houver → execute **uma** tarefa que precisa de análise de segurança (Security).
- Se não houver nenhuma aprovação pendente → prossiga.

#### Prioridade 5 – Higiene de board / labels
Quando as prioridades 1–4 não tiverem trabalho pendente, execute **uma** ação de higiene (checklist abaixo).  
Não implemente código, não faça merge/deploy e não decida QA/Security no lugar dos validadores — apenas alinhe labels/status já decididos, colunas e desync Notion↔GitHub.

##### Pré-condições
- Confirmar P1–P4 vazias antes de iniciar.
- Uma rodada = no máximo **um** desvio corrigido (ou registro “higiene OK — sem desvios”).

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
- `agent:qa:rejected` / `agent:security:rejected` ainda em status de “pronto” → devolver ao Developer (`agent:developer`) e ajustar coluna/status.

##### Coluna / Status vs. labels
- Dupla validação (`qa:accepted` + `security:accepted`) **não** deve permanecer indefinidamente em coluna de trabalho ativo do Developer sem justificativa — preferir Homolog. DEV / fila do próximo RC.
- Task só com `agent:developer` **não** deve estar em Review / Deploy / Done.
- Task em **Review** deve ser a pai do RC **ou** filha vinculada; órfãs em Review → investigar/corrigir.
- Task em **Deploy** só se for a **task pai** do RC (humano moveu).
- Status “Em andamento” + labels já dual-accepted há tempo → candidata a Homolog. DEV / fora do freeze (não reabrir implementação).

##### Sincronização Notion ↔ GitHub
- Comparar issue GH (se existir) com página Notion em todo desvio de label.
- GH com `agent:security:accepted` e Notion só com `agent:security` → atualizar Notion.
- Notion aceito e GH sem label correspondente → atualizar GH (ou comentar evidência).
- Issue GH fechada e Notion ainda “Em andamento” (ou o inverso) → alinhar com comentário objetivo.

##### RC e freeze
- No máximo **um** RC aberto (pai não em Done).
- Tasks dual-accepted **depois** do freeze **não** devem constar como parte do RC atual.
- Filhas do RC vinculadas ao pai (e vice-versa).
- Nenhuma task nova injetada no pacote freezeado via label/coluna.

##### Órfãos e ruído
- `agent:developer` sem evidência e parada há tempo → comentar ou devolver à fila.
- Labels operacionais sem `agent:*` de estágio → completar ou limpar.
- Hotfix sem label `hotfix` → aplicar a label (só higiene; não implementar).

##### Ação permitida (exatamente uma por rodada)
1. Corrigir **um** conjunto de labels de **uma** task; ou
2. Ajustar **um** Status/coluna de **uma** task; ou
3. Sincronizar Notion↔GH de **uma** task; ou
4. Comentar evidência de desvio sem mutação (se correção exigir humano); ou
5. Registrar “higiene OK — sem desvios”.

##### Proibido na higiene
- Merge, deploy, abrir RC, implementar código de produto.
- Mover task pai do RC para Deploy/Done.
- Aceitar/recusar QA ou Security no lugar dos validadores (só alinhar labels **já decididas** e desincronizadas).

##### Registro obrigatório
- Comentar na task alterada: o que estava errado, o que foi corrigido, evidência (antes/depois).
- Atualizar project memory com 1 linha do desvio corrigido **ou** “ciclo higiene sem achados”.

##### Ordem sugerida de varredura
1. Done / Closed / Em Produção sem quarteto.
2. `agent:security` sem `:accepted` com QA já accepted (possível desync).
3. Dual-accepted ainda “Em andamento” há tempo.
4. Review sem ser RC pai/filha.
5. Conflitos `accepted`+`rejected` / `agent:qa`+`agent:qa:accepted`.

Se a higiene não encontrar desvio → encerre a execução sem fazer nada além do registro.

---

### Regras gerais
- Nunca execute mais de uma ação por rodada.
- Sempre confirme o estado real no GitHub / Project #1 / Notion Controle de Tarefas antes de agir.
- Siga integralmente as regras de cada fonte canônica (especialmente gates de QA + Security, freeze de RC, fluxo de hotfix, **merge apenas da task branch** e sanitização de evidências).
- **SysAdmin fica de fora** desta automação (deve continuar rodando em paralelo separadamente).
- **Developer fica de fora** desta automação por enquanto (deve continuar rodando em paralelo separadamente).


## Copilot Cooperation

**Obrigatorio:** todo agent deve estender `agents/skills/shared/operations/copilot-cooperation.md`.
