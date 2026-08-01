# Runner Skills

Este arquivo mapeia o modelo atual de execucao do ecossistema sem misturar o papel dos agents pares no ChatGPT com o papel do runner gerencial no GitHub.

## Estado atual

Hoje existem duas trilhas oficiais e complementares:

- os agents pares no ChatGPT sao o canal oficial para execucao normal por papel, investigacao, correcao de codigo, revisao tecnica e handoff operacional
- o workflow `.github/workflows/github-operations.yml` e o canal oficial para mutacoes remotas no GitHub e manutencao recorrente dentro do proprio GitHub

Com isso:

- `Developer`, `Security`, `Quality Assurance` e `DevOps` continuam tendo comportamento real definido pelos entry points em `src/` e pelos scripts em `automate/scripts/`
- `Developer`, `Quality Assurance` e `Security` atuam sobre a mesma tarefa em `Working`, trocando apenas o label `agent:*` do dono atual
- `Ready` e a fila de entrada; `Working` e o estado de ownership ativo ate o trio tecnico concluir a etapa
- os labels canonicos atuais sao `qa:accepted`, `qa:rejected`, `security:accepted` e `security:rejected`
- durante a transicao, os runners ainda devem reconhecer tambem os labels legados `approved:*` e `rejected:*` quando encontrarem trilhas antigas
- quando `qa:accepted` e `security:accepted` coexistem sem novas solicitacoes nos comentarios, a task fica elegivel para `In Review`; uma pessoa cria a PR de `master` e move a tarefa para `Deploy`, e `DevOps` aprova a PR, publica a liberacao e acompanha a verificacao das URLs de producao
- `DevOps` permanece responsavel pela fila propria de deploy e pela reconciliacao operacional quando houver conflito de merge ou bloqueio repo-local de publicacao

## GitHub Manager Runner

- workflow ativo: `.github/workflows/github-operations.yml`
- logica final: `automate/scripts/github-operations.mjs`
- guia operacional: `automate/github-operations.md`

## Runners por papel

- `src/developer-runner.js` -> `automate/scripts/developer-pr-dispatch.mjs`
- `src/security-runner.js` -> `automate/scripts/pr-label-review-runner.mjs` com `PR_REVIEW_ROLE=security`
- `src/qa-runner.js` -> `automate/scripts/pr-label-review-runner.mjs` com `PR_REVIEW_ROLE=qa`
- `src/devops-runner.js` -> `src/agent-dispatch-runner.js` com `AGENT_DISPATCH_ROLE=devops`
- `src/cto-runner.js` -> `automate/scripts/cto-project-supervisor.mjs` (legado; nao faz parte da trilha atual `Developer` -> `QA` -> `Security` -> `In Review` -> `Deploy` -> `DevOps`)
- `automate/scripts/cto-pr-finalizer.mjs` -> legado de consolidacao tecnica anterior; a trilha atual usa `In Review` -> `Deploy` -> `DevOps`

## Legado

Arquivos historicos ainda podem existir no repositorio, mas nao representam a trilha recorrente oficial quando houver divergencia com as skills compartilhadas e com os entry points atuais.

Exemplos de legado ou compatibilidade:

- `src/technical-lead-runner.js`
- `automate/scripts/technical-lead-pr-finalizer.mjs`
- workflows YAML antigos por papel quando nao houver reativacao explicita e documentada

## Regra de leitura

Quando a duvida envolver ownership, fila ou runtime:

1. confira primeiro os entry points reais em `src/*-runner.js`
2. confira a logica final em `automate/scripts/`
3. use `skills/shared/README.md` e `automate/agents/runner-map.md` como mapa de governanca
4. trate scripts ou workflows historicos fora desse caminho como legado ate reativacao explicita
