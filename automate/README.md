# Automate

Esta pasta concentra a politica e a base executavel dos runners operacionais do ecossistema `ControleOnline`.

## Agentes cobertos

- `Developer`: seleciona issue aberta de membro da equipe com prioridade em `Ready`, executa a mudanca na propria branch e mantém a task em `Working` ate o handoff para `Quality Assurance`
- `Quality Assurance`: valida a entrega recebida do `Developer` em `Working` e registra `qa:accepted` ou `qa:rejected` na issue
- `Security`: valida a entrega recebida de `Quality Assurance` em `Working` e registra `security:accepted` ou `security:rejected` na issue
- `DevOps`: continua com a fila propria de deploy, aprova a PR de `master` quando a task entra em `Deploy`, publica a liberacao e acompanha a estabilizacao ate as URLs de producao estarem verificadas
- `GitHub Operations Runner`: executa mutacoes de GitHub a partir do proprio GitHub Actions quando o runtime local dos agents nao consegue concluir a operacao

## Arquivos principais

- `scripts/developer-pr-dispatch.mjs`: selecao do backlog do `Developer`
- `scripts/pr-label-review-runner.mjs`: review runner compartilhado entre `Quality Assurance` e `Security` para fluxo por labels e issue
- `scripts/github-operations.mjs`: executor genérico de mutações REST, GraphQL e mudanças de coluna no GitHub
- `pull-request-review.md`: politica atual de review de `QA`
- `security-pull-request-review.md`: politica atual de review de `Security`
- `master-publication.md`: regra de aprovacao e promocao exclusiva do `DevOps` na publicacao de `master`

## Objetivo

Permitir que o GitHub execute o fluxo padronizado:

1. `Developer` le apenas issue aberta criada por membro da equipe com prioridade em `Ready`
2. `Developer` trabalha somente na propria branch da tarefa, contendo o numero da issue
3. `Developer` nao encerra o fluxo tecnico normal com PR
4. `Developer` mantém a task em `Working` e repassa a responsabilidade para `Quality Assurance` via `agent:qa`
5. `Quality Assurance` registra `qa:accepted` ou `qa:rejected` na issue e repassa a responsabilidade para `Security` via `agent:security`
6. `Security` registra `security:accepted` ou `security:rejected` na issue
7. quando houver recusa, o runner comenta a issue de forma direta para orientar a proxima execucao do dono atual
8. quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios, a task fica elegivel para `In Review`; qualquer agente ou humano pode fazer a transicao
9. `In Review` e a etapa humana em que uma pessoa cria a PR para `master` e move a tarefa para `Deploy`
10. em `Deploy`, o `DevOps` aprova a PR, publica a liberacao e acompanha a entrega ate a verificacao das URLs de producao

## Observacoes

- `Quality Assurance` e `Security` nao publicam `APPROVE` ou `REQUEST_CHANGES` no GitHub Review.
- `Quality Assurance` e `Security` nao finalizam task.
- a fila oficial de entrada e `Ready`; `Working` e o estado de ownership ativo ate `Developer`, `Quality Assurance` e `Security` concluirem a trilha tecnica
- qualquer agente ou humano pode mover a task para `In Review` quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios
- quando houver conflito entre script e politica, siga os arquivos `.md` desta pasta.
