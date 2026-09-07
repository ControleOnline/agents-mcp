# Developer Skills

## Papel

`Developer` executa a mudanca em issues elegiveis: branch a partir de `master`, merge final em **`dev`** (sem PR).

No Full Pipeline / Manager este papel e a **Prioridade 5**. Higiene e P6.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/quality/code-quality.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/quality/task-completion-criteria.md`
- `agents/skills/shared/github/github-flow.md`

## Ownership

- se o prompt nao informar issue, descubra a proxima prioridade no GitHub; **nao peca ao usuario para escolher a issue**
- leitura de backlog: issues abertas com ownership de `Developer` (`agent:developer`) ou entrada padrao em `Ready`/`Working` sem `agent:*`, sem pendencia ativa de QA/Security/Design/UX que pertenca aos revisores
- prioridade por **tipo**: `hotfix` → recusas QA/Security/Design/UX → `bug` → demais (`enhancement`/`feature`/sem tipo)
- desempate **dentro de cada tipo**: `p0` → `p1` → `p2` → … (sem `p*` por ultimo) → depois `createdAt` crescente → menor numero da issue; `updatedAt` nao altera a posicao
- branch permitida: apenas `task-{id_issue}` derivada de **`master`**
- branches proibidas para trabalho direto: `master`, `main`, `dev`, `staging` e qualquer outra fora da task
- **PR proibida** no fluxo normal
- destino da entrega: **merge `task-{id}` → `dev`** (nao `staging`)

## Regras de execucao

- siga `agents/skills/shared/github/github-flow.md`
- investigacao com acao segura no escopo → implemente na mesma rodada
- handoff por labels `agent:qa` + `agent:security` + `agent:design` + `agent:ux` e evidencia, **nao por PR**
- apos merge em `dev`, a revisao dos validadores usa essa evidencia
- recusa: corrigir na mesma `task-{id}` e re-mergear em `dev`
- fila inicial `Ready`; apos captura permanece em `Working` ate os validadores concluirem
- qualquer alteracao local exige entrega/publicacao antes do handoff; listar todos os projetos principais e submodulos afetados, confirmar cada checkout contra `origin/master` e deixar staged/unstaged/untracked vazio. Branch de task ou integracao mantida por necessidade do fluxo deve ser declarada com SHA/ref remoto e nao conta como alinhamento a `origin/master`.

## Checklist obrigatório de fluxo publicado

Quando a issue tocar UI, browser ou smoke, antes do handoff o Developer deve:

- declarar no topo de **cada arquivo de código da jornada tocado** `fluxo: <id> | etapa: <id>`;
- colocar no mesmo topo o link da página wiki publicada do fluxo;
- no smoke, o vínculo pode ser declarado somente no manifesto JSON gerado, usando `wikiPage` como primeiro campo e declarando `fluxo`, `wikiFlow`, `steps` e prints por etapa;
- devolver a entrega se algum arquivo de código aplicável ou manifesto não tiver fluxo, etapa ou link wiki identificável.

## Fontes principais

- `agents/roles/developer/agent.md`
- `workers/automation/developer/base.md`
- `agents/skills/shared/github/github-flow.md`
