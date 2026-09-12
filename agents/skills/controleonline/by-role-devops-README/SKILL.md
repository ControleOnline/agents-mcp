# DevOps Skills

No Manager: DevOps e P1; hotfix e P2.

Funcoes P1, nesta ordem:

1. Todas as tasks em `Deploy` → uma nova versão estável por task → `master`
2. 4 accepts → Manager aciona DevOps; atualizar `dev` e `staging` com `origin/master`, confirmar o merge do Developer em `dev`, promover o delta para `staging` e devolver para `In Review`

Sem RC. Executar o merge; comentario sem promocao nao fecha a funcao.

Gate de staging: `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.

Depois da promoção, DevOps valida o deploy e o runtime publicado, incluindo o
fluxo afetado e erros relevantes de serviço, e devolve um handoff ao Manager.
DevOps não decide a coluna final, não move para `Done`/`Working` e não cria
filhas documentais.

Todos os agents devem priorizar tasks em `Working` antes de capturar `Ready`,
respeitando o limite atual da coluna lido no Project #1. Para o DevOps, a
ordem e `Deploy` primeiro e depois `Working`; `Ready` so entra quando houver
capacidade. `In Review` só ocorre depois dos quatro accepts. `Done` ou `Working`
após uma publicação são decisões do Manager,
com base no quarteto de accepts.
