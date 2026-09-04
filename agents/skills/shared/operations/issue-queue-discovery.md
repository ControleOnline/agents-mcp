# Issue Queue Discovery

Skill compartilhada pelos agents documentais (`technical-documenter`, `tutorial-assistant`), de revisao (`qa`, `security`), `sysadmin` (modo `resolve`) e reutilizavel por outros papeis que precisem da mesma fila.

## Objetivo

Esta skill define o protocolo de descoberta e captura na fila para quando o prompt **não informar** qual tarefa deve ser executada.

- **Regra primordial:** se o prompt informar a tarefa a ser executada (`owner/repo#issue`, link, número ou escopo direto), o agent deve trabalhar **diretamente nessa tarefa** (validando a elegibilidade do papel), **sem buscar prioridade na fila**.
- **Apenas se o prompt NÃO tiver informado qual a tarefa a ser executada:** o agent deve buscar e selecionar a próxima prioridade na fila seguindo as regras abaixo.
- A fonte primaria da fila sao **issues + labels** (e estado open/closed).
- **QA e Security:** quando buscando na fila, podem selecionar e processar **varias** issues elegiveis na mesma execucao/rodada (cada uma com decisao e comentario completos).
- **Demais papeis** (Developer, DevOps, Manager board, Documentacao, etc.): selecionar **exatamente uma** issue elegivel por execucao quando buscando na fila, salvo prompt ou fonte canonica do papel que ordene o contrario.

## ProjectV2

- **Nao e proibido** usar GitHub Projects (ProjectV2).
- **Prefira nao usar** ProjectV2 quando labels e busca de issues bastarem (fila, elegibilidade, handoff).
- Use ProjectV2 quando for preciso: associar issue recem-criada ao board, ler status/coluna complementar, ou quando o prompt pedir explicitamente.
- Projeto operacional padrao da org: [ControleOnline Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1) (`organization` `ControleOnline`, `number` `1`).

## Associacao obrigatoria ao Project #1 (hands-on — todos os agents)

**Regra transversal e hands-on:** todo agent do ecossistema e **obrigado** a manter **issues e PRs** no **Project #1**.

Sempre que um agent **criar** uma issue/task **ou** abrir/atuar em uma PR:

1. Crie a issue no repositorio adequado (ou identifique a PR).
2. **Associe-a imediatamente** ao projeto `https://github.com/orgs/ControleOnline/projects/1/views/1`.
3. Defina o Status do item no board (`Ready` na entrada padrao, ou a coluna coerente com o estado real).
4. Aplique as labels `agent:*` necessarias.
5. **Label de página:** se a criação for a partir de erro/relato com URL ou tela identificável, aplique na mesma hora a label com o slug da página.

Regras adicionais:

- Issue ou PR **sem** item no Project #1 e desvio operacional: associar na mesma rodada.
- **Todas** as PRs `open` do escopo entram nessa regra.
- Falha de permissao/API ao associar **nao e silenciosa**: comente a falha objetiva.
- Manager em P6 (higiene) audita itens soltos, mas isso **nao dispensa** a obrigacao hands-on dos demais agents.

## Outras regras

- Nao processe mais de uma issue na mesma execucao **exceto QA e Security** (salvo fonte canonica que ordene o contrario).
- O agent pode **criar labels** oficiais ausentes no repositorio.

## Filtro obrigatorio de coluna (fail-closed)

Antes de qualquer candidata:

1. Leia o Status no Project #1.
2. Se for **`Blocked`** ou **`Backlog`**: descarte da fila normal.
3. DevOps considera **In Review** / **Deploy** / **Done** por **task individual**. Nunca varre Blocked/Backlog. Nao monta RC.

## Proibicao: Blocked e Backlog

Issues com Status Project #1 **`Blocked`** ou **`Backlog`** **nao sao candidatas** da fila normal.

## Ownership de colunas por trilha

As colunas **`Ready`** e **`Working`** pertencem exclusivamente ao fluxo de `Developer` e aos validadores (`QA`, `Security`, `Design` e `UX`). Elas nao sao fila de `DevOps`.

`DevOps` opera somente em **`Deploy`**, **`In Review`** e **`Done`**. Uma task com `agent:devops` em `Ready` ou `Working` nao deve ser capturada pelo DevOps.

Para cada papel que usa `Ready`/`Working`, a precedencia e obrigatoria: consultar primeiro todas as candidatas em `Working`; se existir ao menos uma candidata, descartar todas as candidatas em `Ready` nesta rodada; so consultar `Ready` quando `Working` estiver vazio. Labels, tipo, prioridade, `createdAt` e numero da issue so podem ser aplicados depois da filtragem por status.

