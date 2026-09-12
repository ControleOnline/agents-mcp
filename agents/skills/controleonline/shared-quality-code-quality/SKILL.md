# Code Quality Skill

## Objetivo

Definir a barra comum de qualidade de codigo para `Developer` e `Quality Assurance` no ecossistema `ControleOnline`.

Esta skill e a fonte oficial para criterios compartilhados de:

- modularizacao
- tamanho de arquivos e componentes
- cobertura de testes
- smoke tests
- reuso de contratos e componentes
- manutencao de mudancas pequenas e rastreaveis

## Regra central

Nenhuma mudanca de codigo deve ser considerada pronta sem cumprir a barra de qualidade desta skill.

Se houver conflito entre um AGENTS local e esta skill para criterios de qualidade compartilhados, esta skill prevalece.

## Critérios obrigatorios

- mudanças devem ser pequenas, isoladas e focadas
- cada componente, classe ou helper deve permanecer pequeno e com responsabilidade unica
- tamanho recomendado de componente/arquivo e abaixo de 200 linhas
- limite absoluto de componente/arquivo e 500 linhas; acima disso, a mudanca deve ser quebrada antes de aprovar
- se a regra de modularizacao puder ser respeitada com divisao simples, a divisao deve acontecer na mesma entrega
- reutilize componentes, stores, helpers e contratos existentes antes de criar duplicatas
- nao replique contrato de tela, store ou API quando a base compartilhada ja existir
- qualquer mudanca visivel em browser exige smoke test
- qualquer mudanca funcional deve ter testes automatizados adequados ao risco
- a ausencia de smoke test bloqueia a aprovacao de UI, fluxo visual ou contrato de navegador
- a ausencia de teste automatizado adequado bloqueia a aprovacao de mudanca funcional
- lint, testes e smoke devem ser executados ou explicitamente bloqueados com justificativa objetiva
- o resultado da validacao deve ser descrito com o escopo real do que foi coberto

## Teste automatizado versionado x artefato de execução

A entrega de um teste é o **código automatizado versionado**, integrado na task e
publicado no destino previsto (`dev` para Developer). Ela exige:

1. arquivo de teste executável (por exemplo, PHPUnit, Jest, Node test ou Playwright);
2. comando ou runner que descubra o teste em auditorias futuras;
3. execução registrada com o resultado real, ou bloqueio técnico objetivo;
4. commit remoto da task e merge remoto no destino previsto.

PNG, screenshot, vídeo, trace, `report.json`, manifesto ou índice gerado pelo
runner são **artefatos de execução**. Eles podem complementar uma auditoria
visual, mas não são a entrega do teste, não substituem o código automatizado e
não devem ser publicados como se fossem a implementação da task. Não crie uma
task de produto apenas para armazenar artefatos quando o pedido for integrar
testes automatizados.

Para uma task cujo objetivo é integrar ou corrigir testes automatizados, QA
deve validar primeiro o teste versionado, sua descoberta pelo runner e seu
resultado. Prints e manifestos só são gate adicional quando a própria task
exigir revisão visual da interface; nesse caso, continuam sendo evidência, não
substituto do teste executável.

Em aceite visual de UI/browser, evidência parcial bloqueia QA (`evidencia parcial bloqueia QA`); essa regra não converte artefatos gerados em implementação de teste automatizado.


## Fluxos de negócio (smoke)

Smokes devem ser associados a um fluxo do catálogo canônico em `quality/smoke-test-flows.md`.

- Agents **não** inventam novos fluxos; só humanos autorizam mudanças no catálogo.
- Ao criar/alterar smoke, declarar o fluxo (`fluxo: <id>`). Sem coerência → usar `outros`.
- QA deve recusar smoke de UI/browser local que não tenha prints/screenshot cobrindo todas as etapas relevantes do fluxo.
- QA deve recusar smoke de UI sem referência de flowchart no teste quando o fluxo exigir essa associação, ou sem prints por etapa. A confirmação de `flowchartIds` existentes e `enabled` no servidor é responsabilidade do DevOps após promoção.
- Ver a skill completa para o catálogo e regras de governança.

## Uso por papel

- `Developer` usa esta skill antes de encerrar a propria entrega
- `Quality Assurance` usa esta skill antes de aprovar ou devolver a entrega

## Sinais de aprovacao

Uma entrega so avanca quando:

- a base ficou modularizada
- os arquivos e componentes ficaram pequenos o suficiente
- os testes relevantes existem e passam, ou existe bloqueio externo documentado
- os smoke tests existem para fluxos visiveis no browser e devem permanecer
  versionados no repositório onde o runner os descobre
- a evidência cobre o comportamento que mudou e, quando houver UI/browser, contém prints por etapa do fluxo inteiro

## Sinais de rejeicao

Devolva a entrega quando:

- faltar teste apropriado
- faltar smoke test em mudanca de UI
- teste automatizado ausente, não descoberto pelo runner ou não integrado na
  ref remota prevista
- smoke de UI/browser usado como gate visual local sem prints por etapa ou sem
  `fluxo: <id>` quando aplicável
- houver componente ou arquivo grande demais sem quebra aceitavel
- a mudanca duplicar contrato que ja existe em shared/store/component
- a mudanca tornar o codigo mais centralizado, dificil de reaproveitar ou dificil de testar
