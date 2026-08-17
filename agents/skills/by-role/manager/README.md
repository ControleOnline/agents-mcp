# Manager Skills

## Papel

O `Manager` executa o Full Pipeline na ordem definida em `agents/roles/manager/agent.md`. O Developer e paralelo e nao pertence ao ciclo do Manager.

Ordem resumida:

1. **Hotfix** - QA / Security / DevOps em tasks `hotfix`.
2. **DevOps** - publicar Deploy ou criar RC.
3. **Documentacao** - Technical Documenter / Tutorial Assistant.
4. **Validadores** - QA; somente com QA vazia, Security.
5. **Higiene residual + board** - somente com P1-P4 comprovadamente vazias.

## Entrada obrigatoria

Antes de atuar:

1. consulte o estado real do GitHub e Project #1;
2. descubra as filas P1-P4 globalmente, sem depender de eventos de push;
3. pare na primeira prioridade com trabalho elegivel;
4. dentro da fila escolhida, use `createdAt` crescente e menor numero em empate;
5. releia issue, labels, coluna, comentarios e relacionamentos imediatamente antes da mutacao.

`updatedAt` serve apenas como evidencia de atividade e nunca ordena a fila.

## Fail-closed entre prioridades

A transicao para uma prioridade inferior exige evidencia de que a prioridade superior esta **vazia**, nao apenas de que o runtime nao conseguiu executa-la.

Se a prioridade selecionada falhar por ferramenta, credencial, timeout, dispatch, checkout, teste, API ou qualquer outra dependencia:

- registre a causa objetiva quando possivel;
- encerre a rodada como `BLOCKED` naquela prioridade;
- nao execute nenhuma prioridade inferior na mesma rodada.

Consequentemente, P5 e proibida quando houver qualquer P1-P4 elegivel ou quando a descoberta de P1-P4 estiver inconclusiva.

## Agendamentos Manager: Codex, Grok e equivalentes

Agendamentos sao consumidores globais do pipeline e mecanismo de recuperacao de backlog.

Ao encontrar trabalho elegivel:

- execute diretamente o papel correspondente quando o runtime possuir as ferramentas necessarias, lendo primeiro `agents/roles/<papel>/agent.md`;
- alternativamente, use um dispatch real e verificavel para um agente capaz;
- se nao puder executar nem despachar, termine `BLOCKED` na prioridade selecionada.

Uma label `agent:qa`, `agent:security`, `agent:technical-documenter` ou estado DevOps elegivel e trabalho pendente mesmo que nao tenha ocorrido push recente.

**Higiene nunca e fallback para indisponibilidade de executor.**

## Workers de push

Workers do GitHub Actions continuam estritamente reativos a `push` em `master`, `dev` ou `staging` e atuam somente na issue resolvida para aquele push.

Eles nao varrem o Project, nao escolhem a task mais antiga da organizacao e nao recuperam backlog historico. Essa responsabilidade pertence aos agendamentos Manager.

Falha critica de label/assignment/dispatch no worker deve falhar o job; nao deve ser mascarada como sucesso.

## Prioridade 4 - validadores

- QA sempre precede Security na fila global do Manager.
- Enquanto existir QA elegivel sem `qa:accepted`/`qa:rejected`, Security nao substitui QA e P5 permanece bloqueada.
- Quando QA estiver vazia, Security elegivel sem `security:accepted`/`security:rejected` bloqueia P5.
- Agendamento Manager pode processar lote de QA ou, depois, lote de Security na mesma rodada, preservando evidencia por issue.

## Prioridade 5 - checklist de board e higiene

Pre-condicao absoluta: P1, P2, P3, QA e Security foram consultadas com sucesso e estao vazias.

Quando essa pre-condicao for verdadeira, audite:

### Board / RC

- RC aberto: pai + filhas devem estar em `In Review`, exceto itens ja em `Deploy`.
- Nunca regredir `Deploy` sem evidencia explicita de rejeicao humana.
- Dual-accepted limpo sem RC deve voltar para P2, nao ser resolvido por higiene.
- Dual-accepted fora do freeze precisa de bloqueio objetivo documentado.
- Remover assignees usados indevidamente como mecanismo de fila.

### Conclusao

Task comum so pode permanecer `closed`/`Done` com o quarteto comprovado:

- `qa:accepted`
- `security:accepted`
- `agent:technical-documenter:done`
- `agent:tutorial-assistant:done`

Issue aberta com quarteto completo e evidencia deve ser fechada e alinhada a Done. Issue fechada/Done sem quarteto nao recebe labels inventadas: restaure o handoff real faltante.

### Dupla validacao estado <-> labels

Verifique nos dois sentidos:

- coluna/estado exigem labels coerentes;
- labels precisam corresponder a etapa operacional real.

Exemplos: `Ready` com validador ja ativo, `Working` sem ownership real, RC fora de In Review, labels de aceite e rejeicao contraditorias, ou `Deploy` regredido.

## Correcao atomica

Em P5 aplique exatamente uma correcao atomica por rodada, salvo fechamento em lote de issues com quarteto completo. Comente evidencia antes/depois quando houver mutacao.

## Output Contract

Ao finalizar informe:

- prioridade executada;
- evidencia de esvaziamento das prioridades superiores;
- task(s) auditada(s);
- estado/labels/coluna relevantes;
- acao realizada;
- `DONE` ou `BLOCKED`;
- em `BLOCKED`, causa objetiva e confirmacao de que nenhuma prioridade inferior foi executada.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/operations/manager-worker-copilot.md`
- `agents/skills/shared/github/github-flow.md`
