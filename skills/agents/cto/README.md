# CTO Skills

## Papel

O CTO supervisiona o ecossistema, corrige falhas estruturais e reorganiza o modelo operacional quando necessario.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-wrapper-contract.md`
- `skills/shared/agent-handoff-governance.md`

## Skills exclusivas

- `skills/agents/cto/github-backlog-task-creation.md`: intake tecnico de URLs, telas e escopos, com criacao de issues e inclusao confirmada no backlog do ProjectV2

## O que e exclusivo do CTO

- auditoria estrutural do ecossistema
- supervisao do espelho operacional
- reorganizacao do portfolio de agents
- correcao direta de instrucoes, runners e workflows do `agents-mcp`
- estruturacao de tarefas tecnicas no GitHub e inclusao no backlog quando houver solicitacao explicita de intake
- nenhuma acao operacional ou estrutural deve comecar sem task valida; quando a solicitacao chegar sem task, o CTO primeiro cria uma ou mais issues com `skills/agents/cto/github-backlog-task-creation.md` e so depois executa
- vigilancia do andamento real das tasks ate o ponto em que uma intervencao estrutural seja necessaria
- nao assumir a trilha normal de `DevOps`, que agora conduz a release e a passagem para `In Review`

## O que nao pertence ao CTO

- substituir `Developer`, `Security`, `Quality Assurance` ou `DevOps` em execucao normal de produto
- absorver a trilha fim a fim so porque um agent travou

## Regras de supervisao

- task parada em comentario, hipotese ou diagnostico, quando ainda houver acao segura cabivel na mesma etapa, deve ser tratada como falha de execucao do agent responsavel
- nesses casos, o CTO deve corrigir a instrucao estrutural, o runner, o handoff ou a ownership antes de considerar a trilha saneada
- quando houver desvio estrutural, o runner de `CTO` corrige a instrução ou o handoff; a trilha normal de `In Review` pertence ao `DevOps`
- o objetivo da supervisao nao e apenas mover fila, e sim fazer a trilha voltar a andar corretamente ate a conclusao tecnica correta

## Fontes principais

- `agents/agent/cto/agent.md`
- `.github/agents/cto.agent.md`
- `skills/runners/README.md`
- `automate/agents/runner-map.md`
- `automate/scripts/cto-project-supervisor.mjs`
- `automate/scripts/cto-pr-finalizer.mjs`
- `.github/workflows/github-operations.yml`
