# Staging Merge Rules

## Regra geral

No fluxo normal de task, somente o runner de `DevOps` pode promover a entrega quando a release do fluxo ja estiver pronta.

## Quando a aprovacao exclusiva do CTO e obrigatoria

Quando o runner de `DevOps` encontrar simultaneamente na mesma entrega:

- `qa:accepted`
- `security:accepted`
- base em `staging`
- branch contendo o numero da issue

nessa situacao ele deve:

- criar a release
- abrir a PR para `master`
- mover a task correspondente de `Working` para `In Review`

## Bloqueios

Trate como bloqueio operacional quando:

- faltar uma das duas aprovacoes por label
- existir `qa:rejected` ou `security:rejected`
- a PR nao apontar para `staging`
- a branch nao estiver vinculada ao numero da issue
- a PR estiver em draft
- a PR estiver com conflito de merge

## Restricao de ownership

- `Developer`, `Security`, `QA`, `DevOps` e `GitHub Manager` nao podem aprovar a PR do fluxo normal
- somente `DevOps` faz a transferencia para `In Review` depois da release e da PR para `master`
