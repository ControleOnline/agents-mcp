# Master Publication

## Overview

Use esta skill quando `DevOps` for promover o **pacote RC** de `staging` para `master` (apos a task pai estar na coluna **`Deploy`**).

## Pre-requisitos

1. Existe um RC aberto com task pai de deploy e subtasks.
2. O pacote ja esta em **`staging`** (pai + submodulos) com versão **pre-release** `X.Y.Z-rc.N` (não a estável).
3. A task pai foi movida por humano para a coluna **`Deploy`**.
4. Nao ha segundo RC concorrente.

## Workflow

1. confirme o repositorio principal e os subprojetos em `.gitmodules`
2. trate **`staging`** como origem da publicacao para **`master`**
3. publique **primeiro cada submodulo** obrigatorio com delta, depois o projeto pai (gitlinks coerentes)
4. para cada repositorio com delta real entre `staging` e `master`, faça o merge/promocao autorizada (`staging` → `master`); use PR apenas se a politica do repo exigir — o rito operacional e a promocao do pacote RC, nao PR de task de produto
5. faca merge somente sem conflito e com a task pai em `Deploy`
6. depois do merge, **promova a versão** `X.Y.Z-rc.N` → **`X.Y.Z`** estável no pacote em `master` (package.json / tags)
7. confirme que `master` recebeu o commit esperado e que o push remoto aconteceu
8. registre quais repositorios foram promovidos e quais ficaram bloqueados
9. **obrigatório:** mova a **task pai e todas as filhas/subtasks** do inventário do RC para **`Done`** na mesma passagem (Project #1); não deixe filha atrás do pai
10. **handoff de documentação (obrigatório no publish):** para **cada filha de produto** do inventário que ainda **não** tenha `agent:technical-documenter:done` e/ou `agent:tutorial-assistant:done`, aplique as labels de **solicitação** ausentes (`agent:technical-documenter` e/ou `agent:tutorial-assistant`). **Nunca** invente `:done`. Issues só de governança/docs (`agents-mcp` puro) e hotfixes sem delta de UI/API de produto podem ficar isentas com comentário de exceção estrutural. Comente no pai do RC a lista do que recebeu label de docs.
11. se o projeto principal ficar com conflito, nao force update nem reescreva `master`; registre o bloqueio e pare na fronteira segura

## Front Rule

Quando o pedido for "publicar o front":

- trate o projeto principal como `app-community`, salvo contexto local mais especifico
- descubra os subprojetos em `.gitmodules`
- publique os subprojetos do front antes do projeto principal
- valide que os gitlinks do projeto principal apontam para commits ja publicados nos subprojetos


## Hotfix / deploy: ponteiro + versão no projeto principal

**Sem atualizar o gitlink do submódulo e a versão no projeto principal (`app-community`), o delta do subprojeto não entra no deploy** — mesmo que `ui-*` já esteja em `staging`/`master`.

Em **todo** deploy (RC normal ou hotfix):

1. Publique o delta nos **subprojetos** afetados (`staging` → `master` de cada um).
2. No **pai** (`app-community`):
   - atualize o **gitlink** (submodule pin) para o commit já publicado no subprojeto;
   - faça **bump semver** em `package.json` (patch para hotfix);
   - push em `staging` e em `master` (pai sempre depois dos filhos);
   - crie/atualize a **tag** da versão no pai (`vX.Y.Z`).
3. Confirme que o workflow de **Deploy** do `app-community` disparou no commit do pai.

Publicar só o submódulo (ex.: `ui-people`) **não** publica o Manager em produção.

## Output Contract

Ao concluir, informe:

- versão pre-release do RC e versão estável publicada em master
- quais repositorios foram publicados em `master`
- quais submodulos e o pai foram promovidos
- quais ficaram bloqueados e por que
- confirmacao de push remoto e coluna `Done`

## Quality Bar

- nao promova sem coluna `Deploy` na task pai
- nao pule subprojetos obrigatorios
- nao publique o projeto principal antes dos subprojetos
- nao force ref em `master` para contornar conflito
- nao abra novo RC ate este estar em `Done`
- nao marque só o pai em `Done` sem mover todas as filhas/subtasks do inventário do RC
- nao mover filhas de produto para `Done` no publish **sem** garantir labels de solicitação documental (`agent:technical-documenter` / `agent:tutorial-assistant`) quando `:done` ainda estiver ausente — handoff de docs é parte do rito de master
- nao publique `X.Y.Z-rc.N` como versão de produção; sempre estabilize para `X.Y.Z` em `master`
- nao use contador sequencial de RC (RC1/RC2) no lugar do SemVer
