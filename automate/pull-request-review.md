# Pull Request Review Rules

## Escopo

Estas regras definem como `QA` deve agir sobre PRs do `Developer`, sem alterar coluna do projeto e mantendo o checklist de aprovacao copiado na task.

## Regras de aceite

Quando a PR estiver operacionalmente valida, `QA` deve:

- registrar `qa:accepted` na propria PR
- nao publicar `APPROVE` no GitHub Review
- deixar a aprovacao final da PR para o `CTO`
- copiar o checklist de QA para a issue vinculada

## Regras de recusa

Quando a PR estiver fora da politica operacional, `QA` deve:

- registrar `qa:rejected` na propria PR
- comentar a issue de forma direta e explicativa
- nao publicar `REQUEST_CHANGES` no GitHub Review

Motivos minimos de recusa operacional:

- PR nao aponta para `staging`
- branch do developer nao contem o numero da issue
- branch proibida foi usada diretamente
- PR esta em draft
- PR esta com conflito de merge

## Comentario obrigatorio na issue

Ao recusar, o comentario deve informar:

- qual PR foi recusada
- por que ela foi recusada
- o checklist nao atendido
- que a proxima execucao do `Developer` deve corrigir a tarefa e seguir com nova PR para `staging`

## Restricao de ownership

- `QA` nao aprova PR no GitHub Review
- `QA` nao finaliza task
- somente `CTO` aprova a PR e move a task para `In Review`
- `QA` nao mexe na coluna do projeto
