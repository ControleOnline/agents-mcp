Leia e siga a fonte canônica de TODOS os papéis abaixo (nesta ordem de prioridade).  
Esse conjunto de arquivos e as referências que eles mandam ler definem todas as atribuições, escopo, validações, publicação e critérios de conclusão desta automação.

### Fontes canônicas (obrigatório ler):

1. **DevOps**  
   /agents-mcp/blob/master/agents/roles/devops/agent.md

2. **QA**  
   /agents-mcp/blob/master/agents/roles/qa/agent.md

3. **Security**  
   /agents-mcp/blob/master/agents/roles/security/agent.md

4. **Developer**  
   /agents-mcp/blob/master/agents/roles/developer/agent.md

5. **Technical Documenter**  
   /agents-mcp/blob/master/agents/roles/technical-documenter/agent.md

6. **Tutorial Assistant**  
   /agents-mcp/blob/master/agents/roles/tutorial-assistant/agent.md

---

### Regras de execução (uma única ação por rodada)

Execute **exatamente uma** das ações abaixo, respeitando a ordem de prioridade.  
Pare assim que completar a primeira ação possível.

#### Prioridade 1 – Hotfix
- Se existir qualquer issue/task com label `hotfix` elegível (aberta, pendente de implementação, validação QA/Security, deploy ou promoção a produção) → execute **uma** ação do papel correspondente (Developer, QA, Security ou DevOps) para essa hotfix.
- Hotfixes têm prioridade absoluta: implementar, validar (QA + Security), montar/promover e publicar em produção o mais rápido possível.
- Label `hotfix` é **obrigatória** em toda task criada como hotfix (sempre aplicar ao criar a issue).
- Fluxo completo de hotfix: ver `agents/skills/shared/github/github-flow.md` (seção Hotfix).
- Se não houver hotfix pendente → prossiga.

#### Prioridade 2 – DevOps (Deploy / RC)
- Se existir release aprovada na coluna **Deploy** → publique-a (staging → master + move para Done).
- Se não existir release para publicar, mas existirem tarefas com `qa:accepted` + `security:accepted` e **não** houver RC em andamento → crie a Release Candidate.
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

#### Prioridade 5 – Developer
- Execute **uma** das tarefas pendentes do Developer, respeitando a prioridade das issues (bug → recusas → enhancement → feature; hotfixes já tratados na prioridade 1).

---

### Regras gerais
- Nunca execute mais de uma ação por rodada.
- Sempre confirme o estado real no GitHub / Project #1 antes de agir.
- Siga integralmente as regras de cada fonte canônica (especialmente gates de QA + Security, freeze de RC, fluxo de hotfix, **merge apenas da task branch** e sanitização de evidências).
- Se nenhuma das prioridades acima tiver trabalho pendente, encerre a execução sem fazer nada.
- **SysAdmin fica de fora** desta automação (deve continuar rodando em paralelo separadamente).


## Copilot Cooperation

**Obrigatorio:** todo agent deve estender `agents/skills/shared/operations/copilot-cooperation.md`.
