# DevOps Skills

No Manager: DevOps e P1; hotfix e P2.

Funcoes P1, nesta ordem:

1. Tasks com `agent:security:accepted` e revalidacao do Manager → montar uma RC congelada de 1 a 5 tasks a partir do master atual → manifesto → staging → `In Review`.
2. Quando as tasks da RC homologada estiverem em `Deploy` → promover exatamente a mesma RC para `master`, sem alterar SHAs.

A RC e artefato tecnico e nunca uma issue/task agregadora. Alterou qualquer SHA ou conteudo depois do freeze: invalide a homologacao e gere `rc.N+1`. Comentario sem promocao nao fecha a funcao.

Gate de staging: `agent:security:accepted` + revalidacao do Manager com testes locais e evidencia da entrega em `dev`.

Depois da promoção, DevOps valida o deploy e o runtime publicado, incluindo o
fluxo afetado e erros relevantes de serviço, e devolve um handoff ao Manager.
DevOps não decide a coluna final, não move para `Done`/`Working` e não cria
filhas documentais.

DevOps nao descobre nem captura tasks no GitHub. Execute apenas a subtask ativa
atribuida pelo Manager; ela deve identificar a task e a RC autorizada. A coluna
`Deploy` e a autorizacao humana para publicar. `In Review` so ocorre para tasks
inventariadas na RC congelada. `Done` ou `Working` apos publicacao sao decisoes
do Manager, com base no resultado do deploy e na evidencia local.
