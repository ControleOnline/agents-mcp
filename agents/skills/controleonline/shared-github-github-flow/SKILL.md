# GitHub Flow

## Overview

Fonte canônica do fluxo de branches e entrega técnica do ecossistema ControleOnline.

Integração contínua **por task**. Não se monta Release Candidate, task pai de RC, freeze de pacote nem inventário de filhas. RCs históricos (`RC X.Y.Z-rc.N`) são legado e não orientam execuções novas.

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
| `dev` | Integração contínua das tasks do Developer (após implementação) |
| `staging` | Deltas já quádruplo-accepted (ou hotfix) para conferência humana; dispara deploy de staging |
| `task-{id_issue}` | Branch de trabalho do Developer |

## Fluxo ponta a ponta

```text
master
  └─ task-{id}                         (Developer cria a partir de master)
       └─ merge em dev                 (Developer; SEM PR)
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
   versão antiga carregada pela branch de origem;
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
ser validada com labels antigas: a validação começa novamente após o novo
merge em `dev`.

### Regra explícita de status e revalidação após entrega em `dev`

Quando a task reconstruída ou corrigida tiver sido publicada somente em
`dev`, o Manager deve, na mesma rodada:

1. manter ou retornar o item do Project #1 para **`Working`**;
2. remover todas as decisões históricas dos validadores daquela entrega
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
5. **Faz merge de `task-{id_issue}` em `dev`** (sem abrir PR) — ou **pula** se já estiver mergeada (com comentário).
6. Executa o gate compartilhado de entrega local: toda alteração em projeto principal, submódulo ou gitlink deve estar publicada; cada checkout afetado deve ser conferido contra `origin/master` e ficar sem staged/unstaged/untracked. Registra exceções de branch com SHA e ref remoto.
7. Registra evidência e handoff (`agent:qa` e `agent:security`; Design/UX quando o escopo tiver UI), incluindo o inventário dos projetos/submódulos e a conferência de `origin/master`.

### Proibições do Developer

- **Não** abre PR no fluxo normal.
- **Não** mergeia em `staging` nem em `master`.
- **Não** commit/push direto em `master`, `main`, `dev`, `staging`.
- Trabalho só na `task-{id_issue}`; chegada em `dev` é por **merge** da task branch.

### Entrega = merge em `dev`

- **Nunca** faça merge de `dev` inteiro em `staging`. Merge sempre **apenas** `task-{id}`.
- Origem: `task-{id_issue}`. Destino: `dev`. Operação: merge (não PR).

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

## DevOps — integração contínua por task (sem RC)

No Manager, DevOps é **P1**. Hotfix é **P2**.

### Entrada (P1)

1. Task na coluna **`Deploy`** (publicar o delta sozinho em `master`) — primeiro.
2. Task **quádruplo-accepted** ainda fora de `staging` / `In Review`.
3. Issues/PRs com `agent:devops` com ação de merge restante.

Promoção de `hotfix` → staging é P2, não P1.

### Proibido

- Criar task pai `RC X.Y.Z-rc.N`.
- Freeze de pacote / inventário de filhas como rito novo.
- Mergear `dev` inteiro em `staging`.
- Abrir segundo “RC” paralelo.
- Promover task comum a staging sem as quatro `:accepted` (exceção: `hotfix` na P2).

### Promoção a staging

1. Staging parte de `master` atual + merge **somente** de `task-{id}`.
2. Pai + submódulos afetados (submódulos primeiro; pins coerentes).
3. Aplicar o **Gate de atenção redobrada antes de qualquer merge**. Conflito:
   abortar aquele merge, comentar, seguir a próxima task. Ausência de conflito
   não dispensa a revisão semântica do resultado.
4. Versão em `package.json` / `app.json` quando o bump for necessário: **somente números** (SemVer). Sem sufixo `-rc`.
5. Push em `staging` dispara deploy de conferência.
6. A passagem para **`In Review`** é feita pelo humano após staging e os quatro
   accepts; o DevOps não move a task para essa coluna.

### `In Review`

Sinal de que a **task individual** já está em staging, possui os quatro accepts
e aguarda revisão humana. Nenhum agent move tasks para dentro ou para fora desta
coluna. Se parecer indevida: comentar + `agent:devops` + esperar humano.

### Publicação (coluna Deploy)

1. Humano move a task para **`Deploy`**, com ou sem o quarteto; essa mudança
   de coluna é a autorização explícita para publicar em `master`.
2. DevOps aplica o **Gate de atenção redobrada antes de qualquer merge** e
   mescla o delta (`staging` / `task-{id}`) → `master` (pai + submódulos).
3. Se a task possuir os quatro accepts (`agent:qa:accepted`,
   `agent:security:accepted`, `agent:design:accepted`, `agent:ux:accepted`),
   move para **`Done`**.
4. Se faltar qualquer accept, mantenha a issue aberta, mova para **`Working`**
   e reative as solicitações dos validadores ainda pendentes para a segunda
   rodada de validação.
5. Handoff documental fail-closed (`agent:technical-documenter` /
   `agent:tutorial-assistant` se faltar `:done`).

Nunca direto a `master` sem coluna `Deploy`, salvo correção estrutural de governança em `agents-mcp`.

Detalhes: `agents/skills/controleonline/shared-github-master-publication/SKILL.md`.

### O que o DevOps não faz

- Não implementa feature de produto no lugar do Developer.
- Não monta RC.
- Não inclui task comum sem as quatro `:accepted` (exceção `hotfix` na P2).

## Quem pode o que

| Acao | Developer | Validadores | DevOps |
|------|-----------|-------------|--------|
| Branch `task-{id}` a partir de `master` | sim | nao | so excecao |
| Merge `task-{id}` → `dev` | sim | nao | so se conflito/desvio |
| Merge `task-{id}` → `staging` | **nao** | **nao** | **sim** |
| Abrir PR de produto / task | **nao** | **nao** | **nao** (salvo excecao) |
| Labels `:accepted` / `:rejected` | nao | sim | nao |
| Criar task pai RC | **nao** | **nao** | **nao** |
| Merge delta → `master` | **nao** | **nao** | **sim** (coluna Deploy) |

## Hotfix (P2 do Manager)

Label obrigatória: `hotfix`.

No Full Pipeline, hotfix vem **depois** do DevOps (P1).

```text
master
  └─ task-{id}
       └─ merge task-{id} → dev
            └─ DevOps merge somente task-{id} → staging (sem esperar quádruplo) [P2]
                 └─ In Review → humano Deploy → delta → master
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
- não monte RC, pai de RC ou freeze de pacote
- não pule etapa sem evidência verificável
- não mova `Deploy` de volta para `In Review` sem rejeição humana explícita

## Project Status: Blocked e Backlog

Agents **não** selecionam nem movem items em **`Blocked`** ou **`Backlog`** como fila.
