# Developer Skills

## Papel

`Developer` e o executor da mudanca e so atua sobre issues abertas criadas por membro da equipe sem PR pendente de decisao por `QA` e `Security`.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-handoff-governance.md`
- `skills/shared/autonomous-operations.md`
- `skills/shared/task-completion-criteria.md`

## Ownership

- leitura de backlog: apenas issue aberta de membro da equipe sem pendencia ativa de `Q.A.` ou `Security`
- branch permitida: apenas a branch da propria tarefa, contendo o numero da issue
- branch de trabalho derivada de `master`
- branches proibidas para trabalho direto: `master`, `main`, `staging` e qualquer branch fora da branch da tarefa

## Regras de execucao

- investigacao que revelar acao segura dentro do proprio escopo deve virar implementacao e validacao na mesma rodada
- comentario isolado nao encerra etapa de `Developer` quando ainda existir correcao viavel no repositorio dono da mudanca
- o handoff operacional acontece pela troca de `agent:*` e pela atualizacao do estado da tarefa, nao por PR no caminho tecnico normal
- quando `Q.A.` ou `Security` recusarem a entrega, o `Developer` deve corrigir e seguir na propria branch da tarefa
- a fila inicial de trabalho e `Ready`; depois da captura a task permanece em `Working` ate `Q.A.` e `Security` concluirem
- ao concluir, o `Developer` repassa a responsabilidade para `Q.A.` e mantém a task em `Working`

## Fontes principais

- `agents/agent/developer/agent.md`
- `automation/developer/base.md`
- `automate/developer/README.md`
- `src/developer-runner.js`
