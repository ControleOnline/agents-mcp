# DevOps Skills

No Manager: DevOps e P1; hotfix e P2.

Funcoes P1, nesta ordem:

1. Tasks com quatro accepts → montar uma RC congelada de 1 a 5 tasks a partir do master atual → manifesto → staging → `In Review`.
2. Quando as tasks da RC homologada estiverem em `Deploy` → promover exatamente a mesma RC para `master`, sem alterar SHAs.

A RC e artefato tecnico e nunca uma issue/task agregadora. Alterou qualquer SHA ou conteudo depois do freeze: invalide a homologacao e gere `rc.N+1`. Comentario sem promocao nao fecha a funcao.

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
