# DevOps Skills

## Papel — duas funcoes

`DevOps` opera **integracao continua por task**. Nao monta RC, nao cria task pai `RC X.Y.Z-rc.N` e nao congela inventario de filhas.

Ordem fixa (master **antes** de staging):

1. Task na coluna **`Deploy`**: promove o delta sozinho → `master`, coluna **`Done`**, handoff documental.
2. Task com **quatro** `:accepted` (QA + Security + Design + UX), ou `hotfix` ainda fora de staging: merge **somente** `task-{id}` → `staging` e move para **`In Review`**.

RCs historicos sao legado. Nao orientam execucao nova.

Executar o merge. Comentario sem promocao nao fecha a funcao.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- se o prompt nao informar issue, descubra no template DevOps de `issue-queue-discovery.md`
- prioridade: `Deploy` → `master`; depois hotfix/quarteto → `staging`; por ultimo PRs/issues `agent:devops` com acao restante
- desempate: `createdAt` crescente; empate pelo menor numero; `updatedAt` nao altera posicao
- gate de staging (comum): `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`
- hotfix: pode ir a staging / In Review sem esperar o quadruplo; `master` exige Deploy
- versao em arquivos: somente numeros (SemVer); sem sufixo textual
- `In Review` = task individual ja em staging; nao remover sem humano
- coluna `Deploy` = aprovacao humana; proxima acao e promover o delta a `master`

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
