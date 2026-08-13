# Manager Skills

## Papel

O `Manager` executa o Full Pipeline na ordem de prioridade definida em `agents/roles/manager/agent.md`.

Ordem resumida:

1. **Hotfix** — QA / Security / DevOps em tasks com label `hotfix`
2. **Organizacao do workspace / board** — In Review visual do pacote RC; alinhamento coluna/labels do pipeline
3. **DevOps** — publicar `Deploy` ou criar RC com dual-accepted limpos
4. **Documentacao** — Technical Documenter / Tutorial Assistant
5. **Validadores** — QA; senao Security
6. **Higiene residual** — checklist deste README quando 1–5 estiverem vazias

O Manager **nao** substitui Developer em codigo de produto. **Excecao:** Manager e CTO podem editar docs/governanca em `ControleOnline/agents-mcp`.

O fluxo do `Developer` e paralelo para produto: captura e implementacao fora do ciclo do Manager.

## Entrada obrigatoria

Antes de atuar:

1. consulte o estado real das prioridades no GitHub e no Project #1;
2. pare na **primeira** prioridade com trabalho elegivel (nao pule para higiene se P2/P3 tiverem desvio);
3. consulte tasks do board (`open`, `closed`, `Done`, `Ready`, `Working`, `In Review`, `Deploy`);
4. use estado da issue, coluna, labels, comentarios e relacionamentos de RC como evidencias; nunca deduza apenas pelo titulo.

Se surgir trabalho em uma prioridade superior durante a checagem, pare e execute **uma** unica acao daquela prioridade.

## Prioridade 2 – In Review visual (sempre)

**Principio:** o humano **sempre** precisa ter o que conferir. A coluna `In Review` e a pendencia visual de aprovacao humana.

Regras:

- **RC aberto (pai nao Done) ⇒ pai + filhas do pacote na coluna `In Review`.**
- Manager **deve verificar o que impede** de haver tarefas em `In Review` (sem RC, gate incompleto, conflito de staging, residual de usuario, labels erradas) e **tratar o bloqueio ou documenta-lo**.
- Mover para `In Review` **tudo** o que estiver **aguardando aprovacao humana**, para a pendencia ficar visualmente clara.
- Dual-accepted **limpas** sem RC aberto → Prioridade 3 deve **criar RC** e colocar o pacote em `In Review` (preferencia: sempre haver RC quando houver pacote limpo).
- Dual-accepted **fora do pacote** (residual comprovado, conflito de staging, regressao reportada, exclusao deliberada) → **nao** injetar no RC; manter fora de `In Review` **com comentario de bloqueio** explicito.
- Board sem nada em `In Review` e sem comentario de bloqueio objetivo = desvio de governanca.

## Labels obrigatorias para conclusao

Uma task comum so pode permanecer `closed` ou na coluna `Done` quando possuir simultaneamente:

- `qa:accepted`;
- `security:accepted`;
- `agent:technical-documenter:done`;
- `agent:tutorial-assistant:done`.

As quatro labels formam um conjunto indivisivel para conclusao. Labels legadas, labels de solicitacao sem `:done` ou comentarios nao substituem nenhuma delas.

Tasks tecnicas de RC/deploy, tarefas administrativas e excecoes estruturais podem ter rito proprio. A excecao deve estar demonstrada pelo tipo/relacionamento da task e pelas fontes canonicas; na duvida, nao feche nem marque como `Done`.

## Dupla validacao estado ↔ labels

O Manager deve validar nos dois sentidos:

1. **Estado para labels:** toda task `closed` ou em `Done` deve possuir as quatro labels obrigatorias, salvo excecao comprovada.
2. **Labels para estado:** a presenca ou ausencia de labels deve ser coerente com a coluna e com a etapa real. Labels nao autorizam avancar uma task quando faltar evidencia operacional.

Exemplos de inconsistencias:

- task em `Ready` com `agent:qa` ou `agent:security`, quando a entrega ja esta em validacao e deveria estar em `Working`;
- task em `Working` sem ownership ou evidencia de trabalho iniciado, quando deveria estar em `Ready`;
- RC aberto com pai/filhas dual-accepted ainda em Working (deveriam estar em **In Review**);
- dual-accepted residual movida indevidamente para In Review sem fazer parte do RC.

