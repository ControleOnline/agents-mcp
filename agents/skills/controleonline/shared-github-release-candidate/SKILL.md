# Release Candidate Freeze

## Objetivo

Homologar a composicao real antes de producao sem voltar ao modelo de staging acumulativo.

## Contrato

- `Working` continua limitado a no maximo 5 tasks.
- `dev` integra somente branches individuais `task-{id}`.
- Uma RC contem de **1 a 5** tasks ja integradas/aceitas para composicao.
- A branch da RC usa `rc/X.Y.Z-rc.N`.
- A RC nasce do `master` remoto atual e recebe somente os deltas das tasks listadas no manifesto.
- **Antes de criar/congelar a RC**, atualize `package.json.version` e `app.json.expo.version` para a versão estável `X.Y.Z` da RC. Ambos devem ser iguais ao `manifest.version` e à versão do nome da branch `rc/X.Y.Z-rc.N`; não grave `-rc.N` nos arquivos de versão do produto.
- Faça a atualização dos arquivos dentro do snapshot pré-freeze e confira a igualdade entre os três valores antes de criar o manifesto congelado. Nunca corrija arquivos de versão depois do freeze: qualquer divergência descoberta depois dele exige descartar a candidata e criar `rc.N+1`.
- O manifesto `.release/rc-manifest.json` e obrigatorio e imutavel depois do freeze.
- `staging` deve representar exatamente o snapshot congelado da RC.
- Qualquer mudanca de SHA, task, gitlink, versao ou arquivo depois do freeze invalida a homologacao e exige nova RC.
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
  "frozen": true
}
```

Regras:
- `tasks`: 1..5 numeros unicos.
- `branch` deve corresponder a `version` + `rc`.
- `baseMaster` e todos os SHAs devem ser completos e registrados antes da homologacao.
- Cada gitlink do pai deve apontar para commit ja integrado na branch de RC correspondente do submodulo.
- O manifesto homologado e comparado byte-a-byte/semanticamente no gate de master.

## Freeze

1. Atualize `master`.
2. Selecione no maximo 5 tasks elegiveis.
3. Crie a RC a partir desse `master`.
4. Integre cada task separadamente, registrando a ordem e o SHA resultante.
5. Defina a versão estável `X.Y.Z`, atualize `package.json.version` e `app.json.expo.version` para ela e valide os dois valores contra o nome da branch RC.
6. Gere o manifesto com a mesma versão `X.Y.Z`.
7. Crie a RC já congelada (`frozen: true`); não existe janela editável após o freeze.
8. Promova o snapshot para `staging`.
9. Rode build, browser/smoke, API/Postman e regressao da composicao.
10. Se qualquer correcao for necessaria, **nao altere a RC homologada**: gere `rc.N+1`.
11. Quando o humano autorizar Deploy, promova a mesma RC congelada para `master`.

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
