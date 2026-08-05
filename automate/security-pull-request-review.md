# Review Rules (Security)

## Escopo

No fluxo normal **nao ha PR do Developer**. A revisao de `Security` e sobre a task/issue e a evidencia mergeada em `staging`.

A unica PR formal do fluxo e `staging` -> `master`, aberta pelo `DevOps` no RC. Essa PR de promocao nao e a superficie principal de revisao de conteudo de `Security`.

Fonte: `skills/shared/github-flow.md`.

## Quando a entrega estiver operacionalmente valida, `Security` deve

- aplicar o checklist canonico
- registrar `security:accepted` ou `security:rejected` na task
- comentar na issue com evidencia e motivo
- remover `agent:security` apos a decisao

## Quando a entrega estiver fora da politica, `Security` deve

- registrar `security:rejected`
- comentar o desvio (branch incorreta, ausencia de merge em `staging`, etc.)
- orientar o `Developer` a corrigir na `task-{id}` e refazer o **merge** em `staging`

## Restricoes

- `Security` nao finaliza task
- `Security` nao abre PR
- `Security` nao mexe na coluna do projeto como substituto da decisao por label
- somente `DevOps` abre a PR para `master` depois do RC
