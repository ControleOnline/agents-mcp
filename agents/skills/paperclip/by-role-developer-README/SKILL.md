# Developer Skills

## Papel

`Developer` executa a mudanca em issues elegiveis: branch a partir de `master`, merge final em **`dev`** (sem PR).

## Skills compartilhadas essenciais

- `agents/skills/paperclip/shared-operations-agent-execution-baseline/SKILL.md`
- `agents/skills/paperclip/shared-quality-code-quality/SKILL.md`
- `agents/skills/paperclip/shared-operations-agent-handoff-governance/SKILL.md`
- `agents/skills/paperclip/shared-operations-autonomous-operations/SKILL.md`
- `agents/skills/paperclip/shared-quality-task-completion-criteria/SKILL.md`
- `agents/skills/paperclip/shared-github-github-flow/SKILL.md`

## Ownership

- se o prompt nao informar issue, descubra a proxima prioridade no GitHub; **nao peca ao usuario para escolher a issue**
- leitura de backlog: issues abertas com ownership de `Developer` (`agent:developer`) ou entrada padrao em `Ready`/`Working` sem `agent:*`, sem pendencia ativa de QA/Security que pertenca aos revisores
- limite operacional: a coluna `Working` comporta no máximo **5 tasks**; ao atingir cinco, não capture outra task até uma sair da coluna. O P1 `DevOps` continua sendo a única exceção para publicação em `Deploy`.
- `Ready` e `Working` sao a fila operacional compartilhada; todos os agents priorizam `Working` antes de `Ready`. `In Review` so ocorre depois dos quatro accepts; DevOps consulta `Deploy` antes de `Working`
- prioridade por **tipo**: `hotfix` → recusas QA/Security (`agent:qa:rejected` ou `agent:security:rejected`) → `bug` → demais (`enhancement`/`feature`/sem tipo)
- desempate **dentro de cada tipo**: `p0` → `p1` → `p2` → … (sem `p*` por ultimo) → depois `createdAt` crescente → menor numero da issue; `updatedAt` nao altera a posicao
- branch permitida: apenas `task-{id_issue}` derivada de **`master`**
- branches proibidas para trabalho direto: `master`, `main`, `dev`, `staging` e qualquer outra fora da task
- **PR proibida** no fluxo normal
- destino da entrega: **merge `task-{id}` → `dev`** (nao `staging`)

## Regras de execucao

- siga `agents/skills/paperclip/shared-github-github-flow/SKILL.md`
- investigacao com acao segura no escopo → implemente na mesma rodada
- handoff por labels `agent:qa` + `agent:security` e evidencia, **nao por PR**
- apos merge em `dev`, a revisao QA/Security usa essa evidencia
- recusa: corrigir na mesma `task-{id}` e re-mergear em `dev`
- fila inicial `Ready`; apos captura permanece em `Working` ate QA e Security concluirem

## Fontes principais

- `agents/roles/developer/agent.md`
- `workers/automation/developer/base.md`
- `agents/skills/paperclip/shared-github-github-flow/SKILL.md`
