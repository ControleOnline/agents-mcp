# Runner Skills

Este arquivo mapeia o modelo atual de execução do ecossistema sem misturar o papel dos agents pares no ChatGPT com o papel do runner gerencial no GitHub.

## Trilha principal de push → Copilot (Manager Worker)

**Fonte canônica completa:** [`agents/skills/shared/operations/manager-worker-copilot.md`](../shared/operations/manager-worker-copilot.md)

Em **todos** os repositórios da org:

- Trigger: push em `master` | `dev` | `staging`
- Workflow: `.github/workflows/manager-worker.yml`
- Composite actions: `.github/actions/workers/{manager,qa,security,technical-documenter}/action.yml`

Fluxo resumido:

1. **Manager Subworker** resolve/cria a issue, normaliza `main`→`master`, aplica labels de estágio e decide quais workers invocar (`run_qa` / `run_security` / `run_docs` / `run_gates`).
2. Jobs condicionais invocam os composites.
3. Cada composite (QA / Security / Technical Documenter) aplica a label `agent:<papel>` e faz **agent_assignment** do `copilot-swe-agent[bot]` com `custom_instructions` apontando para `agents/roles/<papel>/agent.md` + `copilot-cooperation.md`.
4. Em `master`, o job de gates verifica o quarteto e re-invoca workers faltantes.

O antigo `technical-documenter.yml` isolado foi **substituído** por este orquestrador. Labels continuam sendo a fonte de verdade; se o Copilot não atuar, fallback por labels permanece válido.

## Estado atual (canais paralelos)

Existem trilhas oficiais e complementares:

- **Manager Worker + composite actions** (acima) — canal oficial de push → orquestração de issue + assignment do Copilot para QA / Security / Technical Documenter
- os agents pares no ChatGPT são o canal oficial para execução normal por papel, investigação, correção de código, revisão técnica e handoff operacional
- o workflow `.github/workflows/github-operations.yml` e os runners em `workers/src/` / `workers/automate/` continuam para mutações de Project, dispatch de PR e manutenção recorrente

Com isso:

- `Developer`, `Security`, `Quality Assurance` e `DevOps` continuam tendo comportamento real definido pelos entry points em `workers/src/` e pelos scripts em `workers/automate/scripts/` (canal de fila/PR)
- Labels canônicos de validação: `agent:qa:accepted`, `agent:qa:rejected`, `agent:security:accepted`, `agent:security:rejected`
- Labels de estágio de agent: `agent:qa`, `agent:security`, `agent:technical-documenter`, `agent:technical-documenter:done`, etc.
- quando `agent:qa:accepted` e `agent:security:accepted` coexistem sem novas solicitações nos comentários, `DevOps` cria a release; uma pessoa aprova a tarefa movendo-a para `Deploy`, e a partir de `Deploy` `DevOps` publica a build em produção
- `DevOps` permanece responsável pela fila própria de deploy e pela reconciliação operacional

## GitHub Manager Runner (legado de Project)

- workflow: `.github/workflows/github-operations.yml`
- lógica final: `workers/automate/scripts/github-operations.mjs`
- guia operacional: `workers/automate/github-operations.md`

**Não confundir** com o `manager-worker.yml` (orquestrador de push + Copilot).

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
