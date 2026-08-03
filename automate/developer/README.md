# Developer

Automacoes do agent `Developer`.

## Responsabilidade do runner

O runner de `Developer` nao implementa a issue por conta propria.

Ele:

- procura tasks abertas na coluna `Ready`
- trata task sem `agent:*` em `Ready` como entrada padrao do fluxo
- ignora tasks que estejam exclusivamente com pessoas
- distingue execucao recente, execucao stale e override manual antes de decidir a proxima captura
- prioriza a retomada automatica de uma trilha stale do proprio `Developer` antes de capturar task nova
- prioriza antes de tudo bugs, depois as tasks devolvidas por `QA` ou `Security` com `qa:rejected` ou `security:rejected`, depois `enhancement` e por fim `feature`
- nao congela a fila apenas porque existe outra issue com `agent:developer`; o bloqueio so vale para execucao tecnica realmente ativa e recente
- atribui preferencialmente `github-copilot[bot]` com instrucoes de `Developer` para a proxima task elegivel
- pode operar com fallback de `AGENT_ASSIGNEE_OVERRIDE` quando o Copilot cloud agent nao estiver disponivel no repositorio alvo
- registra comentario objetivo quando a atribuicao ou retomada for executada
- nos runners do GitHub Actions, deve preferir `GH_TOKEN`; o GitHub App fica apenas como fallback quando esse token nao estiver disponivel

## Cadeia real do runner

- entry point de runtime: `src/developer-runner.js`
- workflow de compatibilidade: `automate/workflows/developer-project-dispatch.yml`
- runner comum: `src/agent-dispatch-runner.js`
- wrapper do papel: `automate/agents/developer/dispatch.mjs`
- logica compartilhada final: `automate/scripts/agent-project-dispatch.mjs`

## Regras operacionais

- nao retirar task que esteja exclusivamente com pessoas
- task nova em `Ready` sem `agent:*` pertence inicialmente a `Developer`
- execucao stale do proprio `Developer` deve ser retomada antes de abrir nova captura
- override manual ativo deve ser tratado como estado distinto, nao como captura first-party do Copilot
- usar `master` como branch base operacional
- delegar a execucao para o agent `Developer` do repositorio alvo
