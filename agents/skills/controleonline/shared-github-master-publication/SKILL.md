# Master Publication

## Overview

Use esta skill quando `DevOps` for promover um **RC inventariado** para `master` (apos o RC pai estar na coluna **`Deploy`**).

A publicação promove a **mesma RC** homologada em staging, sem recompor o pacote.
Nunca use `staging` como origem única para `master`; qualquer alteração depois do
freeze exige `rc.N+1` e nova homologação.

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

1. Existe um RC aberto, com inventário de tasks e SHAs, pronto para publicação.
2. O delta dessa task está publicado na branch remota individual. Por padrão,
   ele deve passar pelos testes locais reproduzíveis exigidos pelo workflow de
   produção; o DevOps pode receber `force_deploy: true` (ou usar o switch
   temporário `DEVOPS_FORCE_DEPLOY=true`) para pular somente essa exigência.
   Não é necessário aguardar uma publicação prévia em **`staging`**.
3. O RC pai foi movido por humano para a coluna **`Deploy`**, com ou sem os quatro accepts nas filhas; essa mudança é a autorização explícita de publicação.
4. O branch `staging` só pode ser usado como origem quando representar exatamente
   o RC inventariado e a operação informar `rc_id` + `rc_inventory_confirmed=true`.

## Workflow

1. confirme o repositorio principal e os subprojetos em `.gitmodules`
2. trate somente as branches inventariadas no **RC** como origem da publicação para **`master`**; nunca use o branch agregado `staging` como origem única
3. antes de promover qualquer versão, leia a política `force_deploy` e registre
   a decisão no handoff. Sem o force, confirme o resultado verde dos testes
   locais do commit/branch da task; com o force, registre que o gate foi
   explicitamente pulado. Em ambos os casos, audite os deploys/workflows de
   `master` que possam afetar diretamente a mesma publicação. Não espere testes
   via API ou deploy remoto de `staging` para validar a task;
   falhas remotas não relacionadas ao delta devem ser registradas como
   acompanhamento separado, sem travar a fila de produção.
   - **Smokes de browser/UI com problema:** quando a auditoria encontrar smoke falho que nao faca parte do RC imediato a publicar, nao transforme isso em comentario solto nem misture com outra task. Abra ou atualize uma issue tecnica separada no repositorio afetado, em `Ready`, com labels `hotfix` + `bug` + `agent:developer` (e label de pagina quando identificavel), referenciando o workflow/job/run, fluxo (`fluxo: <id>` ou `outros`) e resumo sanitizado da falha. A publicacao so permanece bloqueada se a falha provar que o RC atual nao esta publicavel; caso contrario, a correcao fica para a **P5 Developer** do Manager.
4. publique **primeiro cada submodulo** obrigatorio com delta, depois o projeto pai (gitlinks coerentes)
5. para cada repositorio com delta real do **RC**, faça os merges/promoções autorizadas das branches inventariadas (`task-{id}` → `master`); use PR apenas se a política do repo exigir. Recuse qualquer origem fora do inventário ou merge de task pós-freeze sem autorização humana. Nunca substitua os merges por apontamento direto para SHA, commit de task ou simples atualização de gitlink.
6. antes de cada merge, aplique o **Gate de atenção redobrada**: confirme
   `merge-base`, SHAs de origem/destino e atualidade da origem; revise o diff do
   resultado final contra a intenção e os requisitos negativos de cada task;
   valide que nenhuma alteração independente foi restaurada ou perdida. Em
   submódulos, revise também o diff do filho e o gitlink resultante no pai.
   Merge sem conflito não é evidência suficiente. Se a revisão falhar ou houver
   divergência sem explicação, aborte e pare sem publicar.
7. faca merge somente sem conflito e com o RC pai em `Deploy`
8. antes do merge, gere uma nova versão estável numérica para este RC (SemVer,
   sem `-rc` nos arquivos de produto), atualizando os arquivos de versão
   exigidos pelo projeto e a tag/registro correspondente.
9. depois do merge, confirme a versão numérica (`X.Y.N` em `package.json` e,
   se existir, `app.json` com `version` igual e `versionCode = MAJOR*10000 +
   MINOR*100 + PATCH`).
10. confirme que `master` recebeu o commit esperado e que o push remoto aconteceu
11. devolva ao Manager um handoff sanitizado com SHA, versão, repositórios,
    runtime e os quatro accepts observados. O DevOps não move a task para
    `Done` ou `Working`.
12. O Manager move para **`Done`** somente com os quatro accepts. Sem qualquer
    accept, move para **`Working`** e reativa no Paperclip os validadores
    pendentes; com rejeição, aciona o Developer para correção e depois os
    validadores para revalidação.
13. Depois de mover para `Done`, o Manager cria no Paperclip as tasks filhas
    para `Technical Documenter` e `Tutorial Assistant`, quando aplicáveis.
14. se o projeto principal ficar com conflito, nao force update nem reescreva `master`; registre o bloqueio e pare na fronteira segura

## Front Rule

Quando o pedido for "publicar o front":

- trate o projeto principal como `app-community`, salvo contexto local mais especifico
- descubra os subprojetos em `.gitmodules`
- publique os subprojetos do front antes do projeto principal
- valide que os gitlinks do projeto principal apontam para commits ja publicados nos subprojetos


## Hotfix / deploy: ponteiro + versão no projeto principal

**Sem atualizar o gitlink do submódulo e a versão no projeto principal (`app-community`), o delta do subprojeto não entra no deploy** — mesmo que `ui-*` já esteja em `staging`/`master`.

Em **todo** deploy (task normal ou hotfix):

    1. Publique somente os deltas inventariados do **RC** nos **subprojetos** afetados; nunca promova `staging` fora de um RC confirmado.
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

- nao promova sem coluna `Deploy` no RC pai
- sem `force_deploy`, nao promova sem o gate local verde e sem resolver uma
  falha anterior de `master` que afete diretamente o mesmo artefato; com
  `force_deploy`, registre o bypass e preserve a validação de runtime. Staging
  remoto não é pré-requisito
- nao deixe smoke de browser/UI falho sem issue tecnica de follow-up em `Ready` com `hotfix` + `bug` + `agent:developer`
- nao pule subprojetos obrigatorios
- nao publique o projeto principal antes dos subprojetos
- nao force ref em `master` para contornar conflito
- publique o RC completo e somente as tasks que constam no inventário congelado
- nao marque uma task em `Done` sem a evidência da sua própria publicação
- após o Manager mover a task para `Done`, criar no Paperclip as filhas
  documentais aplicáveis; `:done` dos documentadores não é pré-requisito para
  concluir a publicação
- nao grave sufixo textual (`-rc.N`) em `package.json` / `app.json`; versão de arquivo é sempre somente números (`X.Y.N`)
- nao use contador sequencial de RC (RC1/RC2) no lugar do SemVer nos arquivos de versão
- em `app.json`: `version` = `package.json` version; `versionCode` = MAJOR*10000 + MINOR*100 + PATCH
