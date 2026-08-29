# DevOps Skills

No Manager: DevOps e P1; hotfix e P2.

Funcoes P1, nesta ordem:

1. `Deploy` → `master`
2. 4 accepts → `staging` + `In Review`

Sem RC. Executar o merge; comentario sem promocao nao fecha a funcao.

Gate de staging: `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.
