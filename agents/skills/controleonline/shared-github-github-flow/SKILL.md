# GitHub Flow

## Overview

Fonte canônica do fluxo de branches e entrega técnica do ecossistema ControleOnline.

Integração contínua por task até a validação; a publicação é feita por **Release Candidate (RC)**. Cada task que chega a `In Review` pertence a exatamente um RC aberto, que mantém o inventário das tasks e o freeze do pacote.

### Regra de RC e freeze

- Ao existir a primeira task elegível para `In Review`, o DevOps/Manager cria um
  RC pai versionado (`RC X.Y.Z-rc.N`) e vincula a task como filha. Toda task
  subsequente só pode entrar em `In Review` se estiver vinculada a esse RC.
- A abertura do RC congela o pacote: nenhuma task nova entra em `In Review` e
  nenhuma task é adicionada ao RC por inferência de um agent.
- Uma task posterior só pode ser incluída no RC mediante pedido humano explícito,
  registrado no RC ou na própria task, com a task adicionada ao inventário e o
  freeze recalculado antes da promoção. Sem essa evidência, a task permanece
  fora de `In Review` (em `Working` ou `Ready`, conforme o caso).
- O RC é a unidade de conferência e publicação: staging contém o conjunto do RC,
  o humano confere o RC e move o pai para `Deploy`, e o DevOps promove o RC
  completo para `master`. Não se publica uma task do RC isoladamente.
- O pai do RC deve listar todas as tasks filhas, SHAs/branches promovidos,
  versão e estado de validação. Uma task não pode ficar em `In Review` sem esse
  vínculo e sem estar no inventário do RC.

## Regra inviolável de integração

Todo código que sair de uma branch de trabalho ou de integração para outra
branch deve chegar ao destino por **merge** ou por **Pull Request aprovado e
mergeado**. Isso vale para `dev`, `staging`, `master`, projetos agregadores e
submódulos.

Push direto em branch de integração, cherry-pick como substituto do merge,
atualização isolada de SHA e gitlink apontando diretamente para commit de task
**não são publicação**. Em repositórios com submódulos, primeiro faça o merge
da entrega no branch do submódulo; depois faça o merge do commit pai que atualiza
o gitlink para esse commit já integrado. Se o merge ou PR não puder ser
revisado semanticamente, aborte e registre o bloqueio.

## Branches

| Branch | Papel |
| --- | --- |
| `master` | Linha principal / produção |
| `dev` | Integração contínua, promovida pelo Manager/DevOps após a entrega |
| `staging` | Deltas já quádruplo-accepted (ou hotfix) para conferência humana; dispara deploy de staging |
| `task-{id_issue}` | Branch de trabalho do Developer |

## Fluxo ponta a ponta

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ task de entrega no Paperclip  (Developer → Manager)
            └─ subtasks QA + Security + Design + UX + DevOps
                 └─ Manager organiza labels, status e board
                      └─ QA + Security + Design + UX
                 └─ quatro :accepted
                      └─ DevOps merge somente task-{id} → staging
                           └─ coluna In Review (task individual)
                                └─ humano → coluna Deploy
                                     └─ DevOps promove o delta → master
                                          ├─ quatro :accepted → Done
                                          └─ sem quarteto → Working → segunda validação
