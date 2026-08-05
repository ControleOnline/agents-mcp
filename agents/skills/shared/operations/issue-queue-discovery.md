# Issue Queue Discovery (sem ProjectV2)

Skill compartilhada pelos agents documentais (`technical-documenter`, `tutorial-assistant`), de revisao (`qa`, `security`) e reutilizavel por outros papeis que precisem da mesma fila.

## Objetivo

Selecionar **exatamente uma** issue elegivel por execucao, sem depender de ProjectV2.

## Proibicoes

- Nao use ProjectV2 como fonte de fila, status, coluna ou handoff.
- Nao processe mais de uma issue na mesma execucao.

## Fonte de verdade

- Issues do GitHub na org `ControleOnline` (ou escopo restrito pelo prompt).
- Labels oficiais do papel + estado da issue + comentarios.
- O agent pode **criar labels** oficiais ausentes no repositorio.

## Descoberta

1. Se o prompt definir `owner/repo` + numero da issue → trabalhe **somente** nela (ainda assim valide elegibilidade do papel).
2. Se o prompt **nao** definir issue/repositorio:
   - busque issues em **todos** os repositorios da org `ControleOnline`;
   - filtre pelas regras de elegibilidade do papel;
   - escolha **exatamente uma**;
   - priorize por `updated` mais recente, salvo ordem explicita no prompt.

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

## Output minimo da descoberta

- criterio usado (prompt explicito vs busca org)
- issue escolhida (`owner/repo#n`)
- labels e estado (`open`/`closed`) no momento da captura
- se reabriu a issue (sim/nao)
