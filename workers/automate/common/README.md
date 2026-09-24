# Common automation guidelines

Diretrizes compartilhadas por todos os agentes do projeto.

## Fonte de verdade

A fonte de verdade do fluxo é o label exclusivo `agent:*` da task.

Assignees tecnicos nao indicam ownership operacional; o label `agent:*` e a fonte de verdade.

A coluna só volta a ser obrigatória no passo final de `DevOps`, quando a entrega for movida para `In Review`.

## Regra de execução

Todo agente deve:

1. ler o label `agent:*` atual por GraphQL ou outro mecanismo oficial configurado
2. decidir com base na política do agente em `workers/automate/agents/<agent>/`
3. registrar evidência na issue ou PR
4. repassar a task para o próximo agente responsável quando concluir sua etapa
5. mover a coluna apenas quando a política realmente exigir, como no `DevOps` -> `In Review`
6. falhar visivelmente quando não conseguir atualizar a associação oficial exigida pelo fluxo

Não existe fallback por texto solto para representar agente responsável.

## Autenticação

Os workflows usam os secrets da GitHub App:

- `APP_ID`
- `APP_INSTALLATION_ID`
- `APP_PRIVATE_KEY`

A automação gera token de instalação em runtime usando `workers/src/github-app-auth.js`.

## external coding agent

Os agentes podem acionar o external coding agent quando precisarem de investigação adicional. O external coding agent pode apoiar a análise, mas a conclusão operacional continua sendo a atualização real do agente responsável, e da coluna final quando ela for aplicável.
