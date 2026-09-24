# Integracao (dev) e staging (RC congelada)

## Regra geral

- Developer integra somente `task-{id}` em `dev`.
- DevOps monta uma branch `rc/X.Y.Z-rc.N` a partir do `master` atual.
- A RC recebe individualmente de 1 a 5 tasks com os quatro accepts.
- Depois do manifesto e freeze, o snapshot da RC e promovido para `staging`.
- Staging e ambiente de homologacao da **composicao congelada**, nao branch de trabalho.
- Depois da autorizacao humana em `Deploy`, DevOps promove a **mesma RC** para `master`.
- `staging -> master`, `dev -> staging` e branches agregadoras manuais sao proibidos.

Fonte: `shared-github-github-flow` + `shared-github-release-candidate`.

## Invalidacao

Qualquer commit, task, gitlink, SHA ou versao diferente do manifesto apos o freeze invalida a RC. Nao conserte a RC homologada em lugar: crie `rc.N+1`, gere novo manifesto e rode novamente os testes de composicao.

## Gates

A RC so congela com:
- 1 a 5 tasks;
- quatro accepts em cada task;
- base master registrada;
- SHAs completos de todos os repositorios/submodulos afetados;
- build da composicao;
- browser/smoke aplicavel;
- API/Postman aplicavel;
- regressao dos bugs cobertos;
- ausencia de mudanca fora do manifesto.

## Ownership

Developer nao publica staging/master. DevOps cria/promove RC. Manager controla board. Humano autoriza Deploy.
