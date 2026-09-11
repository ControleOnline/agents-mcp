# Master Publication

## Overview

Use esta skill quando `DevOps` for promover uma **task individual** para `master` (apos essa task estar na coluna **`Deploy`**).

**Contrato obrigatório:** toda promoção deve ser feita por merge ou por Pull
Request aprovado e mergeado. Nunca publique alterando apenas um gitlink, SHA,
branch protegida ou commit isolado. O submódulo deve ser integrado primeiro e
o pai deve receber, em seguida, um commit de merge com o gitlink desse commit
já integrado.

Se houver conflito amplo ou divergência que impeça revisar o delta, aborte a
operação. Após confirmar que a branch de task pode ser descartada, apague-a,
recrie-a do `master` remoto atualizado e reaplique a correção do zero; depois
repita os merges/PRs e os testes de `dev`, `staging` e `master`. Nunca contorne
conflito com force-push, gitlink direto, SHA isolado ou escolha cega de lado.
Ao recriar a task, retorne-a para `Working`, remova decisões/aceites herdados e
reative as labels de solicitação dos validadores (`agent:qa`,
`agent:security`, `agent:design`, `agent:ux`). Só depois do novo merge em `dev`
ela pode voltar a percorrer `In Review`/`Deploy`.

## Pre-requisitos

1. Existe uma task individual aberta e pronta para publicação.
2. O delta dessa task está publicado na branch remota individual e passou pelos
   testes locais reproduzíveis exigidos pelo workflow de produção; não é
   necessário aguardar uma publicação prévia em **`staging`**.
3. Essa task foi movida por humano para a coluna **`Deploy`**, com ou sem os quatro accepts; essa mudança é a autorização explícita de publicação.
4. O branch agregado `staging` nunca é usado como origem de publicação em `master`.

## Workflow

1. confirme o repositorio principal e os subprojetos em `.gitmodules`
2. trate somente a **branch da task** (`task-{id}`) como origem da publicação para **`master`**; nunca use o branch agregado `staging`
3. antes de promover qualquer versão, confirme o resultado verde dos testes
   locais do commit/branch da task e audite os deploys/workflows de `master` que
   possam afetar diretamente a mesma publicação. Não espere testes via API ou
   deploy remoto de `staging` para validar uma task que já passou no gate local;
   falhas remotas não relacionadas ao delta devem ser registradas como
   acompanhamento separado, sem travar a fila de produção.
   - **Smokes de browser/UI com problema:** quando a auditoria encontrar smoke falho que nao faca parte do delta imediato a publicar, nao transforme isso em comentario solto nem misture com outra task. Abra ou atualize uma issue tecnica separada no repositorio afetado, em `Ready`, com labels `hotfix` + `bug` + `agent:developer` (e label de pagina quando identificavel), referenciando o workflow/job/run, fluxo (`fluxo: <id>` ou `outros`) e resumo sanitizado da falha. A publicacao so permanece bloqueada se a falha provar que a task atual nao esta publicavel; caso contrario, a correcao fica para a **P5 Developer** do Manager.
4. publique **primeiro cada submodulo** obrigatorio com delta, depois o projeto pai (gitlinks coerentes)
5. para cada repositorio com delta real da **task individual**, faça o merge/promoção autorizada (`task-{id}` → `master`); use PR apenas se a política do repo exigir. Recuse qualquer PR com `head=staging` ou qualquer merge que agrupe mais de uma task. Nunca substitua esse merge por apontamento direto para SHA, commit de task ou simples atualização de gitlink.
6. antes de cada merge, aplique o **Gate de atenção redobrada**: confirme
   `merge-base`, SHAs de origem/destino e atualidade da origem; revise o diff do
   resultado final contra a intenção e os requisitos negativos de cada task;
   valide que nenhuma alteração independente foi restaurada ou perdida. Em
   submódulos, revise também o diff do filho e o gitlink resultante no pai.
   Merge sem conflito não é evidência suficiente. Se a revisão falhar ou houver
   divergência sem explicação, aborte e pare sem publicar.
