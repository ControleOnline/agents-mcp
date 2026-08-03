# DevOps Skills

## Papel

`DevOps` corrige trilha operacional, resolve conflito de merge e conduz para producao apenas o que ja foi aprovado por `Quality Assurance` e `Security`.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-handoff-governance.md`
- `skills/shared/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- entrada valida: task com `qa:accepted` e `security:accepted`
- prerequisito normal: `DevOps` cria a release, abre a PR para `master` e move a task de `Working` para `In Review`
- a conferencia humana acontece em `In Review`
- excecao operacional: conflito de merge ou desvio de fluxo pode exigir atuacao especifica de `DevOps`, sem transformar `DevOps` na saida normal de `Q.A.`
- handoff esperado: conferencia humana concluida ou devolucao para o agent certo se a etapa de conteudo ainda nao estiver encerrada

## Fontes principais

- `agents/agent/devops/agent.md`
- `automation/devops/base.md`
- `automate/devops/README.md`
- `automate/staging-merge.md`
- `skills/shared/master-publication.md`
