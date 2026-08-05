# ControleOnline GitHub Project MCP Agents

Este repositorio e a fonte oficial para automacoes, agents, runners, workflows e instrucoes operacionais do ecossistema ControleOnline.

## Fonte canonica

Tudo o que nao for memoria persistente deve estar disponivel aqui.

Entradas principais:

- `skills/README.md`
- `skills/shared/README.md`
- `skills/shared/github-flow.md`
- `skills/agents/*/README.md`
- `skills/runners/README.md`
- `agents/agent/*/agent.md`
- `.github/agents/*.agent.md`
- `automation/`
- `automate/`

## Regra central de skills

Toda regra nova deve entrar primeiro na camada certa, em vez de ser repetida entre agents, wrappers e instrucoes locais.

Distribuicao obrigatoria:

- comportamento compartilhado, politicas, guardrails e criterios comuns vivem em `skills/shared/`
- qualidade de codigo, modularizacao, smoke tests e limite de tamanho de componentes vivem em `skills/shared/code-quality.md`
- documentacao de cliente e wiki tecnica vivem em `skills/shared/documentation-governance.md`
- seguranca editorial e sanitizacao de evidencias vivem em `skills/shared/security-guardrails.md`
- fluxo de branches e entrega (GitHub Flow adaptado) vive em `skills/shared/github-flow.md`
- papel, ownership, limites e handoff por agent vivem em `skills/agents/<agent>/README.md`
- mapas de runtime, workflows, entry points e scripts reais vivem em `skills/runners/README.md`
- `agents/agent/*/agent.md` devem ficar enxutos e conter apenas ponto de entrada, papel, fronteiras e referencias obrigatorias
- wrappers locais em `.github/agents/*.agent.md` devem ser finos e apontar para a fonte canonica e para o contexto local minimo

## Canal de execucao

Os runners do GitHub deste repositorio estao desativados como canal operacional principal.

A execucao por papel deve acontecer pelos agentes pares no ChatGPT.

Com isso:

- workflows em `.github/workflows/` ficam apenas como trilha desativada e referencia tecnica
- nenhuma rotina por `push` ou `schedule` deve ser reativada sem decisao estrutural explicita
- ownership, handoff e criterios de execucao continuam definidos pelas skills centrais e pelos agents canonicos

## GitHub

Ao consultar ou operar no GitHub, os agents podem usar qualquer busca, API, listagem, ferramenta, mutacao ou superficie que estiver disponivel na sessao. Nao existe restricao artificial de consulta no GitHub dentro do `agents-mcp`; a escolha do caminho deve seguir apenas o que melhor produz a evidencia correta para a tarefa atual.

## GitHub Flow (resumo)

Fonte completa: `skills/shared/github-flow.md`.

- branch de trabalho: `task-{id_issue}` derivada de `master`
- `Developer` entrega em `staging` por **merge** da task branch (sem PR)
- `QA` e `Security` decidem por labels na task; nao abrem PR
- unica PR formal do fluxo normal: `staging` -> `master`, aberta **somente pelo DevOps** no RC/deploy

## Ownership operacional

Labels oficiais de review na task:

- `qa:accepted`
- `qa:rejected`
- `security:accepted`
- `security:rejected`

Regras obrigatorias:

- nenhuma task deve ser atribuida a pessoas, bots ou fallbacks tecnicos como mecanismo de captura de trabalho
- assignees do GitHub nao participam do roteamento operacional e devem ser removidos quando aparecerem em tasks da fila
- `Developer` seleciona trabalho apenas quando a issue ainda esta aberta, foi criada por membro da equipe e nao existe pendencia ativa de decisao por `QA` e `Security`
- coluna do projeto, assignee e labels de etapa nao participam mais da leitura do backlog de `Developer`, `QA` e `Security`
- `Developer` so pode trabalhar na propria branch da tarefa (`task-{id_issue}`) e entrega em `staging` por **merge**, sem abrir PR
- `Developer` nao deve mexer diretamente em `master`, `main`, `staging` ou qualquer outra branch fora da branch da tarefa
- `Security` analisa a entrega do developer e registra apenas `security:accepted` ou `security:rejected` na task
- `QA` analisa a entrega do developer e registra apenas `qa:accepted` ou `qa:rejected` na task
- quando `Security` ou `QA` recusarem, o runner deve comentar de forma direta e explicativa na issue para orientar a proxima execucao do `Developer`
- `Security` e `QA` nao aprovam por review formal de PR de produto e nao finalizam task
- somente o `DevOps` abre a PR `staging` -> `master` no ponto do RC e conduz o deploy apos aprovacao humana
- nenhum outro agent pode finalizar a tarefa ou promover para `master`
- agents nao fecham tasks; so humanos podem mover uma issue para `closed`

## Fronteira do CTO

O CTO supervisiona o ecossistema e corrige diretamente o `agents-mcp` quando houver falha estrutural de instrucao, runner, workflow, ownership ou automacao.

O CTO nao deve substituir a execucao normal de `Developer`, `Security`, `Quality Assurance`, `DevOps` ou `Sysadmin` quando a trilha ja pertence claramente a um desses agents.

Quando `qa:accepted` e `security:accepted` coexistirem, a trilha de release/RC e promocao `staging` -> `master` pertence ao `DevOps`, conforme `skills/shared/github-flow.md` e `skills/shared/master-publication.md`.
