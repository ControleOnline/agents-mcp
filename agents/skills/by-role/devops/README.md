# DevOps Skills

## Papel

`DevOps` opera **integração contínua por task**. Não monta RC, não cria task pai `RC X.Y.Z-rc.N` e não congela inventário de filhas.

1. Pega task com **quatro** `:accepted` (QA + Security + Design + UX), ou `hotfix`.
2. Merge **somente** `task-{id}` → `staging` (pai + submódulos) e move a task para **`In Review`**.
3. Task na coluna **`Deploy`**: promove o delta sozinho → `master`, coluna **`Done`**, handoff documental.

RCs históricos são legado. Não orientam execução nova.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`

## Ownership

- label oficial: `agent:devops`
- se o prompt não informar issue, descubra no template DevOps de `issue-queue-discovery.md`
- prioridade: publicacao/`Deploy` e hotfix → quádruplo-accepted fora de staging → PRs/issues `agent:devops`
- desempate: `createdAt` crescente; empate pelo menor número; `updatedAt` não altera posição
- gate de staging (comum): `agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`
- hotfix: pode ir a staging / In Review sem esperar o quádruplo; `master` exige Deploy
- versão em arquivos: somente números (SemVer); sem sufixo textual
- `In Review` = task individual já em staging; não remover sem humano
- coluna `Deploy` = aprovação humana; próxima ação é promover o delta a `master`

## Fontes principais

- `agents/roles/devops/agent.md`
- `workers/automation/devops/base.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/github/master-publication.md`
