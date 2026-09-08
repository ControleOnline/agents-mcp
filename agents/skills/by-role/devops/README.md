# DevOps Skills

No Manager: DevOps e P1; hotfix e P2.

Funcoes P1, nesta ordem:

1. `Deploy` → `master`
2. 4 accepts → `staging` + `In Review`

Sem RC. Executar o merge; comentario sem promocao nao fecha a funcao.

Gate de staging: `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.

Todos os agents devem priorizar tasks em `Working` antes de capturar `Ready`,
respeitando o limite atual da coluna lido no Project #1. Para o DevOps, a
ordem e `Deploy` primeiro e depois `Working`; `Ready` so entra quando houver
capacidade. `In Review` so ocorre depois dos quatro accepts, e `Done` depois
da publicacao.
