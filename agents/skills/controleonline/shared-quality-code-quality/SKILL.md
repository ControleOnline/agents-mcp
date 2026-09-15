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
- QA exige testes automatizados adequados ao escopo, inclusive em mudanças de UI
- qualquer mudanca funcional deve ter testes automatizados adequados ao risco
- ausência de smoke, prints, manifesto ou wiki de smoke não bloqueia o aceite de QA
- a ausencia de teste automatizado adequado bloqueia a aprovacao de mudanca funcional
- lint e testes automatizados do escopo devem ter resultados de execução verificáveis
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
resultado. Prints e manifestos são evidência complementar; QA não exige
smokes nem artefatos visuais como condição geral de aceite.


## Fluxos de negócio (smoke)

Nenhum agente pode adicionar testes smoke sem uma tarefa específica criada por humano
que solicite explicitamente essa implementação. Antes de adicionar um smoke,
verifique a autoria humana e o escopo da tarefa na fonte de verdade e registre
seu link. Autoria desconhecida, tarefa criada por agente (mesmo usando conta
humana), pedido genérico de testes ou mudança de UI não autorizam novos smokes.
Agentes não podem criar uma tarefa de smoke para autorizar o próprio trabalho.
Esta regra vale para todos os papéis, inclusive Manager, Developer, QA,
DevOps, Design, UX e documentadores. Tarefas automáticas de acompanhamento
não concedem essa autorização. Sem tarefa humana, não adicione nem amplie smokes.

Smokes existentes podem continuar sendo executados nos processos que já os
utilizam; esta decisão não manda removê-los. QA exige somente os testes
automatizados do escopo e não pede novos smokes para aprovar uma entrega.
Quando a própria tarefa humana for implementar smoke, QA verifica o código
automatizado, a descoberta pelo runner e o resultado solicitado nessa tarefa.
O catálogo em `quality/smoke-test-flows.md` aplica-se somente a esse escopo autorizado.

- Agents **não** inventam novos fluxos; só humanos autorizam mudanças no catálogo.
- Ao criar/alterar smoke, declarar o fluxo (`fluxo: <id>`). Sem coerência → usar `outros`.
- Prints por etapa e wiki são documentação do smoke autorizado, sem gate geral de QA.
- Ver a skill completa para o catálogo e regras de governança.

## Uso por papel

- `Developer` usa esta skill antes de encerrar a propria entrega
- `Quality Assurance` usa esta skill antes de aprovar ou devolver a entrega

## Sinais de aprovacao

Uma entrega so avanca quando:

- a base ficou modularizada
- os arquivos e componentes ficaram pequenos o suficiente
- os testes relevantes existem e passam, ou existe bloqueio externo documentado
- os testes automatizados permanecem versionados onde o runner os descobre
- a evidência dos testes cobre o comportamento que mudou

## Sinais de rejeicao

Devolva a entrega quando:

- faltar teste apropriado
- adicionar smoke sem tarefa específica criada por humano e escopo explícito
- teste automatizado ausente, não descoberto pelo runner ou não integrado na
  ref remota prevista
- houver componente ou arquivo grande demais sem quebra aceitavel
- a mudanca duplicar contrato que ja existe em shared/store/component
- a mudanca tornar o codigo mais centralizado, dificil de reaproveitar ou dificil de testar