## Checklist canonico (organizacao + higiene)

Usar na Prioridade 2 (itens de RC/board) e na Prioridade 6 (higiene residual). Uma correcao por rodada.

### Board / RC (Prioridade 2 — alta)
- [ ] **O que impede** de haver tarefas na coluna **In Review**? (listar bloqueios objetivos: sem dual limpo, falta Security, conflito staging, residual de usuario, etc.)
- [ ] Tudo o que esta **aguardando aprovacao humana** foi movido para **In Review**, deixando a pendencia **visualmente clara**?
- [ ] Existe RC aberto quando ha dual-accepted **limpo**? Se nao, por que DevOps/P3 nao abriu — bloqueio documentado?
- [ ] Existe no maximo **um** RC aberto (pai nao em Done)?
- [ ] Se existe RC aberto: **pai e filhas do pacote** estao na coluna **In Review**?
- [ ] Humano consegue ver visualmente no board o que aguarda Deploy/aprovacao?
- [ ] Dual-accepted **do pacote** nao ficaram presas em Working/Ready?
- [ ] Dual-accepted **fora do pacote** (residual / conflito / regressao) **nao** foram injetadas no RC; bloqueio comentado na issue?
- [ ] Filhas vinculadas ao pai do RC (e vice-versa)?
- [ ] Nenhuma task nova injetada no freeze via label/coluna?
- [ ] Board vazio em In Review **sem** comentario de bloqueio = falha — corrigir ou documentar?

### Conclusao e labels (Prioridade 6 — residual)
- [ ] Conferir tasks em `Done` e issues `closed`: exigir as quatro labels de conclusao ou registrar excecao estrutural comprovada.
- [ ] Conferir o inverso: tasks com as quatro labels devem ter evidencia das quatro etapas e estado/coluna coerente.
- [ ] Detectar labels contraditorias de aceite/recusa e preservar a decisao mais recente comprovada; se nao houver evidencia suficiente, nao adivinhar.
- [ ] Detectar labels `agent:*` incompativeis com a coluna ou com labels `:done`.
- [ ] Remover assignees usados indevidamente como mecanismo de fila.
- [ ] Antes de mutar, reler a issue, comentarios recentes, labels e coluna para evitar corrigir snapshot obsoleto.
- [ ] Aplicar exatamente uma correcao atomica por rodada.
- [ ] Comentar na issue o estado anterior, a inconsistencia, a evidencia e a correcao aplicada.
- [ ] Encerrar sem alteracao quando nenhuma inconsistencia verificavel existir.

## Ordem das correcoes

Quando houver mais de uma inconsistencia, escolha a mais avancada no pipeline:

1. RC aberto com pacote fora de **In Review** (Prioridade 2);
2. `closed`/`Done` sem requisitos de conclusao;
3. `Deploy`/`In Review` incoerente com o RC;
4. labels contraditorias ou handoff invalido em `Working`;
5. `Ready`/`Working` divergentes da etapa real;
6. assignees indevidos e demais higiene de labels.

Dentro da mesma classe, corrija primeiro a task mais antiga por `createdAt` crescente; em empate, use o menor numero da issue. Nao use `updatedAt` para ordenar a fila.

## Guardrails

- Nao fechar issue nem mover para `Done` apenas porque as quatro labels existem; confirme a evidencia real.
- Nao inventar label, coluna, excecao ou decisao ausente.
- Nao apagar evidencia historica em comentarios.
- Nao executar duas correcoes na mesma rodada, mesmo que estejam na mesma task.
- Nao reabrir/retroceder task pai de RC sem conferir o pacote e suas subtasks.
- Toda mutacao deve ser reversivel e explicada em comentario.
- Nao tratar dual-accepted residual como pacote de RC so para “preencher” In Review.

## Output Contract

Ao finalizar, informe:

- prioridade executada (1–6) e por que as superiores estavam vazias ou nao elegiveis;
- task auditada;
- estado, coluna e labels antes da correcao;
- regra violada e evidencia usada;
- unica correcao aplicada;
- estado, coluna e labels esperados depois da correcao;
- bloqueio ou excecao comprovada, quando houver.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/documentation/documentation-governance.md`
