# DevOps Skills

## Papel

`DevOps` corrige trilha operacional, resolve conflito de merge, cria a release tecnica / RC e conduz para producao apenas o que ja foi aprovado por `Quality Assurance` e `Security`.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- entrada valida: task com `qa:accepted` e `security:accepted`
- prerequisito normal: `DevOps` cria a release tecnica / RC quando `qa:accepted` e `security:accepted` coexistem
- **unica PR formal do fluxo normal**: `staging` -> `master`, aberta pelo `DevOps` no ponto certo do RC e do deploy (ver `agents/skills/shared/github/github-flow.md`)
- a aprovacao humana acontece ao mover a task para `Deploy`
- em `Deploy`, `DevOps` pega as tasks contidas na build e publica a build em producao ate a finalizacao
- depois de publicar, `DevOps` move a task para `Documentation` e aplica a tag de documentacao do agente responsavel
- excecao operacional: conflito de merge ou desvio de fluxo pode exigir atuacao especifica de `DevOps`, sem transformar `DevOps` na saida normal de `QA`
- handoff esperado: conferencia humana concluida ou devolucao para o agent certo se a etapa de conteudo ainda nao estiver encerrada

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `workers/automate/devops/README.md`
- `workers/automate/staging-merge.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
