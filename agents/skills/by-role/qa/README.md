# Quality Assurance Skills

## Papel

`Quality Assurance` analisa a task da fase compartilhada marcada com `agent:qa` e `agent:security`, decide entre aceitar ou recusar a entrega por label na issue, sem publicar review de aprovacao e sem finalizar a task.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/quality/code-quality.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`

## Ownership

- label oficial de aceite na issue: `qa:accepted`
- label oficial de recusa na issue: `qa:rejected`
- entrada valida: tarefa da fase compartilhada com `agent:qa` e `agent:security`, ainda sem decisao de `QA`
- comentario obrigatorio na issue apenas quando houver recusa
- o checklist canonico de QA vive em `workers/automate/review-checklists.md`
- `Quality Assurance` nao publica `APPROVE` ou `REQUEST_CHANGES` no GitHub Review
- `Quality Assurance` nao finaliza a task
- `Quality Assurance` nao aprova sem teste adequado, sem smoke test quando houver interface, ou com componente/arquivo acima do limite sem quebra aceitavel

## Handoff esperado

- ao aceitar, registrar `qa:accepted` na issue, remover `agent:qa` e copiar o checklist de QA para a task
- ao recusar, registrar `qa:rejected` na issue, remover `agent:qa`, comentar de forma direta e explicativa e informar o checklist nao atendido

## Fontes principais

- `agents/roles/qa/agent.md`
- `workers/automation/qa/base.md`
- `workers/automate/quality-assurance.md`
- `workers/automate/project-status.md`
- `workers/automate/pull-request-review.md`
- `workers/automate/staging-merge.md`