```

## Etapas já concluídas (pular com justificativa)

Se o estado real do GitHub mostrar que o passo **já foi feito**, o agent não refaz. Deve confirmar evidência (commits, merge-base, labels, coluna), pular só o concluído, avançar o próximo estágio e comentar a justificativa.

**Não** pule etapas por intuição. **Não** omita QA/Security/Design/UX sem labels de decisão.

## Gate de atenção redobrada antes de qualquer merge

Merge não é apenas uma operação textual nem fica validado porque o Git não
reportou conflito. Antes de confirmar **qualquer** merge entre uma task e uma
branch de integração, ou entre `staging` e `master`, o agent responsável deve:

1. confirmar a origem, o destino, os dois SHAs atuais e o `merge-base`; se a
   origem foi criada antes de uma alteração relevante já presente no destino,
   atualizar/revisar a task sobre o destino atual antes de promover;
2. inspecionar o diff do resultado final (`merge-base`/origem/destino e
   `git diff` do commit de merge), não somente a tela de conflitos;
3. conferir explicitamente que cada requisito negativo da task continua
   verdadeiro (por exemplo, uma aba removida não pode reaparecer), que nenhum
   arquivo fora do escopo foi restaurado e que as alterações independentes de
   outras tasks foram preservadas;
4. em projetos com submódulos, revisar o diff de cada submódulo e o gitlink do
   pai, confirmando que o SHA apontado é o commit integrado esperado e não uma
   versão anterior carregada pela branch de origem;
5. executar os testes/verificações focados no comportamento alterado e registrar
   a evidência do estado pós-merge antes do push.

Se qualquer item não puder ser confirmado, **não faça o merge nem o push**:
pare na fronteira segura, registre a divergência e atualize/rebaseie a origem
ou peça a correção ao responsável. Resolução automática de conflito, merge sem
conflito ou branch de origem aparentemente limpa não substitui este gate.

### Recuperação obrigatória de conflito grande

Quando a origem estiver muito divergente, apresentar conflito amplo ou não
permitir separar com segurança o delta da task, o agent deve interromper e não
forçar a resolução. Nesse caso:

1. aborte o merge/rebase e preserve a evidência do conflito;
2. confirme que a branch remota de task é descartável e, somente então, apague
   `task-{id_issue}`;
3. recrie `task-{id_issue}` a partir do `master` remoto atualizado;
4. reaplique a correção do zero, com escopo e testes da issue;
5. retorne a task para **`Working`**, remova as decisões/aceites herdados da
   entrega descartada e reative as solicitações dos validadores (`agent:qa`,
   `agent:security`, `agent:design` e `agent:ux` quando aplicável);
6. publique a nova branch e siga novamente o caminho obrigatório de merge ou PR
   em `dev`, `staging` e `master`.

Apagar e recriar a branch não autoriza copiar o gitlink, escolher “ours” ou
“theirs” cegamente, fazer force-push, ou marcar a task como concluída. O
resultado recriado deve passar pelo mesmo gate semântico e deixar comentário
com a branch descartada, a nova base `master`, os SHAs e os testes executados.
Uma task recriada não pode permanecer em `Done`, `Deploy` ou `In Review`, nem
ser validada com labels anteriores: a validação começa novamente após o novo
merge em `dev`.

### Regra explícita de status e revalidação após entrega em `dev`

Quando a task reconstruída ou corrigida tiver sido publicada somente em
`dev`, o Manager deve, na mesma rodada:

1. manter ou retornar o item do Project #1 para **`Working`**;
2. remover todas as decisões anteriores dos validadores daquela entrega
   (`agent:qa:accepted`, `agent:qa:rejected`, `agent:security:accepted`,
   `agent:security:rejected`, `agent:design:accepted`,
   `agent:design:rejected`, `agent:ux:accepted` e `agent:ux:rejected`);
3. reativar as solicitações aplicáveis (`agent:qa`, `agent:security`,
   `agent:design` e `agent:ux`) para validar os novos SHAs mergeados em `dev`;
4. só permitir **`In Review`** depois que a task individual tiver sido
   mergeada em `staging` e possuir os quatro novos `:accepted`.

Não é suficiente remover apenas `agent:developer:done` ou reabrir a issue:
aceites e recusas de uma entrega descartada não podem acompanhar a nova
entrega.

## Developer

1. Captura issue elegível.
2. Cria ou reutiliza `task-{id_issue}` **a partir de `master`** atualizado.
3. Implementa e valida na branch da tarefa.
4. Sincroniza com `origin/master` antes de continuar/encerrar.
5. Publica somente `task-{id_issue}` e cria task de entrega no Paperclip para o Manager.
6. Executa o gate compartilhado de entrega local: toda alteração em projeto principal, submódulo ou gitlink deve estar publicada; cada checkout afetado deve ser conferido contra `origin/master` e ficar sem staged/unstaged/untracked. Registra exceções de branch com SHA e ref remoto.
7. O Manager cria as subtasks dos validadores e DevOps, organiza labels/status/board e só então promove a integração.

### Proibições do Developer

- **Não** abre PR no fluxo normal.
- **Não** mergeia em `staging` nem em `master`.
- **Não** commit/push direto em `master`, `main`, `dev`, `staging`.
- Trabalho só na `task-{id_issue}`; chegada em `dev` é por **merge** da task branch.

### Entrega = branch publicada + task Paperclip

A entrega técnica é a branch `task-{id_issue}` publicada e a task de entrega no Paperclip. O Manager decide, por suas subtasks concluídas e pela checagem final, quando promover a integração e mover o board.

## Revisão (QA, Security, Design, UX)

- Atuam sobre a task/issue e a evidência da entrega (commits na task branch e o que foi mergeado em **`dev`**).
- Registram `agent:<papel>:accepted` ou `agent:<papel>:rejected`.
- **Não** abrem PR; **não** finalizam task; **não** mexem em branches de integração.
- Recusa devolve prioridade ao Developer na mesma `task-{id_issue}`.

Gate de staging (task comum): as **quatro** labels juntas:

- `agent:qa:accepted`
- `agent:security:accepted`
- `agent:design:accepted`
- `agent:ux:accepted`

## DevOps — montagem, freeze e publicação de RC

No Manager, DevOps é **P1**. Hotfix é **P2**.

### Entrada (P1)

1. RC pai na coluna **`Deploy`** — publicar o pacote completo primeiro.
2. RC aberto com desvio de inventário, freeze ou staging.
3. Task quádruplo-accepted pronta para staging: criar/atualizar o RC e incluir a
   task, respeitando o freeze e a autorização humana quando o RC já estiver aberto.
4. Issues/PRs com `agent:devops` com ação de merge restante.

Promoção de `hotfix` → staging é P2, não P1.

### Proibições e exceções

- Mergear `dev` inteiro em `staging`.
- Abrir segundo “RC” paralelo.
- Promover task comum a staging sem as quatro `:accepted` (exceção: `hotfix` na P2).
- Adicionar task ao RC ou colocá-la em `In Review` sem pedido humano explícito
  depois do freeze.

### Promoção a staging

1. Staging parte de `master` atual + merge das tasks inventariadas no RC.
2. Pai + submódulos afetados (submódulos primeiro; pins coerentes).
3. Aplicar o **Gate de atenção redobrada antes de qualquer merge**. Conflito:
   abortar aquele merge, comentar, seguir a próxima task. Ausência de conflito
   não dispensa a revisão semântica do resultado.
4. Versão em `package.json` / `app.json` quando o bump for necessário: **somente números** (SemVer). Sem sufixo `-rc`.
5. Push em `staging` dispara deploy de conferência.
6. O Manager só pode colocar uma task em **`In Review`** depois de confirmar o
   RC pai, o inventário e os quatro accepts. Após o freeze, exige também a
   evidência de inclusão humana; o DevOps não pode inferir essa inclusão.

### `In Review`

Sinal de que a task está em staging como filha do RC, possui os quatro accepts e
aguarda revisão humana. Depois que um RC novo foi aberto, nenhuma task entra
nesta coluna fora do inventário congelado, salvo pedido humano explícito. Se
parecer indevida: não mover; registrar `agent:devops` e aguardar a decisão humana.

### Publicação (coluna Deploy)

1. Humano move o **RC pai** para **`Deploy`**; essa mudança de coluna é a
   autorização explícita para publicar o pacote em `master`.
2. DevOps aplica o **Gate de atenção redobrada antes de qualquer merge** e
   mescla o conjunto inventariado do RC → `master` (pai + submódulos).
3. devolva ao Manager o handoff com SHA, versão publicada, inventário do RC,
   runtime e estado dos quatro accepts.
4. O Manager decide a coluna final das tasks. Com os quatro accepts, move as
   filhas para `Done`; com pendência ou rejeição, reabre somente a task afetada,
   cancela o RC/publicação correspondente e reativa os validadores.

Nunca direto a `master` sem coluna `Deploy`, salvo correção estrutural de governança em `agents-mcp`.

Detalhes: `agents/skills/controleonline/shared-github-master-publication/SKILL.md`.

### O que o DevOps não faz

- Não implementa feature de produto no lugar do Developer.
- Não inventa inclusão no RC após o freeze.
- Não inclui task comum sem as quatro `:accepted` (exceção `hotfix` na P2 e
  inclusão humana explícita no RC).

## Quem pode o que

| Acao | Developer | Validadores | DevOps |
|------|-----------|-------------|--------|
| Branch `task-{id}` a partir de `master` | sim | nao | so excecao |
| Merge `task-{id}` → `dev` | não | não | Manager/DevOps conforme subtask |
| Merge `task-{id}` → `staging` | **nao** | **nao** | **sim** |
| Abrir PR de produto / task | **nao** | **nao** | **nao** (salvo excecao) |
| Labels `:accepted` / `:rejected` | nao | sim | nao |
| Criar/atualizar task pai RC | **nao** | **nao** | **sim** |
| Merge RC package → `master` | **nao** | **nao** | **sim** (RC pai em Deploy) |

## Hotfix (P2 do Manager)

Label obrigatória: `hotfix`.

No Full Pipeline, hotfix vem **depois** do DevOps (P1).

```text
master
  └─ task-{id}
       └─ merge task-{id} → dev
  └─ DevOps inclui a task no RC → staging (sem esperar quádruplo) [P2]
                 └─ RC em In Review → humano Deploy → pacote → master
                      ├─ quatro accepts → Done
                      └─ sem quarteto → Working → segunda validação
```

- Dual-gate **não** bloqueia entrada em `staging` no hotfix.
- `master` ainda exige coluna **Deploy**.
- Publica **somente o delta** da `task-{id}`.
- Manager P1 = DevOps. Manager P2 = hotfix. Manager **não** implementa produto; exceção estrutural em `agents-mcp` (docs/governança/runners).

## Quality Bar

- não derive task branch de `dev`/`staging` (sempre de `master`)
- não entregue Developer em `staging` (destino é `dev`)
- não faça handoff com mudança local, commit não publicado ou projeto/submódulo afetado sem conferência contra `origin/master`
- não promova para `master` sem coluna `Deploy` e passagem por `In Review`
- não coloque task em `In Review` sem RC, inventário e freeze verificáveis
- não pule etapa sem evidência verificável
- não mova `Deploy` de volta para `In Review` sem rejeição humana explícita

## Project Status: Blocked e Backlog

Agents **não** selecionam nem movem items em **`Blocked`** ou **`Backlog`** como fila.
