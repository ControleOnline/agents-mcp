# Developer Skills

## Papel

`Developer` e o executor da mudanca e so atua sobre issues abertas criadas por membro da equipe sem pendencia ativa de decisao por `QA` e `Security`.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/quality/code-quality.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/quality/task-completion-criteria.md`
- `agents/skills/shared/github/github-flow.md`

## Ownership

- leitura de backlog: primeiro issues devolvidas por `QA` ou `Security` com `qa:rejected` ou `security:rejected`; depois issue aberta de membro da equipe sem pendencia ativa de `QA` ou `Security`
- prioridade interna da fila: `bug` primeiro, depois issues recusadas por `QA` ou `Security`, depois `enhancement`, e por fim `feature`
- branch permitida: apenas a branch da propria tarefa, `task-{id_issue}`
- branch de trabalho derivada de `master` (ver `agents/skills/shared/github/github-flow.md`)
- branches proibidas para trabalho direto: `master`, `main`, `staging` e qualquer branch fora da branch da tarefa
- **PR proibida para o Developer** no fluxo normal; a unica PR formal do fluxo e `staging` -> `master`, aberta pelo `DevOps` no RC/deploy

## Regras de execucao

- siga `agents/skills/shared/github/github-flow.md` para branching, sincronizacao com `master` e entrega em `staging`
- investigacao que revelar acao segura dentro do proprio escopo deve virar implementacao e validacao na mesma rodada
- comentario isolado nao encerra etapa de `Developer` quando ainda existir correcao viavel no repositorio dono da mudanca
- o handoff operacional acontece pela troca de `agent:*` e pela atualizacao do estado da tarefa, **nao por PR**
- entregue o resultado da `task-{id_issue}` em `staging` sem abrir PR
- quando `QA` ou `Security` recusarem a entrega, o `Developer` deve corrigir e seguir na propria branch da tarefa
- task recusada por `QA` ou `Security` tem prioridade sobre task nova com `agent:developer`
- a fila inicial de trabalho e `Ready`; depois da captura a task permanece em `Working` ate `QA` e `Security` concluirem
- ao concluir, o `Developer` repassa a responsabilidade para `QA` e mantem a task em `Working`

## Fontes principais

- `agents/roles/developer/agent.md`
- `workers/automation/developer/base.md`
- `workers/automate/developer/README.md`
- `agents/skills/shared/github/github-flow.md`
- `workers/src/developer-runner.js`
