# Smoke Test Business Flows

Skill canônica do catálogo oficial de **fluxos de negócio** usados em smoke tests no ecossistema ControleOnline.

Fonte única de verdade para associação de smokes a fluxos. Alterações no catálogo só por solicitação humana explícita.

## Governança

Nenhum agente pode adicionar testes smoke sem tarefa específica criada por humano
que peça explicitamente essa implementação. Verifique autoria, escopo e link na
fonte de verdade antes de adicionar ou ampliar smokes. Tarefa criada por agente,
mesmo usando conta humana, não autoriza novos smokes. A regra transversal vive
em `shared-quality-code-quality/SKILL.md`.
QA exige somente testes automatizados; smoke não é requisito geral de aceite.

- **Somente humanos** autorizam inclusão, remoção ou alteração de fluxos neste catálogo.
- Agents (Developer, QA, qualquer papel) **não inventam** novos fluxos.
- Ao criar ou alterar um smoke test, o agent **deve declarar** o fluxo associado (um dos listados abaixo ou `outros`).
- Se o smoke não se encaixa em nenhum fluxo do catálogo, use o fluxo reservado **`outros`** e justifique na issue.
- Esta skill deve ser lida por Developer, QA e qualquer papel que escreva ou valide smoke.
- A wiki técnica do produto deve espelhar estes fluxos em:
  - `https://github.com/ControleOnline/app-community/wiki/Smoke-Test-Flows`
  - `https://github.com/ControleOnline/api-community/wiki/Smoke-Test-Flows`

## Evidência complementar de smoke autorizado

Esta orientação se aplica somente à tarefa humana de smoke. Ela não redefine a
entrega de um teste automatizado: a implementação continua sendo o arquivo de
teste versionado, descoberto pelo runner e integrado na ref remota. Artefatos
gerados (`PNG`, screenshot, vídeo, trace, relatório ou manifesto) são apenas
evidência complementar e nunca substituem o teste automatizado.

Prints/screenshot documentam a jornada quando solicitados na tarefa humana; não são gate geral de QA.

Quando a tarefa humana solicitar documentação visual do smoke, registrar:

1. `fluxo: <id>` declarado no teste, manifesto, comentário ou evidência da issue.
2. Lista de passos do fluxo executado.
3. Print/screenshot de cada passo relevante, incluindo:
   - estado inicial/tela de entrada;
   - preenchimentos ou seleção de dados críticos;
   - ação principal;
   - feedback visual de sucesso, erro esperado ou estado final;
   - qualquer transição que prove integração entre módulos.
4. Quando a decisão for de aceite visual, artefatos persistidos em diretório de
   resultados do smoke, com manifesto ou resumo indicando o fluxo. Esses
   artefatos não são a implementação do smoke nem precisam ser publicados para
   uma task cujo objetivo seja somente integrar o teste automatizado.
5. Justificativa explícita quando um passo não puder gerar print por limitação técnica.

Ausência de prints por etapa ou manifesto não bloqueia o aceite de QA de tarefas comuns.

## Fluxos publicados na wiki (fonte operacional)

Os diagramas e jornadas oficiais **não ficam mais nos flowcharts do tenant
admin**. A fonte para documentar o smoke autorizado é a página publicada na wiki do produto,
conforme a decisão da CON-154.

Ao documentar um smoke autorizado de POS, SHOP, PPC, DELIVERY, CHECKOUT ou MANAGER,
consultar a wiki canônica vinculada ao smoke e registrar:

1. `wikiPage` ou o link da página publicada, sem exigir endpoint administrativo;
2. fluxo e etapa identificáveis na página e no teste/evidência (`fluxo: <id> |
   etapa: <id>` quando houver etapas);
3. manifesto/evidência apontando para a mesma wiki e prints/screenshot de cada
   etapa relevante da jornada.

Identificadores, links, endpoints e tokens administrativos não fazem parte do
contrato atual. Eles **não são gate de QA**, não devem ser solicitados e sua
ausência não bloqueia aceite quando a wiki publicada, o fluxo/etapa e a
evidência visual estiverem presentes.

A wiki e os prints complementam a documentação quando previstos na tarefa humana.
Não exigir sua publicação como condição geral de QA.

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

QA exige testes automatizados e não exige smokes. Esta skill classifica os smokes
cuja implementação foi solicitada em tarefa específica criada por humano;
o catálogo não autoriza nenhum agente a criar testes por iniciativa própria.

## Fora de escopo desta skill

- Implementação dos arquivos de teste (Playwright, Postman, PHPUnit, etc.) nos repositórios de produto.
- Runners, workflows de CI ou inventário de arquivos de teste.
