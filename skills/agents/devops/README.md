# DevOps Skills

## Papel

`DevOps` corrige trilha operacional, resolve conflito de merge, cria a release tecnica e conduz para producao apenas o que ja foi aprovado por `Quality Assurance` e `Security`.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-handoff-governance.md`
- `skills/shared/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- entrada valida: task com `qa:accepted` e `security:accepted`
- prerequisito normal: `DevOps` cria a release tecnica quando `qa:accepted` e `security:accepted` coexistem
- a aprovacao humana acontece ao mover a task para `Deploy`
- em `Deploy`, `DevOps` pega as tasks contidas na build e publica a build em producao ate a finalizacao
- depois de publicar, `DevOps` move a task para `Documentation` e aplica a tag de documentacao do agente responsavel
- excecao operacional: conflito de merge ou desvio de fluxo pode exigir atuacao especifica de `DevOps`, sem transformar `DevOps` na saida normal de `Q.A.`
- handoff esperado: conferencia humana concluida ou devolucao para o agent certo se a etapa de conteudo ainda nao estiver encerrada

## Fontes principais

- `agents/agent/devops/agent.md`
- `automation/devops/base.md`
- `automate/devops/README.md`
- `automate/staging-merge.md`
- `skills/shared/master-publication.md`
