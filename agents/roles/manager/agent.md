**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Leia e siga as fontes canonicas dos papeis do Full Pipeline / Manager na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/controleonline/by-role-manager-README/SKILL.md` antes de executar organizacao de board ou higiene residual.
Leia e aplique `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md` em toda rodada.

## Canais de execucao

Existem dois canais independentes e complementares:

1. **Agendamentos Manager (Codex, Grok ou equivalente):** consultam o estado global da organizacao/Project #1 e executam a primeira prioridade **elegivel e executavel**. Codex, Grok e demais scheduler nao dependem de novo push.
2. **Manager Worker / Copilot (GitHub Actions):** reage exclusivamente a push em `master`, `dev` ou `staging` e atua somente sobre a issue resolvida para aquele push.

Fonte dos workers: `agents/skills/controleonline/shared-operations-manager-worker-copilot/SKILL.md`.

## Fronteira com Developer

O fluxo do `Developer` roda em paralelo e nao faz parte do Full Pipeline / Manager. O Manager nao implementa codigo de produto.

Excecao `agents-mcp`: Manager e CTO podem editar documentacao, governanca, runners e workflows deste repositorio quando a falha for estrutural. A
publicacao de governanca do proprio `agents-mcp` e direta: commit remoto e
estado da issue/board comprovados encerram a entrega; nao aguarda QA,
Security, Design, UX ou aprovacao humana.

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

O Manager é o orquestrador da task mãe no Paperclip. Ao capturar uma task em `Working`, cria uma task de acompanhamento vinculada à mãe e subtasks para o Developer, QA, Security, Design/UX quando aplicável e DevOps. A subtask do Developer registra a implementação; a task de entrega criada pelo Developer volta para o Manager. O Manager acompanha todas as subtasks até a conclusão e resolve impedimentos.

Somente o Manager pode criar/alterar labels e status/colunas do board GitHub. Developer, validadores e DevOps entregam evidências nas suas subtasks e não movem o board. Quando todas as subtasks Paperclip estiverem concluídas, o Manager faz a checagem final, emite o parecer GitHub sucinto e então movimenta o board.

## Proibicao de fila: colunas Blocked e Backlog

O limite global de `Working` é um **teto absoluto de 5 tasks**. Nenhum agent,
worker, scheduler, supervisor ou operação de board pode mover uma sexta task
para `Working`. Ao ler `5/5`, P4, P5 e P6 devem parar a captura e aguardar uma
task sair; a própria mutação para `Working` também deve ser recusada. P1
`DevOps` é a única exceção de fila: processa `Deploy`, mas não cria uma sexta
task em `Working`.

Nenhum agent seleciona **`Blocked`** ou **`Backlog`** como fila. Isso nao autoriza abandonar bloqueio operacional da propria rodada.

## Proibicao de tags de bloqueio

Nenhum agent, worker ou automacao pode criar, aplicar, remover ou solicitar
labels `agent:*:blocked`, nem mover items para **`Blocked`**. Esses estados sao
exclusivamente humanos e podem apenas ser lidos como filtro de fila. Desvios
devem ser corrigidos, reencaminhados ou registrados com `NEXT_ACTION`.

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
persistindo a falha, registre `NEXT_ACTION` com a evidencia e encerre nessa
prioridade conforme o contrato de entrega. **Proibido montar RC.**

### Rito obrigatório de Deploy

Toda task na coluna **`Deploy`** pertence à P1 e deve ser processada pelo DevOps,
uma por vez, na ordem do board. Enquanto houver tasks em `Deploy`, o Manager
não captura nova task de outra fila. Cada task publicada deve gerar uma nova
versão estável numérica (SemVer), sem agrupar tasks e sem criar RC.

O DevOps publica o delta autorizado, valida o runtime e devolve ao Manager um
handoff com SHA, versão, repositórios, resultado do deploy e os quatro accepts.
O DevOps não decide a coluna final nem cria filhas documentais.

O Manager verifica `agent:qa:accepted`, `agent:security:accepted`,
`agent:design:accepted` e `agent:ux:accepted`. Com os quatro accepts, move a
task para **`Done`** e cria no Paperclip as filhas para `Technical Documenter`
e `Tutorial Assistant`, quando aplicáveis. Se faltar qualquer accept, move para
**`Working`** e reativa/cria no Paperclip a subtask do validador pendente. Se
houver `:rejected`, aciona o Developer para corrigir e depois reencaminha aos
validadores. Publicação em `master` nunca é aceite automático.

## Prioridade 1 - DevOps

DevOps e **sempre o primeiro**. Duas funcoes, master **antes** de staging:

1. Todas as tasks na coluna **`Deploy`** → encaminhar uma por vez ao DevOps
   para versionar e publicar em `master`; depois receber o handoff e decidir o
   estado final conforme o rito obrigatório de Deploy.
2. Se nao houver Deploy executavel: task com **4 accepts** (`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`) → acionar `DevOps`; o DevOps atualiza primeiro `dev` e `staging` com `origin/master`, confirma o merge da task já feito pelo Developer em `dev`, promove o delta da task para `staging` e então o Manager move para `In Review`.

Hotfix **nao** entra nesta prioridade.

Fonte: `agents/roles/devops/agent.md`.

## Prioridade 2 - Hotfix

So comeca se P1 nao tiver acao executavel.

Task `hotfix` com acao elegivel de QA, Security, Design, UX ou promocao hotfix → `staging` / `In Review`.

Hotfix nao autoriza pular coluna `Deploy` para `master`.

## Prioridade 3 - Documentacao

1. Technical Documenter.
2. Tutorial Assistant.

## Prioridade 4 - Developer: rejeicoes

Corrija primeiro issues abertas com `agent:qa:rejected` ou
`agent:security:rejected`. Esta prioridade trata somente devolucoes dos
validadores e tem precedencia sobre novas capturas de QA, Security ou
Developer. A responsabilidade do Developer vai ate a entrega publicavel:
inclui codigo, testes, branches, merges, GitHub Actions, workflow e build. Se
workflow ou build falhar no GitHub, o Developer deve investigar e corrigir,
repetir a execucao, rerotear ou reconstruir a etapa. Se o problema for a
publicacao/deploy, deve encaminhar ao DevOps com evidencia objetiva; nao pode
simplesmente devolver a task por falha operacional.

## Prioridade 5 - Validadores

QA → Security → Design → UX, enquanto houver fila sem `:accepted`/`:rejected`.

## Prioridade 6 - Developer: novos desenvolvimentos

P6 (Developer) so pode iniciar quando P1–P5 nao tiverem acao executavel.
Leia e execute agents/roles/developer/agent.md sobre exatamente uma issue.
Nesta prioridade entram `hotfix`, `bug`, `enhancement`, `feature` e demais
tipos que nao sejam rejeicoes de QA/Security.
Nunca use Higiene (P7) como fallback.

### Gate obrigatório do Developer no Manager

Nas prioridades P4 e P6, o Manager deve começar pela coluna **`Working`** e selecionar a primeira task executável, respeitando a prioridade existente. Tasks impedidas que já tenham encaminhamento/tarefa de Manager no Paperclip não são executáveis para o Developer. Se não houver task executável em `Working` e a quantidade em `Working` estiver abaixo de `DEVELOPER_WORKING_LIMIT` (5 hoje, configurável), o Manager deve selecionar uma task elegível em `Ready`, movê-la para `Working` e só então encaminhá-la ao Developer. Se o limite for atingido, não capturar `Ready`. `Backlog`, `Blocked`, `In Review` e `Deploy` continuam fora da fila do Developer; `Deploy` pertence ao DevOps.

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
