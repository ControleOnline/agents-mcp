# Review Rules (QA)

## Escopo

No fluxo normal **nao ha PR do Developer**. A revisao de `QA` e sobre a task/issue e a evidencia mergeada em **`dev`**.

`staging` e exclusivo do pacote RC do `DevOps`. Fonte: `agents/skills/shared/github/github-flow.md`.

## Quando a entrega estiver operacionalmente valida, `QA` deve

- aplicar o checklist canonico
- registrar `qa:accepted` ou `qa:rejected` na task
- comentar na issue com evidencia e motivo
- remover `agent:qa` apos a decisao

## Quando a entrega estiver fora da politica, `QA` deve

- registrar `qa:rejected`
- comentar o desvio (branch incorreta, ausencia de merge em **`dev`**, etc.)
- orientar o `Developer` a corrigir na `task-{id}` e refazer o **merge em `dev`**

## Restricoes

- `QA` nao finaliza task
- `QA` nao abre PR
- `QA` nao exige merge em `staging` do Developer
