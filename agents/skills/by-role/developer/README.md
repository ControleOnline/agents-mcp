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

- se o prompt nao informar issue, descubra a proxima prioridade no GitHub; **nao peca ao usuario para escolher a issue**
- leitura de backlog: issues abertas com ownership de `Developer` (`agent:developer`) ou entrada padrao em `Ready`/`Working` sem `agent:*`, sem pendencia ativa de QA/Security que pertenca aos revisores
- prioridade: `hotfix` → recusas QA/Security (`agent:qa:rejected` ou `agent:security:rejected`) → `bug` → `enhancement` → `feature`
- desempate dentro da mesma prioridade: mais antiga por `createdAt` crescente; empate pelo menor numero da issue; `updatedAt` nao altera a posicao
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
