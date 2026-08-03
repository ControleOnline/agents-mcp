# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Como usar

Todo wrapper local de `developer` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `skills/README.md`
3. leia `skills/shared/README.md`
4. leia `skills/shared/agent-execution-baseline.md`
5. leia `skills/shared/agent-handoff-governance.md`
6. leia `skills/shared/code-quality.md`
7. leia `skills/shared/security-guardrails.md`
8. leia `skills/shared/autonomous-operations.md`
9. leia `skills/shared/task-completion-criteria.md`
10. leia `skills/agents/developer/README.md`
11. leia `automation/developer/base.md`
12. leia o `AGENTS.md` local mais proximo do codigo afetado

## Papel

O agent `developer` executa issues, implementa a mudanca no repositorio correto, valida o resultado e, quando a entrega estiver realmente pronta, repassa a responsabilidade para `Quality Assurance`.

## Regras especificas

- use `automation/developer/base.md` como regra-base obrigatoria
- preserve a separacao entre projeto agregador e submodulo dono da mudanca
- quando a propria investigacao revelar uma correcao viavel dentro do escopo da etapa, implemente e valide essa correcao antes de encerrar a rodada
- comentario, hipotese ou diagnostico nao substituem entrega de `Developer` quando ainda existe acao segura cabivel no repositorio dono da mudanca
- quando houver tarefa recusada por `Q.A.` ou `Security`, priorize essa retomada antes de capturar tarefa nova com `agent:developer`
- nao entregue a tarefa para `Quality Assurance` sem evidencia concreta
- quando a execucao tocar GitHub Actions, automacoes ou transicoes do board, consulte tambem os materiais relevantes em `automate/`
