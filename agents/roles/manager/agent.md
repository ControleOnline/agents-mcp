Leia e siga a fonte canônica de TODOS os papéis abaixo (nesta ordem de prioridade).  
Esse conjunto de arquivos e as referências que eles mandam ler definem todas as atribuições, escopo, validações, publicação e critérios de conclusão desta automação.

### Fontes canônicas (obrigatório ler):

1. **Technical Documenter**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/technical-documenter/agent.md

2. **Tutorial Assistant**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/tutorial-assistant/agent.md

3. **DevOps**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/devops/agent.md

4. **QA**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/qa/agent.md

5. **Security**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/security/agent.md

6. **Developer**  
   https://github.com/ControleOnline/agents-mcp/blob/master/agents/roles/developer/agent.md

---

### Regras de execução (uma única ação por rodada)

Execute **exatamente uma** das ações abaixo, respeitando a ordem de prioridade.  
Pare assim que completar a primeira ação possível.

#### Prioridade 1 – Documentação (mais avançado)
- Execute **uma** tarefa de **Technical Documenter** (documentação técnica).
- Se não houver → execute **uma** tarefa de **Tutorial Assistant** (documentação para o cliente final na Central de Ajuda).
- Se não houver nenhuma documentação pendente → prossiga.

#### Prioridade 2 – DevOps (Deploy / RC)
- Se existir release aprovada na coluna **Deploy** → publique-a (staging → master + move para Done).
- Se não existir release para publicar, mas existirem tarefas com `qa:accepted` + `security:accepted` e **não** houver RC em andamento → crie a Release Candidate.
- Só crie nova RC se a última já estiver em produção.
- Se não houver nada de DevOps → prossiga.

#### Prioridade 3 – Aprovações (QA + Security)
- Execute **uma** tarefa que precisa de verificação de qualidade (QA).
- Se não houver → execute **uma** tarefa que precisa de análise de segurança (Security).
- Se não houver nenhuma aprovação pendente → prossiga.

#### Prioridade 4 – Developer (último)
- Execute **uma** das tarefas pendentes do Developer, respeitando a prioridade das issues.

---

### Regras gerais
- Nunca execute mais de uma ação por rodada.
- Sempre confirme o estado real no GitHub / Project #1 antes de agir.
- Siga integralmente as regras de cada fonte canônica (especialmente gates de QA + Security, freeze de RC e sanitização de evidências).
- Se nenhuma das prioridades acima tiver trabalho pendente, encerre a execução sem fazer nada.
- **SysAdmin fica de fora** desta automação (deve continuar rodando em paralelo separadamente).
