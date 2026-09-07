# Smoke Test Business Flows

Skill canônica do catálogo oficial de **fluxos de negócio** usados em smoke tests no ecossistema ControleOnline.

Fonte única de verdade para associação de smokes a fluxos. Alterações no catálogo só por solicitação humana explícita.

## Governança

- **Somente humanos** autorizam inclusão, remoção ou alteração de fluxos neste catálogo.
- Agents (Developer, QA, qualquer papel) **não inventam** novos fluxos.
- Ao criar ou alterar um smoke test, o agent **deve declarar** o fluxo associado (um dos listados abaixo ou `outros`).
- Se o smoke não se encaixa em nenhum fluxo do catálogo, use o fluxo reservado **`outros`** e justifique na issue.
- Esta skill deve ser lida por Developer, QA e qualquer papel que escreva ou valide smoke.
- A wiki técnica do produto deve espelhar estes fluxos em:
  - `https://github.com/ControleOnline/app-community/wiki/Smoke-Test-Flows`
  - `https://github.com/ControleOnline/api-community/wiki/Smoke-Test-Flows`

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
4. Artefatos persistidos em diretório de resultados do smoke, com manifesto ou resumo indicando o fluxo.
5. Justificativa explícita quando um passo não puder gerar print por limitação técnica.

Falta de prints por etapa, prints que não permitem reconstruir a jornada ou smoke sem fluxo declarado bloqueiam `agent:qa:accepted`.

## Fluxos publicados na wiki (fonte vigente)

A página de fluxo publicada na wiki é a fonte de verdade para a jornada que o smoke deve cobrir. Integrações administrativas antigas são referências históricas e **não são gate de aceite**.

Antes de dar `agent:qa:accepted` em smoke de UI, o QA deve conferir o índice central da wiki e a página publicada do fluxo:

1. `fluxo: <id>` deve ser um item existente no catálogo;
2. o teste, manifesto ou comentário deve apontar para a página wiki do fluxo;
3. cada arquivo de smoke alterado deve declarar `fluxo: <id> | etapa: <id>` no topo, quando aplicável;
4. o manifesto deve listar os passos executados e os prints correspondentes;
5. a evidência deve cobrir cada etapa relevante da jornada publicada, com justificativa explícita para qualquer etapa não executada.

Smoke órfão (sem `fluxo: <id>`, página wiki, etapa ou manifesto de evidência) em entrega de UI **bloqueia** aceite. O comentário de recusa deve citar a página/etapa ausente ou a falta de print por etapa.

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
3. Em comentários de issue, evidência de QA ou descrição do smoke, declarar: `fluxo: <id>` e a página wiki correspondente.
4. Não criar aliases, sub-fluxos ou nomes paralelos sem atualização humana desta skill.
5. Smokes de infraestrutura, login genérico, healthcheck ou UI pontual sem jornada de negócio → `outros`, com justificativa objetiva.
6. Testes espalhados por módulo devem ser encaixados em um manifesto por fluxo publicado na wiki; o módulo/arquivo executado é detalhe de implementação.

## Relação com code-quality

Smoke tests continuam obrigatórios conforme `quality/code-quality.md`. Esta skill **não** substitui a exigência de smoke; padroniza a **classificação por fluxo de negócio** e torna obrigatório o gate de evidência visual completa.

## Fora de escopo desta skill

- Implementação dos arquivos de teste (Playwright, Postman, PHPUnit, etc.) nos repositórios de produto.
- Runners, workflows de CI ou inventário de arquivos de teste.
