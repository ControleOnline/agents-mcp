# Issue Queue Discovery

Skill compartilhada pelos agents documentais (`technical-documenter`, `tutorial-assistant`), de revisao (`qa`, `security`), `sysadmin` (modo `resolve`) e reutilizavel por outros papeis que precisem da mesma fila.

## Objetivo

A fonte primaria da fila sao **issues + labels** (e estado open/closed).

- **QA e Security:** podem selecionar e processar **varias** issues elegiveis na mesma execucao/rodada (cada uma com decisao e comentario completos).
- **Demais papeis** (Developer, DevOps, Manager board, Documentacao, etc.): selecionar **exatamente uma** issue elegivel por execucao, salvo prompt ou fonte canonica do papel que ordene o contrario.

## ProjectV2

- **Nao e proibido** usar GitHub Projects (ProjectV2).
- **Prefira nao usar** ProjectV2 quando labels e busca de issues bastarem (fila, elegibilidade, handoff).
- Use ProjectV2 quando for preciso: associar issue recem-criada ao board, ler status/coluna complementar, ou quando o prompt pedir explicitamente.
- Projeto operacional padrao da org: [ControleOnline Project #1](https://github.com/orgs/ControleOnline/projects/1/views/1) (`organization` `ControleOnline`, `number` `1`).

## Associacao obrigatoria ao Project #1 (hands-on — todos os agents)

**Regra transversal e hands-on:** todo agent do ecossistema (CTO, Developer, Manager, QA, Security, DevOps, Sysadmin, documentadores e qualquer outro papel) e **obrigado** a manter issues no board operacional. Nao e opcional, nao e so do Manager e nao pode ser adiado para “depois”.

Sempre que um agent **criar** uma issue/task nova:

1. Crie a issue no repositorio adequado.
2. **Associe-a imediatamente** ao projeto `https://github.com/orgs/ControleOnline/projects/1/views/1` (ProjectV2 da org, number `1`).
3. Defina o Status do item no board (`Ready` na entrada padrao, ou a coluna coerente com o estado real se ja houver ownership/etapa).
4. Aplique as labels `agent:*` necessarias.

Regras adicionais (todos os agents):

- Issue **sem** item no Project #1 e desvio operacional: o agent que a criar, capturar ou mutar deve **associar na mesma rodada**.
- Falha de permissao/API ao associar **nao e silenciosa**: comente na issue a falha objetiva e tente de novo quando houver permissao; a issue nao deve permanecer “solta” sem tentativa de vinculo registrada.
- Manager em P5 (higiene) audita e corrige issues soltas, mas isso **nao dispensa** a obrigacao hands-on dos demais agents na criacao/captura.


## Outras regras

- Nao processe mais de uma issue na mesma execucao **exceto QA e Security** (e salvo prompt ou fonte canonica do papel que ordene o contrario).
- O agent pode **criar labels** oficiais ausentes no repositorio.

## Fonte de verdade da fila

- Issues do GitHub na org `ControleOnline` (ou escopo restrito pelo prompt).
- Labels oficiais do papel + estado da issue + comentarios.
- ProjectV2 como complemento (board), nao como unico criterio quando labels bastam.

## Descoberta

1. Se o prompt definir `owner/repo` + numero da issue → trabalhe **somente** nela (ainda assim valide elegibilidade do papel).
2. Se o prompt **nao** definir issue/repositorio:
   - busque issues em **todos** os repositorios da org `ControleOnline` (preferencialmente por label/estado);
   - se util, complemente com itens do Project #1;
   - filtre pelas regras de elegibilidade do papel;
   - **QA/Security:** pode escolher **varias** elegiveis (ordenar por prioridade e `updated`); demais papeis: escolha **exatamente uma**;
   - aplique primeiro as prioridades funcionais definidas pelo pipeline e pelo papel;
   - dentro da mesma prioridade, selecione a issue elegivel mais antiga por `createdAt` crescente;
   - em empate de `createdAt`, selecione o menor numero da issue;
   - nunca use `updatedAt` para reposicionar trabalho: comentarios, labels ou atividade recente nao fazem uma task ultrapassar outra mais antiga da mesma prioridade.

## Template de elegibilidade — `Developer`

O `Developer` deve descobrir trabalho sozinho quando a issue nao vier no prompt. Nao peca ao usuario para escolher uma issue se o GitHub/Project #1 puder ser consultado.

Este template e exclusivo do fluxo paralelo do `Developer`. O Full Pipeline / Manager nao usa esta fila para capturar implementacao; ele apenas corrige desvios de governanca quando chegar na etapa de higiene.

Fonte primaria:

- issues `open` na org `ControleOnline`;
- labels de ownership/estado;
- Project #1 como complemento para coluna/status (`Ready` e `Working`).

Candidata se **qualquer** for verdadeira:

1. possui `agent:developer`;
2. esta em `Ready` sem nenhum `agent:*` (entrada padrao do fluxo);
3. esta em `Working` sem nenhum `agent:*`, quando nao houver evidencia de ownership humano exclusivo;
4. possui `qa:rejected` ou `security:rejected` e ainda precisa de correcao pelo Developer.

Nao candidata se houver decisao/revisao ativa que ainda pertenca a `QA`, `Security` ou `DevOps` (por exemplo, aguardando aceite/recusa com `agent:qa`, `agent:security` ou pacote de RC).

Ordem de prioridade do `Developer`:

1. `hotfix`
2. `qa:rejected` ou `security:rejected`
3. `bug`
4. labels de prioridade `p0`, `p1`, `p2`, … (menor número = maior prioridade; ex.: `p0` antes de `p1`)
5. demais tipos (`enhancement`, `feature` ou sem tipo)

Dentro do mesmo nível de prioridade acima, selecione a issue elegivel mais antiga por `createdAt` crescente; em empate de `createdAt`, selecione o menor numero da issue. `updatedAt` nao altera a posicao. Labels `p0`/`p1`/`p2`/… podem ser criadas pelo agent quando ausentes. Se nenhuma issue elegivel existir, registre o criterio de busca e pare com bloqueio objetivo.

## Template de elegibilidade — papeis documentais

| Label | Significado |
| --- | --- |
| `agent:<papel>` | Solicitacao/marcacao para o papel (**qualquer status**) |
| `agent:<papel>:done` | Trabalho deste papel ja concluido nesta issue |

Candidata se **qualquer** for verdadeira:

- possui `agent:<papel>`;
- esta `closed` e **nao** possui `agent:<papel>:done`.

Papeis: `technical-documenter`, `tutorial-assistant`.

Conclusao documental: comentar + `agent:<papel>:done` + remover `agent:<papel>`. Sem `accepted`/`rejected`.

## Template de elegibilidade — papeis de revisao (`qa`, `security`)

Estes papeis **nao alteram codigo**, branches, PRs nem arquivos de produto. So analisam e **notificam por labels + comentarios**.

| Label | Significado |
| --- | --- |
| `agent:qa` / `agent:security` | Solicitacao explicita de revisao (**qualquer status**) |
| `qa:accepted` / `security:accepted` | Revisao aprovada; trabalho daquele papel **encerrado** nesta passagem |
| `qa:rejected` / `security:rejected` | Revisao recusada; trabalho daquele papel **encerrado** nesta passagem |

Candidata para o papel se **qualquer** for verdadeira:

1. possui `agent:<papel>` e **ainda nao** tem decisao final daquele papel (`:accepted` ou `:rejected`);
2. esta `closed` e **ainda nao** possui a aprovacao daquele papel (`qa:accepted` ou `security:accepted` respectivamente).

Notas:

- `rejected` **encerra** o trabalho do revisor naquela passagem (nao fica em loop infinito na mesma evidencia).
- Issue `closed` **sem** `qa:accepted` **e** `security:accepted` e ilegal no fluxo: o revisor que a capturar deve **reabrir** a issue antes ou durante a analise.
- Uma tarefa so pode permanecer `closed` com as **duas** aprovacoes: `qa:accepted` **e** `security:accepted`.

### Gate dual (fechamento)

| Estado da issue | Labels de aprovacao | Acao do revisor |
| --- | --- | --- |
| `closed` | falta `qa:accepted` e/ou `security:accepted` | **Reabrir** a issue, analisar, decidir por labels |
| `closed` | tem `qa:accepted` **e** `security:accepted` | Nao e candidata por fechamento indevido |
| `open` | tem `agent:qa` / `agent:security` sem decisao | Analisar e decidir |

### Conclusao da revisao

Ao **aprovar**:

1. Comente resumo objetivo + checklist atendido (quando couber).
2. Adicione `qa:accepted` ou `security:accepted`.
3. Remova `agent:qa` ou `agent:security` se presente.
4. Remova eventual `:rejected` anterior do **mesmo** papel se estiver reavaliando apos correcao.

Ao **recusar**:

1. Comente motivos objetivos + checklist nao atendido.
2. Adicione `qa:rejected` ou `security:rejected`.
3. Remova `agent:qa` ou `agent:security` se presente.
4. Garanta que a issue fique **open** (reabra se estiver closed) para o Developer atuar.

Em ambos os casos o trabalho **daquele agent** naquela passagem termina. Nao mexa em codigo.

## Template de elegibilidade — `DevOps`

O `DevOps` descobre trabalho sozinho quando o prompt nao informar issue. Alem do pipeline de **RC**, deve capturar handoffs marcados com `agent:devops` (incluindo **PRs soltas** encaminhadas pela higiene do Manager).

Fonte primaria:

- issues `open` na org `ControleOnline` (ou escopo do prompt);
- labels `agent:devops`, estado de RC / dual-accepted / coluna Deploy;
- Project #1 como complemento (In Review, Deploy, Ready/Working);
- PRs abertas vinculadas a issues com `agent:devops` (ou mencionadas no handoff).

Candidata se **qualquer** for verdadeira:

1. publicacao: task pai de RC (ou hotfix elegivel) na coluna **`Deploy`** com aprovacao humana;
2. RC aberto: desvio corrigivel de board/freeze/staging (pai/filhas fora de alinhamento);
3. montagem de RC: existe dual-accepted (`agent:qa:accepted` + `agent:security:accepted`) limpo e **nenhum** RC aberto;
4. handoff DevOps: issue com label **`agent:devops`** (ex.: PR solta com ou sem historico de task; decisao de merge/alinhar fluxo/fechar PR).

Nao candidata se a acao pertencer exclusivamente a Developer/QA/Security sem handoff DevOps, ou se o unico bloqueio for gate humano de Deploy ja documentado sem acao executavel pelo agent.

Ordem de prioridade do `DevOps` (uma issue/acao por execucao, salvo fonte canonica que permita lote no mesmo RC):

1. `hotfix` / publicacao em **`Deploy`** (acao executavel)
2. RC aberto (alinhar board, freeze, staging, promocao quando aplicavel)
3. montar novo RC (dual-accepted limpo, sem RC aberto)
4. issues com `agent:devops` (PRs soltas e demais handoffs) — tratar a PR vinculada na mesma passagem

Dentro do mesmo nivel, selecione a issue elegivel mais antiga por `createdAt` crescente; em empate, menor numero da issue. `updatedAt` nao altera a posicao.

Ao capturar issue `agent:devops` ligada a PR solta:

1. leia issue + PR + comentarios de handoff;
2. **decida** com acao objetiva: merge no fluxo permitido, alinhar branches/labels/board, ou **fechar** a PR com justificativa;
3. atualize labels/Status no Project #1; remova ou conclua o handoff `agent:devops` quando a decisao estiver executada e documentada;
4. nao deixe a PR/issue sem comentario de evidencias.

## Output minimo da descoberta

- criterio usado (prompt explicito vs busca org; se usou ProjectV2)
- issue escolhida (`owner/repo#n`)
- labels e estado (`open`/`closed`) no momento da captura
- se reabriu a issue (sim/nao)
- se a issue foi associada ao Project #1 (ao criar)
