# Smoke Test Business Flows

Skill canônica do catálogo oficial de **fluxos de negócio** usados em smoke tests no ecossistema ControleOnline.

Fonte única de verdade para associação de smokes a fluxos. Alterações no catálogo só por solicitação humana explícita.

## Governança

- **Somente humanos** autorizam inclusão, remoção ou alteração de fluxos neste catálogo.
- Agents (Developer, QA, qualquer papel) **não inventam** novos fluxos.
- Ao criar ou alterar um smoke test, o agent **deve declarar** o fluxo associado (um dos listados abaixo ou `outros`).
- Se o smoke não se encaixa em nenhum fluxo do catálogo, use o fluxo reservado **`outros`** e justifique na issue.
- Esta skill deve ser lida por Developer, QA, Design, UX e qualquer papel que escreva ou valide smoke.
- A wiki técnica do produto deve espelhar estes fluxos em:
  - `https://github.com/ControleOnline/app-community/wiki/Smoke-Test-Flows`
  - `https://github.com/ControleOnline/api-community/wiki/Smoke-Test-Flows`

## Fonte canônica de suites e artifacts (aprovadores)

URL base e índice vêm de `config/ecosystem.config.json` (sem secrets):

| Chave | Valor canônico |
| --- | --- |
| `smoke.tests_base_url` | `https://s.controleonline.com/tests` |
| `smoke.tests_index_url` | `https://s.controleonline.com/tests/index.json` |
| `smoke.api_entrypoint` | `https://api.controleonline.com` |

Rotas de consumo:

| Fonte | Uso |
| --- | --- |
| `GET <SMOKE_TESTS_BASE_URL>` / `index.json` / `api` | Índice agregado de suites |
| `GET <SMOKE_TESTS_BASE_URL>/artifacts/{suiteId}/{arquivo}` | Reports e prints |
| `POST …/run` | Runner (quando habilitado no ambiente) |

**Credencial (secret):** Drive `tests.json` e `admin-api.json` (pasta de credenciais). Headers típicos: `api-token`, `app-domain`, `accept`. **Nunca** versionar token no git, issue, PR ou wiki.

QA, Design e UX **só** recusam por falta de print/smoke **depois** de consultar essa fonte (ou registrar falha de acesso com evidência).

## Gate obrigatório de evidência visual

QA **não pode aprovar** smoke test de UI/browser se a evidência não cobrir o fluxo inteiro com prints/screenshot.

Para cada smoke de UI/browser, a evidência mínima é:

1. `fluxo: <id>` declarado no teste, manifesto, comentário ou evidência da issue.
2. Lista de passos do fluxo executado.
3. Print/screenshot de cada passo relevante, incluindo:
   - estado inicial/tela de entrada;
   - preenchimentos ou seleção de dados críticos;
   - ação principal;
   - feedback visual de sucesso, erro esperado ou estado final;
   - qualquer transição que prove integração entre módulos.
4. Artefatos persistidos acessíveis via `<SMOKE_TESTS_BASE_URL>/artifacts/...` (ou caminho equivalente documentado no índice), com manifesto ou resumo indicando o fluxo.
5. Justificativa explícita quando um passo não puder gerar print por limitação técnica.

Falta de prints por etapa, prints que não permitem reconstruir a jornada ou smoke sem fluxo declarado bloqueiam `agent:qa:accepted`.

## Flowcharts publicados no admin (vínculo operacional)

O catálogo desta skill **não substitui** os flowcharts do tenant admin. Soma-se a eles.

Antes de dar `agent:qa:accepted` em smoke de UI dos produtos POS, SHOP, PPC, DELIVERY, CHECKOUT ou MANAGER, o QA **deve ler** os flowcharts habilitados:

1. `GET <API_ENTRYPOINT>/flowcharts` (e `/flowcharts/{id}` quando precisar do diagrama).
2. Headers permitidos (token **nunca** no git): `api-token` e `app-domain` do Drive.
3. Credencial: Drive `admin-api.json` / `tests.json`. Não colar o token em issue, PR, wiki ou arquivo versionado.
4. UI de conferência: `https://admin.controleonline.com/admin/flowcharts/{id}`.

O smoke só é aceito se:

- declarar um ou mais `flowchartIds` **existentes e `enabled`** no admin;
- tiver prints/screenshot de cada etapa relevante da jornada daquele flowchart;
- continuar declarando `fluxo: <id>` deste catálogo.

Smoke órfão (`fluxo: outros` **sem** `flowchartId` válido) em entrega de UI desses produtos **bloqueia** aceite. Comentário de recusa deve citar falta de flowchart ou falta de print por etapa **após** consulta a `/tests` e `/flowcharts`.

## Catálogo oficial

Cada entrada possui `id` estável, ator principal e nome legível.

| id | ator principal | nome |
| --- | --- | --- |
| `produto-cadastro` | backoffice / gestor | Cadastro de produtos |
| `compra-fluxo` | comprador / loja / POS | Compra |
| `device-configuracao` | admin / operador | Configuração de devices |
| `pedido-criacao` | vendedor / operador | Criação de pedido |
| `producao-fluxo` | produção / operação | Produção |
| `cliente-cadastro` | CRM / atendimento | Cadastro de cliente |
| `usuario-permissao` | admin | Usuários, permissões e autenticação |
| `financeiro-cobranca` | financeiro | Cobrança, pagamento e conciliação |
| `logistica-entrega` | logística / entrega | Entrega e logística |
| `relatorio-consulta` | gestor | Relatórios e consultas gerenciais |
| `integracao-api` | sistema / API | Integração API entre módulos |
| `outros` | qualquer | Outros (fallback com justificativa obrigatória) |

## Regras de uso

1. Todo smoke novo ou alterado deve referenciar **exatamente um** `id` da tabela (preferir o mais específico).
2. Preferir o fluxo de negócio real exercitado pelo teste; usar `outros` só quando não houver correspondência razoável.
3. Em comentários de issue, evidência de QA ou descrição do smoke, declarar: `fluxo: <id>`.
4. Não criar aliases, sub-fluxos ou nomes paralelos sem atualização humana desta skill.
5. Smokes de infraestrutura, login genérico, healthcheck ou UI pontual sem jornada de negócio → `outros`, com justificativa objetiva.
6. Testes espalhados por módulo devem ser encaixados em um manifesto por fluxo; o módulo/arquivo executado é detalhe de implementação.

## Relação com code-quality

Smoke tests continuam obrigatórios conforme `quality/code-quality.md`. Esta skill **não** substitui a exigência de smoke; padroniza a **classificação por fluxo de negócio** e torna obrigatório o gate de evidência visual completa.

## Fora de escopo desta skill

- Implementação dos arquivos de teste (Playwright, Postman, PHPUnit, etc.) nos repositórios de produto.
- Runners, workflows de CI ou inventário de arquivos de teste.