7. faca merge somente sem conflito e com a task individual em `Deploy`
8. depois do merge, **confirme a versão numérica** já presente no pacote (`X.Y.N` em `package.json` e, se existir, `app.json` com `version` igual e `versionCode = MAJOR*10000 + MINOR*100 + PATCH`); **não** existe sufixo textual para remover; tags usam a mesma versão numérica
9. confirme que `master` recebeu o commit esperado e que o push remoto aconteceu
10. registre quais repositorios foram promovidos e quais ficaram bloqueados
11. Após a publicação, mova a task para **`Done`** somente se ela possuir os quatro accepts (`agent:qa:accepted`, `agent:security:accepted`, `agent:design:accepted`, `agent:ux:accepted`). Se faltar qualquer accept, mantenha a issue aberta, mova-a para **`Working`** e reative a segunda rodada de validação; não trate a publicação como aceite dos validadores.
12. **handoff de documentação (obrigatório no publish):** para **cada filha de produto** do inventário que ainda **não** tenha `agent:technical-documenter:done` e/ou `agent:tutorial-assistant:done`, aplique as labels de **solicitação** ausentes (`agent:technical-documenter` e/ou `agent:tutorial-assistant`). **Nunca** invente `:done`. Issues só de governança/docs (`agents-mcp` puro) e hotfixes sem delta de UI/API de produto podem ficar isentas com comentário de exceção estrutural. Comente no pai do RC a lista do que recebeu label de docs.
13. se o projeto principal ficar com conflito, nao force update nem reescreva `master`; registre o bloqueio e pare na fronteira segura

## Front Rule

Quando o pedido for "publicar o front":

- trate o projeto principal como `app-community`, salvo contexto local mais especifico
- descubra os subprojetos em `.gitmodules`
- publique os subprojetos do front antes do projeto principal
- valide que os gitlinks do projeto principal apontam para commits ja publicados nos subprojetos


## Hotfix / deploy: ponteiro + versão no projeto principal

**Sem atualizar o gitlink do submódulo e a versão no projeto principal (`app-community`), o delta do subprojeto não entra no deploy** — mesmo que `ui-*` já esteja em `staging`/`master`.

Em **todo** deploy (task normal ou hotfix):

1. Publique somente o delta da **task individual** nos **subprojetos** afetados (`task-{id}` → `master` de cada um); nunca promova `staging` como conjunto.
2. No **pai** (`app-community`):
   - atualize o **gitlink** (submodule pin) somente dentro do commit de merge que promove a branch integrada do subprojeto; não publique um SHA de task isolado como substituto do merge;
   - faça **bump semver** em `package.json` (patch para hotfix);
   - push em `staging` e em `master` (pai sempre depois dos filhos);
   - crie/atualize a **tag** da versão no pai (`vX.Y.Z`).
3. Confirme que o workflow de **Deploy** do `app-community` disparou no commit do pai.

Publicar só o submódulo (ex.: `ui-people`) **não** publica o Manager em produção.

## Output Contract

Ao concluir, informe:

- versão da task e versão estável publicada em master
- quais repositorios foram publicados em `master`
- quais submodulos e o pai foram promovidos
- quais ficaram bloqueados e por que
- confirmacao de push remoto e coluna final: `Done` com quarteto; `Working` sem quarteto para segunda validacao

## Quality Bar

- nao promova sem coluna `Deploy` na task individual
- nao promova sem o gate local verde e sem resolver uma falha anterior de
  `master` que afete diretamente o mesmo artefato; staging remoto não é
  pré-requisito
- nao deixe smoke de browser/UI falho sem issue tecnica de follow-up em `Ready` com `hotfix` + `bug` + `agent:developer`
- nao pule subprojetos obrigatorios
- nao publique o projeto principal antes dos subprojetos
- nao force ref em `master` para contornar conflito
- nao agrupe tasks em um RC para publicação
- nao marque uma task em `Done` sem a evidência da sua própria publicação
- nao mover filhas de produto para `Done` no publish **sem** garantir labels de solicitação documental (`agent:technical-documenter` / `agent:tutorial-assistant`) quando `:done` ainda estiver ausente — handoff de docs é parte do rito de master
- nao grave sufixo textual (`-rc.N`) em `package.json` / `app.json`; versão de arquivo é sempre somente números (`X.Y.N`)
- nao use contador sequencial de RC (RC1/RC2) no lugar do SemVer nos arquivos de versão
- em `app.json`: `version` = `package.json` version; `versionCode` = MAJOR*10000 + MINOR*100 + PATCH
