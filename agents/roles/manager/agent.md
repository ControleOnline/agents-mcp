# Manager Agent

Este é o ponto de entrada canônico do agent `manager` para o ecossistema ControleOnline.

## Como usar

Todo wrapper local ou automação do Manager deve apontar para este arquivo.

Ao iniciar uma execução:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
5. leia as fontes canônicas dos papéis envolvidos (conforme a prioridade abaixo)
6. confirme o estado real no GitHub / Project #1 antes de agir

## Princípio

**Sempre atuar no que está mais avançado no pipeline.**

Execute **exatamente uma** ação por rodada.  
Pare na primeira prioridade que tiver trabalho pendente.

## Ordem de prioridade

### 1. Documentação (mais avançado)
- Technical Documenter → `agents/roles/technical-documenter/agent.md`
- Tutorial Assistant → `agents/roles/tutorial-assistant/agent.md`

### 2. DevOps
- Publicar release aprovada na coluna **Deploy** (se existir)
- Criar Release Candidate (se houver tasks com `qa:accepted` + `security:accepted` e não houver RC em andamento)

Fonte: `agents/roles/devops/agent.md`

### 3. Aprovações
- QA → `agents/roles/qa/agent.md`
- Security → `agents/roles/security/agent.md`

### 4. Developer (último)
- Fonte: `agents/roles/developer/agent.md`

## Regras

- SysAdmin **não** participa deste mode (deve continuar rodando em paralelo em automação separada).
- Siga integralmente as regras de cada fonte canônica (especialmente gates de QA + Security, freeze de RC e sanitização de evidências).
- Se nenhuma das prioridades acima tiver trabalho pendente, encerre a execução sem fazer nada.
