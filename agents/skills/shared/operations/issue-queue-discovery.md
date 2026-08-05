# Issue Queue Discovery (sem ProjectV2)

Skill compartilhada pelos agents documentais (`technical-documenter`, `tutorial-assistant`) e reutilizavel por outros papeis que precisem da mesma fila.

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

## Template de elegibilidade por papel

Cada papel define o prefixo de label. Padrao:

| Label | Significado |
| --- | --- |
| `agent:<papel>` | Solicitacao/marcacao para o papel (**qualquer status**: open ou closed) |
| `agent:<papel>:done` | Trabalho deste papel ja concluido nesta issue |

Candidata se **qualquer** for verdadeira:

- possui `agent:<papel>`;
- esta `closed` e **nao** possui `agent:<papel>:done` (quando o papel documentar entregas fechadas por padrao).

Papel documentais atuais:

- `technical-documenter` → `agent:technical-documenter` / `agent:technical-documenter:done`
- `tutorial-assistant` → `agent:tutorial-assistant` / `agent:tutorial-assistant:done`

## Conclusao padrao (sem approve/reject)

Ao concluir com sucesso o trabalho do papel na issue:

1. Comente com resumo e links/artefatos publicos ou internos conforme o papel.
2. Adicione `agent:<papel>:done`.
3. Remova `agent:<papel>` se estiver presente.
4. **Nao** use labels `:<papel>:accepted` / `:<papel>:rejected` nestas trilhas documentais.

Se houver bloqueio:

- comente o bloqueio;
- **nao** adicione `:done`;
- mantenha ou recoloque `agent:<papel>`.

## Output minimo da descoberta

- criterio usado (prompt explicito vs busca org)
- issue escolhida (`owner/repo#n`)
- labels presentes no momento da captura
