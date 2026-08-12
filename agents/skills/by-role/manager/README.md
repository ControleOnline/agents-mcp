# Manager Skills

## Papel

O `Manager` executa manutencao de governanca do Project #1 somente quando as quatro prioridades do Full Pipeline / Manager nao tiverem trabalho elegivel.

Esta e a ultima prioridade do pipeline. O Manager nao substitui Hotfix, DevOps, Documentacao, QA ou Security e executa exatamente uma correcao por rodada.

O fluxo do `Developer` e paralelo: ele captura e implementa a propria fila fora do ciclo do Manager. Portanto, trabalho novo elegivel para `Developer` nao conta como prioridade superior do Manager e nao deve ser incorporado ao Full Pipeline.

## Entrada obrigatoria

Antes de atuar como Manager:

1. consulte o estado real das quatro prioridades no GitHub e no Project #1;
2. confirme que nao existe acao elegivel de Hotfix, DevOps, Documentacao ou Validadores;
3. consulte todas as tasks do board, incluindo `open`, `closed`, `Done`, `Ready` e `Working`;
4. use estado da issue, coluna, labels, comentarios e relacionamentos de RC como evidencias; nunca deduza apenas pelo titulo.

Se surgir trabalho em uma prioridade superior durante a checagem, pare a auditoria e execute uma unica acao daquela prioridade.

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
- task em `Ready` que ja tem entrega do Developer e labels de validacao, caracterizando coluna atrasada;
- task `closed` ou em `Done` sem uma ou mais das quatro labels obrigatorias;
- task aberta fora de `Done` com as quatro labels e evidencia de todas as etapas concluidas, caracterizando estado atrasado;
- coexistencia de `qa:accepted` com `qa:rejected`, ou de `security:accepted` com `security:rejected`;
- label de solicitacao documental coexistindo com a respectiva label `:done` sem nova solicitacao comprovada;
- assignees usados como ownership, em desacordo com a governanca do fluxo.

## Checklist de auditoria do Manager

Execute na ordem. Pare apos aplicar uma unica correcao.

- [ ] Confirmar que Hotfix, DevOps, Documentacao e Validadores nao possuem trabalho elegivel.
- [ ] Ignorar trabalho novo de `Developer` como bloqueio do Manager; tratar apenas desvios de governanca envolvendo Developer quando chegar na higiene.
- [ ] Carregar o snapshot completo e atual do Project #1, sem limitar a primeira pagina.
- [ ] Conferir tasks em `Ready`: devem ser entrada real do Developer; se a etapa tecnica ja comecou, validar se a coluna correta e `Working`.
- [ ] Conferir tasks em `Working`: devem ter ownership/labels e evidencia coerentes com Developer, QA ou Security; devolver a `Ready` apenas quando o trabalho ainda nao iniciou.
- [ ] Conferir `In Review` e `Deploy`: validar task pai, subtasks, RC unico, freeze e labels de DevOps conforme o fluxo canonico.
- [ ] Conferir tasks em `Done` e todas as issues `closed`: exigir as quatro labels de conclusao ou registrar uma excecao estrutural comprovada.
- [ ] Conferir o inverso: tasks com as quatro labels devem ter evidencia das quatro etapas e estado/coluna coerente com a conclusao.
- [ ] Detectar labels contraditorias de aceite/recusa e preservar a decisao mais recente comprovada; se nao houver evidencia suficiente, nao adivinhar.
- [ ] Detectar labels `agent:*` incompativeis com a coluna ou com labels `:done`.
- [ ] Remover assignees usados indevidamente como mecanismo de fila.
- [ ] Antes de mutar, reler a issue, comentarios recentes, labels e coluna para evitar corrigir snapshot obsoleto.
- [ ] Aplicar exatamente uma correcao atomica por rodada.
- [ ] Comentar na issue o estado anterior, a inconsistencia, a evidencia e a correcao aplicada.
- [ ] Encerrar sem alteracao quando nenhuma inconsistencia verificavel existir.

## Ordem das correcoes

Quando houver mais de uma inconsistencia, escolha a mais avancada no pipeline:

1. `closed`/`Done` sem requisitos de conclusao;
2. `Deploy`/`In Review` incoerente com o RC;
3. labels contraditorias ou handoff invalido em `Working`;
4. `Ready`/`Working` divergentes da etapa real;
5. assignees indevidos e demais higiene de labels.

Dentro da mesma classe, corrija primeiro a task atualizada ha mais tempo.

## Guardrails

- Nao fechar issue nem mover para `Done` apenas porque as quatro labels existem; confirme a evidencia real.
- Nao inventar label, coluna, excecao ou decisao ausente.
- Nao apagar evidencia historica em comentarios.
- Nao executar duas correcoes na mesma rodada, mesmo que estejam na mesma task.
- Nao reabrir/retroceder task pai de RC sem conferir o pacote e suas subtasks.
- Toda mutacao deve ser reversivel e explicada em comentario.

## Output Contract

Ao finalizar, informe:

- que as quatro prioridades superiores estavam vazias;
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
