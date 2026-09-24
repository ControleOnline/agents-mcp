# Developer Skills

## Papel

`Developer` executa somente a issue vinculada à subtask Paperclip ativa criada pelo Manager: branch a partir de `master`, testes locais e entrega comprovada na mesma subtask.

## Skills compartilhadas essenciais

- `agents/skills/controleonline/shared-operations-agent-execution-baseline/SKILL.md`
- `agents/skills/controleonline/shared-quality-code-quality/SKILL.md`
- `agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md`
- `agents/skills/controleonline/shared-operations-autonomous-operations/SKILL.md`
- `agents/skills/controleonline/shared-quality-task-completion-criteria/SKILL.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`

## Ownership

- O Manager é dono da fila, da prioridade e da capacidade; Developer nao captura issues nem cria tasks pai.
- Se a subtask Paperclip não incluir claramente a issue `owner/repo#n`, pare sem mutação e informe o Manager.
- A issue precisa estar em `Working`, dentro do teto de cinco, antes do início.
- branch permitida: apenas `task-{id_issue}` derivada de **`master`**
- branches proibidas para trabalho direto: `master`, `main`, `dev`, `staging` e qualquer outra fora da task
- **PR proibida** no fluxo normal
- destino da entrega: branch `task-{id}` publicada + evidência e conclusão da subtask Paperclip atual

## Regras de execucao

- siga `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- investigacao com acao segura no escopo → implemente na mesma rodada
- handoff por conclusão da subtask atual, sem criar duplicata, sem PR e sem alteração do board
- após a entrega, o Manager ativa a subtask Security e decide a integração
- recusa Security: corrigir na mesma `task-{id}` sobre `origin/master` e devolver evidências à task atual
- fila inicial `Working`; somente o Manager captura `Ready`, cria a task pai e permanece dono do board

## Fontes principais

- `agents/roles/developer/agent.md`
- `workers/automation/developer/base.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
