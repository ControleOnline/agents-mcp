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

## Task-First Policy

Toda solicitacao precisa estar vinculada a pelo menos uma task ou issue valida no GitHub.

- se a solicitacao entrar sem task, primeiro acione a skill de criacao de backlog do CTO em `agents/skills/by-role/cto/github-backlog-task-creation.md`
- crie uma ou mais issues conforme cada escopo independente, sem agrupar trabalho que precise de follow-up separado
- toda task nova precisa sair com uma label de tipo (`bug`, `enhancement` ou `feature`)
- confirme a criacao e o status da task antes de iniciar qualquer execucao
- nunca execute implementacao, analise operacional, ajuste estrutural ou handoff sem uma task valida
- se o pedido envolver mais de um escopo independente, cada escopo deve ganhar sua propria task antes da execucao

## Skill Layering Policy

Use esta ordem para evitar duplicacao:

- mova comportamento comum para `agents/skills/shared/`
- mantenha orientacao por agent em `agents/skills/by-role/`
- mantenha mapas de runtime em `agents/skills/runners/`
- mantenha `agents/roles/*/agent.md` apenas com papel, fronteira e referencias obrigatorias
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

## Shared Operational Skills (por categoria)

### github/
- `github/github-flow.md`
- `github/github-issue-handling.md`
- `github/operational-github-workflow.md`
- `github/master-publication.md`

### documentation/
- `documentation/documentation-governance.md`

### security/
- `security/security-guardrails.md`
- `security/operational-security-guardrails.md`

### quality/
- `quality/code-quality.md`
- `quality/task-completion-criteria.md`

### operations/
- `operations/agent-execution-baseline.md`
- `operations/agent-wrapper-contract.md`
- `operations/agent-handoff-governance.md`
- `operations/autonomous-operations.md`
- `operations/operational-source-of-truth.md`
- `operations/log-investigation-evidence.md`
- `operations/email-reading-fallback.md`

## GitHub Flow (branches e entrega)

A skill `github-flow.md` e a fonte canonica de:

- branch `task-{id_issue}` derivada de `master`
- entrega do Developer em `staging` **sem PR**
- proibicao de PR para `Developer`, `QA` e `Security` no fluxo normal
- unica PR formal do fluxo: `staging` -> `master`, aberta pelo `DevOps` no RC/deploy

Todo agent que toque em branch, integracao ou promocao deve seguir essa skill.

## GitHub Mutation Channel

Quando o agent precisar de mutacoes reais no GitHub, a trilha oficial passa a ser o `GitHub Manager Runner` descrito em `workers/automate/github-operations.md`.

Essa trilha existe para:

- ajustar o estado do item no ProjectV2
- comentar em issue ou PR
- trocar labels
- ajustar assignees
- publicar reviews
- executar mutacoes REST ou GraphQL autorizadas
- corrigir inconsistencias operacionais de estado e labels

Guardrails desta trilha:

- a auditoria recorrente do `GitHub Manager Runner` deve permanecer em leitura ou `dry_run` por padrao
- mutacoes gerenciais automaticas nao substituem a decisao final de `QA` e `Security`
- quando `QA` e `Security` ja aprovaram e nao ha novas solicitacoes nos comentarios, `DevOps` assume a tarefa para criar a release tecnica
- o humano aprova a entrega movendo a task para `Deploy`
- em `Deploy`, `DevOps` publica a build em producao ate a finalizacao
- depois de publicar, `DevOps` move a task para `Documentation` e aplica as tags de documentacao correspondentes
- use o `GitHub Manager Runner` para mutacao explicita autorizada ou manutencao gerencial compativel com essa fronteira

## Issue Flow Governance

Valide sempre:

- se a issue continua aberta
- se a issue foi criada por membro da equipe
- se a tarefa continua com a tag `agent:*` esperada
- se `QA` ja registrou `qa:accepted` ou `qa:rejected`
- se `Security` ja registrou `security:accepted` ou `security:rejected`
- se o checklist canonico de QA ou Security foi copiado para a task
- se a tarefa ja esta pronta para a proxima etapa humana

Regras centrais:

- `Developer` le apenas issue aberta criada por membro da equipe e assume a primeira captura em `Working`
- `Developer` trabalha somente na propria branch da tarefa, contendo o numero da issue, entrega em `staging` sem PR e nao encerra o fluxo com PR
- `Ready` e apenas a fila de entrada; `Working` e o estado de ownership ativo ate o trio `Developer` -> `QA` -> `Security` terminar
- a fase de revisao compartilha a mesma task e deve carregar sempre as duas labels de entrada `agent:qa` e `agent:security` enquanto ainda nao houver decisao estruturada
- se a task entrar com apenas uma dessas labels e ainda nao existir `qa:accepted`, `qa:rejected`, `security:accepted` ou `security:rejected`, a sincronizacao de fluxo deve completar a segunda label antes da revisao
- `Security` e `QA` atuam sobre a mesma task pela label `agent:*` esperada para o proprio papel, sem depender de coluna
- `QA` so registra `qa:accepted` ou `qa:rejected`, copia o checklist de QA para a task e remove `agent:qa`
- `Security` so registra `security:accepted` ou `security:rejected`, copia o checklist de Security para a task e remove `agent:security`
- na fila do `Developer`, bugs entram primeiro, depois tasks recusadas por `QA` ou `Security`, depois `enhancement` e por fim `feature`
- quando houver recusa, o runner deve comentar a issue com orientacao direta, checklist nao atendido e motivo objetivo para a proxima execucao do responsavel atual
- `Security` e `QA` nao aprovam por review do GitHub e nao finalizam task
- quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios, `DevOps` assume a tarefa para preparar a release tecnica / RC e, no ponto certo, abrir a PR `staging` -> `master`
- depois da publicacao, a tarefa segue para `Documentation` com as tags de documentacao apropriadas para iniciar a trilha documental
- nenhum agent fecha task; fechamento em `closed` continua pertencendo apenas a humanos
- `Ready` continua sendo a fila oficial de entrada para `Developer`, enquanto `QA` e `Security` dependem da label `agent:*` esperada
- quando `qa:rejected` ou `security:rejected` existir, `Developer` deve dar prioridade ao retrabalho dessa task antes de capturar uma task nova com `agent:developer`
