# Master Publication

## Overview

Use esta skill quando `DevOps` for promover o **pacote RC** de `staging` para `master` (apos a task pai estar na coluna **`Deploy`**).

## Pre-requisitos

1. Existe um RC aberto com task pai de deploy e subtasks.
2. O pacote ja esta em **`staging`** (pai + submodulos) com versao semver definida.
3. A task pai foi movida por humano para a coluna **`Deploy`**.
4. Nao ha segundo RC concorrente.

## Workflow

1. confirme o repositorio principal e os subprojetos em `.gitmodules`
2. trate **`staging`** como origem da publicacao para **`master`**
3. publique **primeiro cada submodulo** obrigatorio com delta, depois o projeto pai (gitlinks coerentes)
4. para cada repositorio com delta real entre `staging` e `master`, faça o merge/promocao autorizada (`staging` → `master`); use PR apenas se a politica do repo exigir — o rito operacional e a promocao do pacote RC, nao PR de task de produto
5. faca merge somente sem conflito e com a task pai em `Deploy`
6. depois do merge, confirme que `master` recebeu o commit esperado e que o push remoto aconteceu
7. registre quais repositorios foram promovidos e quais ficaram bloqueados
8. **obrigatório:** mova a **task pai e todas as filhas/subtasks** do inventário do RC para **`Done`** na mesma passagem (Project #1); não deixe filha atrás do pai
9. se o projeto principal ficar com conflito, nao force update nem reescreva `master`; registre o bloqueio e pare na fronteira segura

## Front Rule

Quando o pedido for "publicar o front":

- trate o projeto principal como `app-community`, salvo contexto local mais especifico
- descubra os subprojetos em `.gitmodules`
- publique os subprojetos do front antes do projeto principal
- valide que os gitlinks do projeto principal apontam para commits ja publicados nos subprojetos

## Output Contract

Ao concluir, informe:

- versao semver do RC
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
