# Master Publication

## Overview

Produção publica uma **Release Candidate congelada e previamente homologada em staging**. A RC é artefato técnico, nunca issue/task agregadora, e contém de 1 a 5 tasks.

Leia antes: `shared-github-github-flow/SKILL.md`, `shared-github-release-candidate/SKILL.md` e `shared-github-conflict-resolution/SKILL.md`.
Para dependencias first-party e tags de pacotes, aplique tambem
`shared-github-published-module-dependencies/SKILL.md`.

## Pré-requisitos

1. Branch `rc/X.Y.Z-rc.N` existente.
2. `.release/rc-manifest.json` válido, `frozen: true`, com 1..5 tasks e SHAs completos.
3. A mesma RC foi homologada em staging com build/smokes aplicáveis.
4. Todas as tasks da RC foram autorizadas pelo humano em `Deploy`.
5. HEAD, SHAs e gitlinks continuam idênticos aos homologados.
6. Nenhum commit entrou na RC depois do snapshot homologado.

## Publicação

1. Releia o manifesto homologado e compare com a RC atual.
2. Confirme `baseMaster`. Se master mudou desde a montagem e a divergência puder alterar a composição, gere nova RC sobre master atual e re-homologue.
3. Confirme que cada repositório/submódulo aponta para o SHA homologado.
4. Confirme ausência de downgrade silencioso de gitlink.
5. Confirme build, browser/smoke, API/Postman e regressão exigidos para a RC.
6. Promova `rc/X.Y.Z-rc.N` diretamente para `master` por merge/PR conforme a proteção. **Nunca use `staging` como origem.**
7. O resultado em master deve representar o mesmo snapshot homologado; composição diferente falha fechado.
8. Gere a tag estável `vX.Y.Z` somente depois da promoção verde.
9. Publique/tagueie cada pacote first-party a partir do package version e SHA
   exatos registrados no manifesto congelado; Packagist deve receber a tag VCS
   do pacote PHP e npm o package version aprovado. Nunca retagueie versão
   existente.
10. Confirme que instalação via lockfiles não reescreveu manifests, versões ou
    SHAs aprovados; verifique `vendor/` no PHP e `node_modules/` no frontend.
11. Rode smokes pós-deploy e registre o SHA anterior para rollback determinístico.
12. Manager decide o estado final de cada task individual.

## Versão

- `package.json` / `app.json`: `X.Y.Z`.
- Atualize todos os arquivos de versao da aplicacao para `X.Y.Z` antes do freeze
  da RC; `rc.N` e apenas o numero do candidato e nao altera a versao estavel do
  app.
- O manifesto congelado lista, por dependencia first-party, nome, ecossistema,
  versao exata, repositorio, SHA e tag pretendida. No Deploy, NPM usa o valor
  `package.json.version`; Composer/Packagist recebe tag VCS derivada da versao
  exata aprovada para aquele package.
- Branch técnica: `rc/X.Y.Z-rc.N`.
- Uma RC pode conter até 5 tasks; a versão estável representa o lote homologado.
- Alteração depois do freeze gera `rc.N+1`.

## Fail closed

Bloqueie quando houver manifesto inválido, mais de 5 tasks, task sem autorização Deploy, SHA/gitlink diferente do homologado, teste obrigatório falho, divergência de master que mude a composição, ou origem `staging`, `dev`, `release/*`/agregadora manual.

## Rollback

Antes do merge grave o SHA anterior de cada repositório publicado. Se smoke de produção falhar, reverta para esses SHAs e devolva as tasks ao fluxo de correção/revalidação. Não monte uma nova combinação diretamente em produção.
