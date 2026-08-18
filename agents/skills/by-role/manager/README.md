# Manager Skills

## Papel

O `Manager` executa o Full Pipeline na ordem definida em `agents/roles/manager/agent.md`. O Developer e paralelo e nao pertence ao ciclo do Manager.

Ordem resumida:

1. **Hotfix** - QA / Security / DevOps em tasks `hotfix`.
2. **DevOps** - publicar Deploy ou criar RC (ou alinhar board do RC). Gate humano de Deploy **nao** encerra a rodada.
3. **Documentacao** - Technical Documenter / Tutorial Assistant.
4. **Validadores** - QA; somente com QA vazia, Security.
5. **Higiene residual + board** - somente com P1 vazia, P2 sem acao executavel, P3 vazia e P4 vazia.

## Entrada obrigatoria

Antes de atuar:

1. consulte o estado real do GitHub e Project #1;
2. descubra as filas P1–P4 globalmente, sem depender de eventos de push;
3. tente a primeira prioridade com trabalho **elegivel e executavel**;
4. dentro da fila escolhida, use `createdAt` crescente e menor numero em empate;
5. releia issue, labels, coluna, comentarios e relacionamentos imediatamente antes da mutacao.

`updatedAt` serve apenas como evidencia de atividade e nunca ordena a fila.

## Fail-closed operacional vs skip de P2 humano

### Fail-closed (mantido)

A transicao para uma prioridade inferior **apos erro operacional** na prioridade selecionada e proibida.

Se a prioridade selecionada falhar por ferramenta, credencial, timeout, dispatch, checkout, teste, API ou qualquer outra dependencia operacional:

- registre a causa objetiva quando possivel;
- encerre a rodada como `BLOCKED` naquela prioridade;
- nao execute nenhuma prioridade inferior na mesma rodada.

**Higiene nunca e fallback para falha operacional de executor.**

### Excecao: P2 gate humano de Deploy

Quando P2 tem RC aberto e a unica barreira e aprovacao humana (item em `Deploy` / freeze sem publicacao possivel pelo agent):

- registre `P2_SKIPPED_HUMAN_DEPLOY` com evidencia (issue do RC, colunas, labels);
- **continue** para P3 → P4 → P5 na mesma rodada se houver trabalho elegivel e executavel;
- nao trate esse estado como “P2 vazia” no relato, mas tambem **nao** use-o para bloquear documentacao, validadores ou higiene.

P2 ainda deve ser tentado **antes** de P3–P5 sempre que houver acao executavel (criar RC, publicar apos aprovacao humana explicita, alinhar In Review).

## Agendamentos Manager: Codex, Grok e equivalentes

Agendamentos sao consumidores globais do pipeline e mecanismo de recuperacao de backlog.

Ao encontrar trabalho elegivel e executavel:

- execute diretamente o papel correspondente quando o runtime possuir as ferramentas necessarias, lendo primeiro `agents/roles/<papel>/agent.md`;
- alternativamente, use um dispatch real e verificavel para um agente capaz;
- em P2 somente com gate humano de Deploy, registre e avance;
- se falha operacional impedir a execucao, termine `BLOCKED` na prioridade selecionada.

Uma label `agent:qa`, `agent:security`, `agent:technical-documenter` ou estado DevOps **executavel** e trabalho pendente mesmo que nao tenha ocorrido push recente.

Agendamento deve produzir **pelo menos uma acao util** por rodada quando existir fila elegivel e executavel.

## Workers de push

Workers do GitHub Actions continuam estritamente reativos a `push` em `master`, `dev` ou `staging` e atuam somente na issue resolvida para aquele push.

Eles nao varrem o Project, nao escolhem a task mais antiga da organizacao e nao recuperam backlog historico. Essa responsabilidade pertence aos agendamentos Manager.

Falha critica de label/assignment/dispatch no worker deve falhar o job; nao deve ser mascarada como sucesso.

## Prioridade 4 - validadores

- QA sempre precede Security na fila global do Manager.
- Enquanto existir QA elegivel sem `agent:qa:accepted`/`agent:qa:rejected`, Security nao substitui QA e P5 permanece bloqueada.
- Quando QA estiver vazia, Security elegivel sem `agent:security:accepted`/`agent:security:rejected` bloqueia P5.
- Agendamento Manager pode processar lote de QA ou, depois, lote de Security na mesma rodada, preservando evidencia por issue.

## Prioridade 5 - checklist de board e higiene

Pre-condicao:

- P1 vazia;
- P2 sem acao executavel (vazia **ou** somente gate humano de Deploy ja registrado na rodada);
- P3 vazia;
- QA e Security vazias.

Quando essa pre-condicao for verdadeira, audite:

### Board / RC

- **Issues soltas (obrigatorio):** issues `open` elegiveis da org/escopo operacional **sem item no Project #1** devem ser associadas ao board na mesma correcao atomica; Status padrao `Ready` (ou coluna coerente com labels/estado real). Falha de API/permissao deve ser comentada na issue — nunca silenciosa. Isso complementa a regra hands-on de todos os agents; P5 e a rede de seguranca, nao a unica via.
- RC aberto: pai + filhas devem estar em `In Review`, exceto itens ja em `Deploy`.
- Nunca regredir `Deploy` sem evidencia explicita de rejeicao humana.
- Dual-accepted limpo sem RC deve voltar para P2, nao ser resolvido por higiene.
- Dual-accepted fora do freeze precisa de bloqueio objetivo documentado.
- Remover assignees usados indevidamente como mecanismo de fila.

### PRs soltas (obrigatorio)

Inclui PRs abertas **e** PRs que sejam **itens do Project #1** (board) sem handoff operacional claro. Destravar em P5 (correcao atomica; uma PR por rodada):

1. **PR com tarefa/issue associada:** se a issue estiver `closed`, **reabra**; aplique handoff para **DevOps** (`agent:devops`); comente na issue e na PR o motivo (PR solta no board/fila, precisa de decisao DevOps: merge/alinhar fluxo/fechar). Nao mergeie nem feche a PR no lugar do DevOps.
2. **PR sem tarefa associada:** **crie** uma issue para o DevOps decidir (implementar/alinhar merge ou fechar a PR); associe issue **e** mantenha/associe a PR ao Project #1 com Status coerente (padrao `Ready`); label de tipo adequada + `agent:devops` na issue (e na PR se o repositorio usar a mesma label); comente o vinculo cruzado. Falha de associacao ao board nao e silenciosa.

### Conclusao

Task comum so pode permanecer `closed`/`Done` com o quarteto comprovado:

- `agent:qa:accepted`
- `agent:security:accepted`
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

- prioridade(s) tentada(s) e eventual `P2_SKIPPED_HUMAN_DEPLOY`;
- evidencia de esvaziamento (ou skip documentado) das prioridades superiores;
- task(s) auditada(s);
- estado/labels/coluna relevantes;
- acao realizada;
- `DONE` ou `BLOCKED`;
- em `BLOCKED` operacional, causa objetiva e confirmacao de que nenhuma prioridade inferior foi executada apos o erro.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/skills/shared/operations/agent-handoff-governance.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/operations/manager-worker-copilot.md`
- `agents/skills/shared/github/github-flow.md`
