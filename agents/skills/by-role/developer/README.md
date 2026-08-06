# Developer Skills

## Papel

`Developer` executa a mudanca em issues elegiveis: branch a partir de `master`, merge final em **`dev`** (sem PR).

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/quality/code-quality.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/quality/task-completion-criteria.md`
- `agents/skills/shared/github/github-flow.md`

## Ownership

- leitura de backlog: primeiro issues com `qa:rejected` ou `security:rejected`; depois issue aberta de membro da equipe sem pendencia ativa de QA/Security
- prioridade: `bug` → recusas QA/Security → `enhancement` → `feature`
- branch permitida: apenas `task-{id_issue}` derivada de **`master`**
- branches proibidas para trabalho direto: `master`, `main`, `dev`, `staging` e qualquer outra fora da task
- **PR proibida** no fluxo normal
- destino da entrega: **merge `task-{id}` → `dev`** (nao `staging`)

## Regras de execucao

- siga `agents/skills/shared/github/github-flow.md`
- investigacao com acao segura no escopo → implemente na mesma rodada
- handoff por labels `agent:qa` + `agent:security` e evidencia, **nao por PR**
- apos merge em `dev`, a revisao QA/Security usa essa evidencia
- recusa: corrigir na mesma `task-{id}` e re-mergear em `dev`
- fila inicial `Ready`; apos captura permanece em `Working` ate QA e Security concluirem

## Fontes principais

- `agents/roles/developer/agent.md`
- `workers/automation/developer/base.md`
- `agents/skills/shared/github/github-flow.md`
