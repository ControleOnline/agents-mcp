# Shared Skills

Esta biblioteca cobre as skills compartilhadas do ecossistema.

## Ecosystem Centrality

Trate `ControleOnline/agents-mcp` como a fonte primaria para:

- definicao dos agents
- runners e workflows
- ownership e handoffs
- automacoes compartilhadas
- regras estruturais do fluxo operacional

Quando a pergunta for sobre orquestracao, ownership, handoff ou runtime, comece por este repositorio antes de concluir com base em repositorios consumidores.

## Skill Layering Policy

Use esta ordem para evitar duplicacao:

- mova comportamento comum para `skills/shared/`
- mantenha orientacao por agent em `skills/agents/`
- mantenha mapas de runtime em `skills/runners/`
- mantenha `agents/agent/*/agent.md` apenas com papel, fronteira e referencias obrigatorias
- mantenha `.github/agents/*.agent.md` como wrappers finos

## Priority Projects Policy

Use esta regra para priorizacao:

- `ControleOnline/app-community`
- `ControleOnline/api-community`
- `ControleOnline/api-whatsapp`

Quando houver concorrencia de demandas, prefira a que mais restaura funcionamento, remove bloqueio estrutural e reduz retrabalho nesses projetos.

## Agent Delegation Policy

- delegue quando a trilha ja pertence claramente a `Developer`, `Security`, `Quality Assurance`, `DevOps` ou `Sysadmin`
- intervenha diretamente quando a mudanca for estrutural no `agents-mcp`
- reorganize ownership quando a fila estiver andando no agent errado

## Shared Operational Skills

Esta pasta tambem concentra skills operacionais reutilizaveis:

- `autonomous-operations.md`
- `operational-security-guardrails.md`
- `operational-source-of-truth.md`
- `log-investigation-evidence.md`
- `github-issue-handling.md`
- `operational-github-workflow.md`
- `master-publication.md`
- `email-reading-fallback.md`
- `task-completion-criteria.md`

## GitHub Mutation Channel

Quando o agent precisar de mutacoes reais no GitHub, a trilha oficial passa a ser o `GitHub Manager Runner` descrito em `automate/github-operations.md`.

Essa trilha existe para:

- mover item entre colunas do ProjectV2
- comentar em issue ou PR
- trocar labels
- ajustar assignees
- publicar reviews
- executar mutacoes REST ou GraphQL autorizadas
- corrigir inconsistencias operacionais de coluna e labels

Guardrails desta trilha:

- a auditoria recorrente do `GitHub Manager Runner` deve permanecer em leitura ou `dry_run` por padrao
- mutacoes gerenciais automaticas nao substituem o criterio final de elegibilidade para `In Review`
- promover task para `In Review` acontece quando `QA` e `Security` ja aprovaram e nao ha novas solicitacoes nos comentarios; qualquer agente ou humano pode fazer essa transicao
- `In Review` e o passo humano em que uma pessoa cria a PR de `master` e move a tarefa para `Deploy`; `DevOps` executa a publicacao a partir de `Deploy`, aprova a PR e acompanha a liberacao ate a verificacao das URLs de producao
- use o `GitHub Manager Runner` para mutacao explicita autorizada ou manutencao gerencial compativel com essa fronteira

## Issue Flow Governance

Valide sempre:

- se a issue continua aberta
- se a issue foi criada por membro da equipe
- se a tarefa continua em `Working` com a tag `agent:*` esperada
- se `Q.A.` ja registrou `qa:accepted` ou `qa:rejected`
- se `Security` ja registrou `security:accepted` ou `security:rejected`
- se a tarefa ja esta pronta para `In Review`

Regras centrais:

- `Developer` le apenas issue aberta criada por membro da equipe e assume a primeira captura em `Working`
- `Developer` trabalha somente na propria branch da tarefa, contendo o numero da issue, e nao encerra o fluxo com PR no caminho tecnico normal
- `Ready` e apenas a fila de entrada; `Working` e o estado de ownership ativo ate o trio `Developer` -> `Q.A.` -> `Security` terminar
- `Security` e `QA` atuam sobre a tarefa em `Working`, nao sobre a coluna do projeto
- `Q.A.` so registra `qa:accepted` ou `qa:rejected` e repassa a propriedade para `Security`
- `Security` so registra `security:accepted` ou `security:rejected` e, quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios, a tarefa fica elegivel para `In Review`
- quando houver recusa, o runner deve comentar a issue com orientacao direta para a proxima execucao do responsavel atual
- `Security` e `QA` nao aprovam por review do GitHub e nao finalizam task
- qualquer agente ou humano pode mover a task para `In Review` quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios; a passagem de `In Review` para `Deploy` e humana e a publicacao final em `Deploy` fica com `DevOps`
- nenhum agent fecha task; fechamento em `closed` continua pertencendo apenas a humanos
- coluna do projeto nao entra no criterio de captura do backlog de `Developer`, `Security` e `QA`, mas `Ready` continua sendo a fila oficial de entrada e `Working` a fila de ownership ativo
