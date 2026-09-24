# Release Candidate Freeze

## Objetivo

Homologar a composicao real antes de producao sem voltar ao modelo de staging acumulativo.

## Contrato

- `Working` continua limitado a no maximo 5 tasks.
- `dev` integra somente branches individuais `task-{id}`.
- Uma RC contem de **1 a 5** tasks ja integradas/aceitas para composicao.
- A branch da RC usa `rc/X.Y.Z-rc.N`.
- A RC nasce do `master` remoto atual e recebe somente os deltas das tasks listadas no manifesto.
- O manifesto `.release/rc-manifest.json` e obrigatorio e imutavel depois do freeze.
- `staging` deve representar exatamente o snapshot congelado da RC.
- Qualquer mudanca de SHA, task, gitlink, versao ou arquivo depois do freeze invalida a homologacao e exige nova RC.
- Versoes dos apps e mapeamento/tag das dependencias publicadas seguem `shared-github-published-module-dependencies/SKILL.md` e entram no manifesto antes do freeze.
- `master` recebe somente a **mesma RC homologada**, com os mesmos SHAs do manifesto aprovado.
- Nunca publicar o branch agregado `staging` como origem de `master`.
- Nunca criar RC pai/issue agregadora. RC e artefato tecnico de release, nao task de produto.

## Manifesto minimo

```json
{
  "version": "1.10.27",
  "rc": 1,
  "branch": "rc/1.10.27-rc.1",
  "baseMaster": "<sha>",
  "tasks": [821, 826, 827],
  "repositories": {
    "ControleOnline/app-community": "<sha>",
    "ControleOnline/ui-common": "<sha>"
  },
  "packages": [
    {
      "name": "<package-name>",
      "ecosystem": "npm|composer",
      "version": "<exact-version>",
      "repository": "ControleOnline/<repo>",
      "sourceSha": "<sha>",
      "tag": "v<exact-version>"
    }
  ],
  "frozen": true
}
```

Regras:
- `tasks`: 1..5 numeros unicos.
- `branch` deve corresponder a `version` + `rc`.
- `baseMaster` e todos os SHAs devem ser completos e registrados antes da homologacao.
- Cada gitlink do pai deve apontar para commit ja integrado na branch de RC correspondente do submodulo.
- Cada pacote first-party usado em producao deve ter versao exata, repositorio,
  SHA e tag de publicacao explicitados no manifesto; nao inferir tags a partir
  apenas da versao do app.
- O manifesto homologado e comparado byte-a-byte/semanticamente no gate de master.

## Freeze

1. Atualize `master`.
2. Selecione no maximo 5 tasks elegiveis.
3. Crie a RC a partir desse `master`.
4. Antes do freeze, atualize todos os arquivos de versao da aplicacao para `X.Y.Z`; mantenha a mesma
   versao estavel para `rc.N+1`, salvo se a propria versao-alvo mudar.
5. Integre cada task separadamente, registrando a ordem e o SHA resultante.
6. Trave as dependencias publicadas e seus SHAs/tags de producao.
7. Gere o manifesto com versao, pacotes e refs completos.
8. Marque `frozen: true`.
9. Promova o snapshot para `staging`.
10. Rode build, browser/smoke, API/Postman e regressao da composicao.
11. Se qualquer correcao for necessaria, **nao altere a RC homologada**: gere `rc.N+1`.
12. Somente apos Deploy autorizado, publique as versoes/tag dos pacotes nos SHAs
    congelados e promova a mesma RC para `master`.

## Gate de producao

Antes de master:
- manifesto existe e esta congelado;
- RC contem de 1 a 5 tasks;
- HEAD da RC e os SHAs por repositorio sao os mesmos homologados em staging;
- staging nao recebeu commit posterior ao snapshot;
- build/smokes da composicao passaram;
- nenhuma mudanca fora do manifesto entrou;
- submodulos nao sofreram downgrade silencioso;
- versao estavel final deriva da RC homologada.

Se qualquer item divergir, falhar fechado e gerar nova RC.
