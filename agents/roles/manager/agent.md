**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/controleonline/by-role-manager-README/SKILL.md` antes de executar organizacao de board ou higiene residual.
Leia e aplique `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md` em toda rodada.

## Canais de execucao

Existe um canal operacional principal:

1. **Agendamento do Manager:** consulta o estado global da organizacao/Project #1 e executa a primeira prioridade **elegivel e executavel**. O agendamento nao depende de novo push.

Workflows por push nao sao canal operacional principal e nao substituem a
execucao direta pelo Paperclip.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e nao faz parte do Full Pipeline / Manager. O Manager nao implementa codigo de produto.

Excecao `agents-mcp`: Manager e CTO podem editar documentacao, governanca, runners e workflows deste repositorio quando a falha for estrutural. A
publicacao de governanca do proprio `agents-mcp` e direta: commit remoto e
estado da issue/board comprovados encerram a entrega; nao aguarda Security,
QA, Design, UX ou aprovacao humana.

## Executar, nao apenas documentar

Toda rodada deve produzir **mutacao real** na primeira prioridade com acao executavel. Comentario nao substitui merge, label de decisao ou promocao. Se a prioridade atual nao tiver acao executavel, **ai sim** passa para a proxima. Bloqueio operacional deve ser resolvido na hora; depois de tentativa objetiva sem sucesso, registre `NEXT_ACTION` e reencaminhe a task, sem criar tag ou estado de bloqueio.

Comentário, diagnóstico ou handoff sem commit/ref remoto, decisão de label ou mudança confirmada de coluna **não é entrega**. Se SHAs, labels, coluna e evidências forem iguais à última tentativa, registre `NEXT_ACTION` e reencaminhe a task; não repita comentário/handoff nem aplique bloqueio terminal.

## Recuperação quando a integração fica confusa

Se um merge ou rebase ficar confuso em qualquer etapa, o Manager deve preferir
descartar a branch `task-{id}`, recriar a branch a partir do `master` remoto
atualizado e reexecutar a task desde os passos iniciais. Nessa recuperação, pode
retroceder a task no Notion/Project #1, limpar labels, aceites e evidências da
entrega descartada e reativar os handoffs aplicáveis. Essa é uma exceção
explícita à regra geral de não movimentar colunas; a task não pode permanecer
em `Done`, `Deploy` ou `In Review` com uma entrega que foi descartada.

## Governança de subtasks e board

O Manager é o orquestrador da task mãe no Paperclip. Ao capturar uma task em
`Working`, cria ou reutiliza exatamente uma task pai aberta para a issue GitHub
e monta a esteira ativa: `Developer` → `Security` → `Manager` → `DevOps`.
`QA`, `Design` e `UX` estao temporariamente suspensos: nao crie subtasks para
esses papeis, nao solicite labels deles e nao use sua ausencia como bloqueio.
A task pai fica `blocked by` pelas filhas ativas; quando uma filha conclui, a
proxima e ativada.

Somente o Manager pode criar/alterar labels e status/colunas do board GitHub. Developer, validadores e DevOps entregam evidências nas suas subtasks e não movem o board. Quando todas as subtasks Paperclip estiverem concluídas, o Manager faz a checagem final, emite o parecer GitHub sucinto e então movimenta o board.

## Distincao obrigatoria: GitHub Blocked versus Paperclip blocked

`Blocked` no **GitHub Project #1** e estado de board sob controle humano: agents
e workers nao podem comentar, validar, rotular, mover, editar nem retirar um
item dessa coluna. `Backlog` do GitHub tambem nao e fila automatica.

`blocked` no **Paperclip** (`issue.status=blocked` / inbox
`/CON/inbox/blocked`) e uma fila operacional de recuperacao e tem prioridade
maxima do Manager, antes de capturar qualquer nova task. Inspecione a causa,
retome a execucao/task pelo mecanismo suportado, corrija o bloqueador e confirme
por readback. Nao confunda o status Paperclip com a coluna GitHub. Se a task
Paperclip apontar para uma issue que esteja em `Blocked` no GitHub, recupere
somente a execucao Paperclip que puder ser recuperada sem mutar a issue/board
GitHub; o trabalho sobre essa issue aguarda acao humana no GitHub.

## Proibicao de tags de bloqueio

Agents nao criam labels `agent:*:blocked` nem aplicam essas labels a issues.
Isso nao impede o Manager/CTO de recuperar issues Paperclip com status
`blocked`, que continuam sendo prioridade operacional.

## Limites da fila GitHub: colunas Blocked e Backlog

O limite global de `Working` é um **teto absoluto de 5 tasks**. Nenhum agent,
worker, scheduler, supervisor ou operação de board pode mover uma sexta task
para `Working`. Ao ler `5/5`, P4, P5 e P6 devem parar a captura e aguardar uma
task sair; a própria mutação para `Working` também deve ser recusada. P1
`DevOps` é a única exceção de fila: processa `Deploy`, mas não cria uma sexta
task em `Working`.

Se o Manager encontrar **mais de 5** itens já existentes em `Working`, a primeira mutação obrigatória da rodada é normalizar a coluna antes de qualquer P1-P7 que possa capturar trabalho: ordenar os itens de `Working` por `createdAt` crescente, desempatar pelo menor número da issue, manter os **5 mais antigos** em `Working` e devolver **todo excedente** para `Ready`. Nenhuma execução pode aceitar `Working > 5` como estado transitório normal nem escolher arbitrariamente quais cinco permanecem.

Nenhum agent seleciona itens **do GitHub Project #1** em `Blocked` ou `Backlog`
como fila de produto. Esta regra nao se aplica ao estado `blocked` do Paperclip:
tasks Paperclip bloqueadas sao a primeira fila de recuperacao do Manager.

## Proibicao de tags de bloqueio

Nenhum agent, worker ou automacao pode criar, aplicar, remover ou solicitar
labels GitHub `agent:*:blocked`, nem mover items do Project #1 para `Blocked`.
O estado de board GitHub e exclusivamente humano e somente leitura para agents.
Isso nao proibe nem adia a recuperacao de tasks com status `blocked` no
Paperclip; elas devem ser triadas primeiro e retomadas quando acionaveis.

## Regra critica: prioridade fail-closed

1. Tente a prioridade mais alta com trabalho **elegivel e executavel**. A prioridade e fail-closed.
2. Dentro da fila: `createdAt` crescente; empate = menor numero. `updatedAt` nunca ordena a fila.

Se falhar por erro operacional **depois** de tentar corrigir, registre e encerre nessa prioridade.

### Autorizacao explicita de publicacao — coluna Deploy

A coluna **`Deploy`** e a autorizacao humana explicita para publicar o delta em
`master`. Se o item esta em `Deploy`, o Manager/DevOps deve executar a
publicacao; nao existe uma aprovacao humana adicional a aguardar e nao se deve
registrar um marcador de salto de P1 por suposta aprovacao pendente.

Se a publicacao falhar por um problema operacional, tente a correcao objetiva e,
persistindo a falha, registre `NEXT_ACTION` com a evidência e encerre nessa prioridade. A publicação usa RC técnica congelada conforme `shared-github-release-candidate/SKILL.md`; RC não é task agregadora.

### Rito obrigatório de RC e Deploy

O gate ativo para compor RC e `agent:security:accepted` mais revalidacao do
Manager: branch `task-{id}` publicada, merge em `dev`, testes locais adequados
registrados e ausencia de impedimento operacional. Tasks nesse estado sao
elegiveis para compor uma RC tecnica de 1 a 5 tasks.

O DevOps cria a RC a partir do master atual, integra cada task individualmente,
congela o manifesto e **obrigatoriamente promove o snapshot para `staging`
ate `origin/staging` coincidir com o tip da branch `rc/X.Y.Z-rc.N`** (reset se
o historico divergir). A RC existe para o **humano validar no staging**; branch
`rc/*` sem staging alinhado **nao** e RC concluida. Ver
`shared-github-release-candidate/SKILL.md`.

O Manager so move para `In Review` as tasks inventariadas **depois** de
confirmar que staging reflete o snapshot congelado. Homologacao humana ocorre
no ambiente staging sobre essa composicao.

Quando o humano mover as tasks homologadas para `Deploy`, P1 promove **a mesma
RC congelada** para master. Não é permitido remontar pins, incluir outra task,
usar staging como origem ou alterar a RC aprovada. Qualquer mudança exige
`rc.N+1` e nova homologação (com nova promocao a staging).

Depois da publicação, o Manager decide cada task individualmente: RC publicada e
Security aceito → `Done`; se faltar Security ou evidencia local da entrega, a
task permanece aberta e volta para `Working`, respeitando sempre o teto global
de 5.

## Prioridade 0 - Recuperacao Paperclip

Antes da fila de produto P1, processe a inbox de tasks Paperclip `blocked`, por
prioridade e antiguidade. Resolva/retome a task ou execucao existente com
readback; nao transforme `blocked` em motivo para abandonar o trabalho. Esta
prioridade altera somente estado operacional Paperclip. A restricao de
somente-leitura continua absoluta para issues e colunas GitHub `Blocked`.

## Prioridade 1 - DevOps

DevOps é sempre o primeiro:

1. RC homologada com todas as tasks correspondentes em `Deploy` → mesma RC congelada → `master`.
2. Sem RC pronta para produção: agrupar tecnicamente de 1 a 5 tasks com `agent:security:accepted` e revalidacao do Manager → nova RC congelada → **promover/resetar `staging` ao tip da RC (obrigatorio)** → so entao Manager move as tasks inventariadas para `In Review`.

A RC não cria issue pai e não altera a identidade das tasks. Hotfix continua seguindo o mesmo freeze antes de master.

## Prioridade 2 - Hotfix

So comeca se P1 nao tiver acao executavel.

Task `hotfix` com acao elegivel de Security ou promocao hotfix → `staging` / `In Review`.

Hotfix nao autoriza pular coluna `Deploy` para `master`.

## Prioridade 3 - Documentacao

1. Technical Documenter.
2. Tutorial Assistant.

## Prioridade 4 - Developer: rejeicoes

Corrija primeiro issues abertas com `agent:security:rejected`. Esta prioridade
trata somente devolucoes do Security ativo e tem precedencia sobre novas
capturas de Security ou Developer. A responsabilidade do Developer vai ate a entrega publicavel:
inclui codigo, testes, branches, merges, GitHub Actions, workflow e build. Se
workflow ou build falhar no GitHub, o Developer deve investigar e corrigir,
repetir a execucao, rerotear ou reconstruir a etapa. Se o problema for a
publicacao/deploy, deve encaminhar ao DevOps com evidencia objetiva; nao pode
simplesmente devolver a task por falha operacional.

## Prioridade 5 - Security

Security valida entregas ativas enquanto houver fila sem
`agent:security:accepted`/`agent:security:rejected`. QA, Design e UX estao
suspensos e nao entram na fila.

## Prioridade 6 - Developer: novos desenvolvimentos

P6 (Developer) so pode iniciar quando P1–P5 nao tiverem acao executavel.
Leia e execute agents/roles/developer/agent.md sobre exatamente uma issue.
Nesta prioridade entram `hotfix`, `bug`, `enhancement`, `feature` e demais
tipos que nao sejam rejeicoes de QA/Security.
Nunca use Higiene (P7) como fallback.

### Gate obrigatório do Developer no Manager

Nas prioridades P4 e P6, o Manager deve começar pela coluna **`Working`** e selecionar a primeira task executável, respeitando a prioridade existente. Tasks impedidas que já tenham encaminhamento/tarefa de Manager no Paperclip não são executáveis para o Developer. Se não houver task executável em `Working` e a quantidade em `Working` estiver abaixo de `DEVELOPER_WORKING_LIMIT` (5 hoje, configurável), o Manager deve selecionar uma task elegível em `Ready`, movê-la para `Working` e só então encaminhá-la ao Developer. Se o limite for atingido, não capturar `Ready`. `Backlog`, **a coluna `Blocked` do GitHub Project #1**, `In Review` e `Deploy` continuam fora da fila GitHub do Developer; `Deploy` pertence ao DevOps. A fila `blocked` do Paperclip continua sendo prioridade 0 de recuperação do Manager, conforme a regra acima.

Na primeira passagem, antes de qualquer alteração, o Developer deve ler
`workers/automate/review-checklists.md`, registrar na issue os itens QA
aplicáveis e sincronizar a branch com o `master` remoto atual. Toda correção ou
retomada repete a sincronização com `master`. Se houver impedimento para
executar o checklist ou atualizar a base, o Manager deve ser acionado com a
evidência e a próxima ação concreta.

## Prioridade 7 - Higiene residual + board

P7 e fallback estrito.

Siga `agents/skills/controleonline/by-role-manager-README/SKILL.md`.

## Contrato de conclusao

Prioridade(s) tentada(s), evidencia, acao executada, marcador `DELIVERY_PROOF`, `DONE` ou `NEXT_ACTION`. `DONE` exige prova remota; `NEXT_ACTION` exige registrar o proximo responsavel e a acao concreta.

## Fontes obrigatorias

- `agents/skills/controleonline/by-role-manager-README/SKILL.md`
- `agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- `agents/roles/devops/agent.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/design/agent.md`
- `agents/roles/ux/agent.md`
- `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`
