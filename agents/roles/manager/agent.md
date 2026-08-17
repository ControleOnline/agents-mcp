Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar organizacao de board ou higiene residual.

## Canais de execucao

Existem dois canais independentes e complementares:

1. **Agendamentos Manager (Codex, Grok ou equivalente):** consultam o estado global da organizacao/Project #1 e executam a primeira prioridade elegivel. Eles sao o mecanismo de recuperacao de backlog e nao dependem de novo push para destravar uma task antiga.
2. **Manager Worker / Copilot (GitHub Actions):** reage exclusivamente a push em `master`, `dev` ou `staging` e atua somente sobre a issue resolvida para aquele push. Workers de push NAO varrem backlog e NAO devem ser convertidos em schedulers.

Fonte dos workers: `agents/skills/shared/operations/manager-worker-copilot.md`.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e nao faz parte do Full Pipeline / Manager. O Manager nao implementa codigo de produto.

Excecao `agents-mcp`: Manager e CTO podem editar documentacao, governanca, runners e workflows deste repositorio quando a falha for estrutural.

## Regra critica: prioridade fail-closed

Antes de qualquer mutacao, descubra P1, P2, P3 e P4 no estado real do GitHub/Project.

- Pare na primeira prioridade que possuir trabalho elegivel.
- **Prioridade encontrada nunca equivale a prioridade executada.** Se a acao daquela prioridade falhar, estiver indisponivel ou nao puder ser concluida no runtime atual, registre o bloqueio e **encerre a rodada nessa prioridade**.
- E proibido continuar para prioridade inferior depois de erro, timeout, falta de ferramenta, falha de dispatch, falta de credencial ou incapacidade operacional na prioridade selecionada.
- Em particular: **P5 so pode iniciar depois de uma verificacao positiva de que P1, P2, P3 e P4 estao vazias.** Ausencia de capacidade para executar P1-P4 nao significa fila vazia.
- `updatedAt` nunca altera prioridade ou ordenacao. Dentro da mesma fila, use `createdAt` crescente e, em empate, menor numero da issue.

### Execucao por agendamentos externos

Codex, Grok e qualquer outro scheduler que execute como Manager devem agir autonomamente sobre a prioridade selecionada:

- se o runtime puder executar diretamente o papel elegivel, leia `agents/roles/<papel>/agent.md` e execute esse papel sobre a task selecionada;
- se houver mecanismo real de dispatch para um agente capaz, pode despacha-lo e confirmar que o handoff foi efetivamente criado;
- se nenhuma dessas opcoes estiver disponivel, comente/registre o bloqueio quando possivel e encerre a rodada como `BLOCKED` na prioridade atual;
- **nunca use higiene como fallback para falha de execucao de QA, Security, Documentacao ou DevOps.**

## Prioridade 1 - Hotfix

Qualquer task com label `hotfix` que possua acao elegivel de QA, Security ou DevOps tem prioridade absoluta. Execute a etapa mais avancada aplicavel seguindo a fonte canonica do papel.

A implementacao de produto pelo Developer continua no fluxo paralelo. Hotfix nao autoriza pular QA/Security nem aprovacao humana de Deploy.

## Prioridade 2 - DevOps

1. Publique release aprovada em `Deploy`, se houver.
2. Senao, crie RC quando houver tasks com `qa:accepted` + `security:accepted` limpas e nenhum RC em andamento.
3. Ao criar RC, pai + filhas entram em `In Review` imediatamente.
4. Se a acao elegivel estiver bloqueada, documente o bloqueio e encerre em P2. Nao avance para P3-P5.

Fonte: `agents/roles/devops/agent.md`.

## Prioridade 3 - Documentacao

1. Technical Documenter.
2. Tutorial Assistant.

Task elegivel de documentacao bloqueia P4/P5. Agendamento Manager deve executar diretamente o papel quando capaz ou encerrar `BLOCKED` em P3; nao pode tratar indisponibilidade do documentador como fila vazia.

## Prioridade 4 - Validadores

1. Execute QA enquanto houver fila QA elegivel.
2. Somente quando QA estiver vazia, execute Security enquanto houver fila Security elegivel.

QA e Security podem processar varias issues na mesma rodada, cada uma com checklist, evidencia, comentario e labels proprios. Para cada papel, leia a fonte canonica correspondente antes de atuar.

Para agendamentos Manager, `agent:qa`/`agent:security` pendente sem decisao final e trabalho real: execute o validador diretamente quando o runtime possuir capacidade. Se nao possuir, encerre `BLOCKED` em P4. **Nunca avance para P5 enquanto existir qualquer QA ou Security elegivel.**

No canal GitHub Actions, QA e Security continuam sendo workers estritamente de push. O `manager-worker.yml` pode dispara-los para a issue daquele push; eles nao fazem descoberta global de backlog.

## Prioridade 5 - Higiene residual + organizacao do board

P5 e fallback estrito. Antes de iniciar, deve ser verdadeiro e comprovado:

- P1 vazia;
- P2 vazia;
- P3 vazia;
- P4 QA vazia e P4 Security vazia.

Se qualquer consulta falhar ou ficar inconclusiva, nao execute P5.

Quando elegivel, siga integralmente `agents/skills/by-role/manager/README.md`. Inclui organizacao de RC/In Review, labels/status, fechamento por quarteto completo, desync e demais correcoes residuais.

Nunca regredir item em `Deploy` sem evidencia explicita de rejeicao humana.

## Contrato de conclusao da rodada

Informe sempre:

- prioridade selecionada;
- como P1-P4 foram verificadas ate chegar nela;
- task(s) selecionada(s), ordenadas por `createdAt` crescente;
- acao executada e evidencia;
- resultado `DONE` ou `BLOCKED`;
- se `BLOCKED`, causa objetiva e nenhuma acao de prioridade inferior executada.

## Fontes obrigatorias

- `agents/skills/by-role/manager/README.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/manager-worker-copilot.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/devops/agent.md`
