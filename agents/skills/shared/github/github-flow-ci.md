# GitHub Flow — CI por task

Este arquivo descreve o fluxo canônico de integração contínua por task (issues #181–#184 e #188). Não existe Release Candidate operacional.

## Branches

| Branch | Papel |
| --- | --- |
| `master` | Producao (git). Artefato de producao **nao** publica no push; Lave-Go domingo 06:00 / Controle Online segunda 08:00 |
| `dev` | CI das tasks do Developer |
| `staging` | Deltas quádruplo-accepted (ou hotfix) para conferencia humana |
| `task-{id}` | Trabalho do Developer |

## Fluxo

```text
master → task-{id} → merge dev
  → Developer aplica agent:qa + agent:security + agent:design + agent:ux
  → 4x :accepted
  → DevOps merge SOMENTE task-{id} → staging + coluna In Review
  → humano → coluna Deploy
  → DevOps merge delta → master + Done
```

- Nao criar task pai RC.
- Nao mergear `dev` inteiro em `staging`.
- Recusa de qualquer validador: issue open, volta ao Developer na mesma `task-{id}`.
- Hotfix pode entrar em staging antes do quadruplo; Deploy humano continua obrigatorio para master.
