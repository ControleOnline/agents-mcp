# Master Publication

## Overview

Use esta skill quando `DevOps` for promover o **delta de uma task individual** que está na coluna **`Deploy`** para `master`.

Integração contínua **por task**. **Não** existe pacote RC, task pai de RC, freeze de pacote nem inventário de filhas.

## Exceção estrutural: agents-mcp

Quando o repositório afetado for o próprio `ControleOnline/agents-mcp` e a mudança corrigir governança, regras, runners ou workflows do ecossistema, a publicação é um `hotfix` estrutural autorizado diretamente em `master`. Não exigir coluna `Deploy`, staging, QA de produto ou o pipeline de submódulos. Ainda são obrigatórios: issue/task, diff revisado, testes locais pertinentes, push não forçado e confirmação do SHA remoto.

## Pre-requisitos

1. A task está na coluna **`Deploy`** (movida por humano a partir de `In Review`), exceto pela regra de hotfix estrutural do `agents-mcp` acima.
2. O delta da task já está em **`staging`** (merge prévio de `task-{id}` → `staging` feito pelo DevOps).
3. Não há deploy anterior de `staging`/`master` falho/pendente sem causa resolvida.

## Workflow

Quando a task estiver em **`Deploy`**:

1. Auditar deploys/workflows anteriores mais recentes de `staging` e `master` (pai + submódulos obrigatórios). Se algum estiver falho, cancelado, pendente ou sem evidência de sucesso: descubra a causa, corrija ou registre bloqueio concreto e **pare sem publicar**.
   - **Smokes de browser/UI com problema:** se a auditoria encontrar smoke falho que não faça parte do delta imediato, abra/atualize issue técnica separada no repositório afetado, em `Ready`, com labels `hotfix` + `bug` + `agent:developer` (e label de página quando identificável), referenciando workflow/job/run e resumo sanitizado. A publicação só permanece bloqueada se a falha provar que **este** delta não é publicável; caso contrário a correção fica para P5 Developer.
2. Publique **primeiro cada submódulo** com delta real, depois o projeto pai (gitlinks coerentes).
3. Para cada repositório com delta entre `staging` e `master` relativo à task: merge/promoção autorizada (`staging` / `task-{id}` → `master`). Use PR apenas se a política do repo exigir — o rito é promoção do **delta da task**, não PR de produto do Developer.
4. Merge somente sem conflito e com a task em `Deploy`.
5. Quando a promoção exigir bump: grave versão **numérica** `X.Y.N` em `package.json` / `app.json` (sem sufixo textual). Tags usam a mesma versão.
6. Confirme que `master` recebeu o commit esperado e que o push remoto aconteceu.
7. **Mova a task para `Done`**.
8. **Handoff de documentação fail-closed:** se a task de produto ainda não tiver `agent:technical-documenter:done` e/ou `agent:tutorial-assistant:done`, aplique as labels de **solicitação** ausentes. Nunca invente `:done`. Issues só de governança/docs (`agents-mcp` puro) e hotfixes sem delta de UI/API de produto podem ficar isentas com comentário de exceção estrutural.

## Submódulos e projeto principal

Descubra os subprojetos em `.gitmodules`. Publique os subprojetos do front antes do projeto principal. Valide que os gitlinks do pai apontam para commits já publicados nos filhos.

**Sem atualizar o gitlink do submódulo e a versão no projeto principal (`app-community`), o delta do subprojeto não entra no deploy** — mesmo que `ui-*` já esteja em `staging`/`master`.

Em **todo** publish de task que toque submódulo + pai:

1. Publique o delta nos **subprojetos** afetados (`staging` → `master` de cada um).
2. No **pai** (`app-community`):
   - atualize o **gitlink** (submodule pin) para o commit já publicado no subprojeto;
   - faça **bump semver** numérico quando a promoção exigir;
   - push em `master` (pai sempre depois dos filhos);
   - crie/atualize a **tag** da versão no pai (`vX.Y.Z`) quando houver bump.
3. Confirme que o workflow de deploy do pai disparou no commit do pai quando aplicável.

Publicação de **artefato de produção** (FTP/Play/native) **não** é disparada no push imediato de `master`. Segue agendamento (ver `agents/roles/devops/agent.md`).

## Output Contract

Ao concluir, informe:

- quais repositórios foram publicados em `master`
- quais submódulos e o pai foram promovidos
- quais ficaram bloqueados e por que
- confirmação de push remoto e coluna `Done`
- handoff documental aplicado (labels de solicitação) ou isenção justificada

## Quality Bar

- não promova item que não esteja na coluna `Deploy`
- não promova se deploys anteriores de `staging`/`master` não tiverem finalizado corretamente
- não deixe smoke de browser/UI falho sem issue técnica de follow-up em `Ready` com `hotfix` + `bug` + `agent:developer`
- não pule subprojetos obrigatórios com delta
- não publique o projeto principal antes dos subprojetos
- não force ref em `master` para contornar conflito
- **não** monte RC, task pai de RC, freeze de pacote ou inventário de filhas
- não grave sufixo textual (`-rc.N`) em `package.json` / `app.json`
- em `app.json`: `version` = `package.json` version; `versionCode` = MAJOR*10000 + MINOR*100 + PATCH
- handoff de docs é parte do rito de master para tasks de produto
