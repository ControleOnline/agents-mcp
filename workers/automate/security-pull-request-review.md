# Review Rules (Security)

## Escopo

No fluxo normal **nao ha PR do Developer**. A revisao de `Security` e sobre a task/issue e a evidencia mergeada em **`dev`**.

`staging` e exclusivo do RC do `DevOps`. Fonte: `agents/skills/shared/github/github-flow.md`.

## Quando a entrega estiver fora da politica, `Security` deve

- registrar `security:rejected`
- comentar o desvio (branch incorreta, ausencia de merge em **`dev`**, etc.)
- orientar o `Developer` a corrigir na `task-{id}` e refazer o **merge em `dev`**

## Restricoes

- `Security` nao finaliza task
- `Security` nao abre PR
- `Security` nao exige merge em `staging` do Developer