Bloqueio operacional da rodada (API, conflito, label, board) deve ser resolvido, nao apenas documentado.

## Fonte de verdade da fila

- Issues do GitHub na org `ControleOnline` (ou escopo restrito pelo prompt).
- Labels oficiais do papel + estado da issue + comentarios.
- ProjectV2 como complemento (board).

## Descoberta

1. Se o prompt definir `owner/repo` + numero da issue → trabalhe **diretamente nela**.
2. **Somente se o prompt NAO definir qual tarefa deve ser executada**:
   - busque issues na org `ControleOnline`;
   - complemente com Project #1 se util;
   - filtre pelas regras do papel;
   - **QA/Security:** varias elegiveis; demais papeis: exatamente uma;
   - dentro da mesma prioridade: `createdAt` crescente; empate = menor numero da issue;
   - nunca use `updatedAt` para ordenar; `updatedAt` serve apenas como evidencia de atividade.

## Template de elegibilidade — `Developer`

No Manager esta captura e **P5**.

Candidata se **qualquer** for verdadeira:

1. possui `agent:developer`;
2. esta em `Ready` sem nenhum `agent:*`;
3. esta em `Working` sem nenhum `agent:*`, sem ownership humano exclusivo;
4. possui `agent:qa:rejected`, `agent:security:rejected`, `agent:design:rejected` ou `agent:ux:rejected` e ainda precisa de correcao.

Nao candidata se a revisao ativa ainda pertencer a QA/Security/Design/UX sem decisao, ou a DevOps em Deploy/In Review sem handoff de correcao.

Ordem de prioridade do `Developer` (por **tipo**):

1. `hotfix`
2. `agent:qa:rejected`, `agent:security:rejected`, `agent:design:rejected` ou `agent:ux:rejected`
3. `bug`
4. demais tipos

Desempate: labels `p*`, depois `createdAt` crescente, depois menor numero.

## Template de elegibilidade — papeis documentais

| Label | Significado |
| --- | --- |
| `agent:<papel>` | Solicitacao/marcacao para o papel |
| `agent:<papel>:done` | Trabalho deste papel ja concluido |

Candidata: possui `agent:<papel>`; ou esta `closed` e **nao** possui `agent:<papel>:done`.

Papeis: `technical-documenter`, `tutorial-assistant`.

Conclusao: comentar + `agent:<papel>:done` + remover `agent:<papel>`.

## Template de elegibilidade — papeis de revisao (`qa`, `security`)

Estes papeis **nao alteram codigo**. So analisam e notificam por labels + comentarios.

Candidata se:

1. possui `agent:<papel>` e **ainda nao** tem `:accepted` ou `:rejected`;
2. esta `closed` e **ainda nao** possui a aprovacao daquele papel.

Issue `closed` sem dual-gate QA+Security deve ser reaberta pelo revisor.

Ao aprovar: comentar, `agent:<papel>:accepted`, remover `agent:<papel>` e `:rejected` anterior do mesmo papel.

Ao recusar: comentar, `agent:<papel>:rejected`, remover `agent:<papel>`, manter `open`.

## Template de elegibilidade — `DevOps`

O `DevOps` descobre trabalho sozinho quando o prompt nao informar issue. Opera **CI por task**. **Proibido** montar RC.

No Manager, esta captura é **P1**. Hotfix é **P2** (fora desta ordem). Developer é **P5**. Higiene é **P6**.

Candidata se **qualquer** for verdadeira:

1. publicacao: task na coluna **`Deploy`** (delta individual → `master`);
2. promocao: task **quádruplo-accepted** (QA+Security+Design+UX) ainda fora de `staging` / `In Review`;
3. handoff: issue/PR com **`agent:devops`** e ação de merge restante.

Ordem de prioridade (uma acao por execucao; master **antes** de staging):

1. publicacao em **`Deploy`** → `master`
2. quádruplo-accepted fora de staging / In Review → `staging`
3. PRs/issues com `agent:devops`

`hotfix` → staging não entra nesta captura P1.

Desempate: `createdAt` crescente; empate = menor numero.

`In Review` = task individual em staging. Nao remover da coluna sem autorizacao humana.

Se o nivel 1 estiver vazio, **ai sim** passa ao nivel 2.

## Output minimo da descoberta

- criterio usado (prompt explicito vs busca org)
- issue escolhida (`owner/repo#n`)
- labels e estado no momento da captura
- se reabriu a issue
- se associou ao Project #1
