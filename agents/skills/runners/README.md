# Runner Skills

Este arquivo mapeia o modelo atual de execucao do ecossistema sem misturar o papel dos agents pares no ChatGPT com o papel do runner gerencial no GitHub.

## Estado atual

Hoje existem duas trilhas oficiais e complementares:

- os agents pares no ChatGPT sao o canal oficial para execucao normal por papel, investigacao, correcao de codigo, revisao tecnica e handoff operacional
- o workflow `.github/workflows/github-operations.yml` e o canal oficial para mutacoes remotas no GitHub e manutencao recorrente dentro do proprio GitHub

Com isso:

- `Developer`, `Security`, `Quality Assurance` e `DevOps` continuam tendo comportamento real definido pelos entry points em `workers/src/` e pelos scripts em `workers/automate/scripts/`
- `Developer`, `Quality Assurance` e `Security` atuam sobre a mesma tarefa em `Working`, trocando apenas o label `agent:*` do dono atual e copiando o checklist canonico para a issue quando aprovar ou reprovar
- `Ready` e a fila de entrada; `Working` e o estado de ownership ativo ate o trio tecnico concluir a etapa
- os labels canonicos atuais sao `qa:accepted`, `qa:rejected`, `security:accepted` e `security:rejected`
- durante a transicao, os runners ainda devem reconhecer tambem os labels legados `approved:*` e `rejected:*` quando encontrarem trilhas antigas
- quando `qa:accepted` e `security:accepted` coexistem sem novas solicitacoes nos comentarios, `DevOps` cria a release; uma pessoa aprova a tarefa movendo-a para `Deploy`, e a partir de `Deploy` `DevOps` publica a build em producao e acompanha a entrega ate a finalizacao
- `DevOps` permanece responsavel pela fila propria de deploy e pela reconciliacao operacional quando houver conflito de merge ou bloqueio repo-local de publicacao

## GitHub Manager Runner

- workflow ativo: `.github/workflows/github-operations.yml`
- logica final: `workers/automate/scripts/github-operations.mjs`
- guia operacional: `workers/automate/github-operations.md`

## Runners por papel

- `workers/src/developer-runner.js` -> `workers/automate/scripts/developer-pr-dispatch.mjs`
- `workers/src/security-runner.js` -> `workers/automate/scripts/pr-label-review-runner.mjs` com `PR_REVIEW_ROLE=security`
- `workers/src/qa-runner.js` -> `workers/automate/scripts/pr-label-review-runner.mjs` com `PR_REVIEW_ROLE=qa`
- `workers/src/devops-runner.js` -> `workers/src/agent-dispatch-runner.js` com `AGENT_DISPATCH_ROLE=devops`
- `workers/src/cto-runner.js` -> `workers/automate/scripts/cto-project-supervisor.mjs` (legado; nao faz parte da trilha atual `Developer` -> `QA` -> `Security` -> `Deploy` -> `DevOps`)
- `workers/automate/scripts/cto-pr-finalizer.mjs` -> legado de consolidacao tecnica anterior; a trilha atual usa `Deploy` -> `DevOps`

## Legado

Arquivos historicos ainda podem existir no repositorio, mas nao representam a trilha recorrente oficial quando houver divergencia com as skills compartilhadas e com os entry points atuais.

Exemplos de legado ou compatibilidade:

- `workers/src/technical-lead-runner.js`
- `workers/automate/scripts/technical-lead-pr-finalizer.mjs`
- workflows YAML antigos por papel quando nao houver reativacao explicita e documentada

## Regra de leitura

Quando a duvida envolver ownership, fila ou runtime:

1. confira primeiro os entry points reais em `workers/src/*-runner.js`
2. confira a logica final em `workers/automate/scripts/`
3. use `agents/skills/shared/README.md` e `workers/automate/agents/runner-map.md` como mapa de governanca
4. trate scripts ou workflows historicos fora desse caminho como legado ate reativacao explicita
