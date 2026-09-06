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
- em smoke test de UI/browser, as capturas, prints, screenshots ou artefatos devem cobrir **todo o fluxo** por etapa; evidencia parcial bloqueia QA
- o manifesto ou comentario do smoke deve permitir reconstruir a jornada sem interpretacao verbal: página no índice central da wiki, `fluxo: <id>`, etapa no comentário de topo, passos executados, prints por passo e resultado final
- o `Documentor` deve conseguir reutilizar o material gerado pelo smoke sem depender de interpretacao verbal da entrega


## Fluxos de negócio (smoke)

Smokes devem ser associados a um fluxo do catálogo canônico em `quality/smoke-test-flows.md`.

- Agents **não** inventam novos fluxos; só humanos autorizam mudanças no catálogo.
- Ao criar/alterar smoke, declarar o fluxo (`fluxo: <id>`). Sem coerência → usar `outros`.
- QA deve recusar smoke de UI/browser que não tenha prints/screenshot cobrindo todas as etapas relevantes do fluxo.
- QA deve recusar qualquer smoke de UI/API sem entrada no índice central da wiki, comentário de topo `fluxo: <id> | etapa: <id>` ou sem prints por etapa.
- Ver a skill completa para o catálogo e regras de governança.

## Falhas de smoke encontradas fora da entrega atual

Quando um agent encontrar smoke de browser/UI com problema durante auditoria de CI, publicacao, higiene ou validacao indireta, e a correcao nao pertencer claramente ao delta imediato em revisao, a falha deve virar issue tecnica de follow-up para o `Developer`.

Regras obrigatorias:

- abrir ou atualizar issue separada no repositorio afetado
- colocar em `Ready`
- aplicar labels `hotfix`, `bug` e `agent:developer`
- declarar o smoke/fluxo afetado (`fluxo: <id>` ou `outros`)
- referenciar run/job/workflow e branch/SHA com resumo sanitizado da falha
- nao expor credenciais, headers sensiveis, dados reais ou logs brutos

Esse follow-up nao substitui a recusa de QA quando a falha pertence ao delta em revisao; nesse caso, o QA continua devolvendo a task original ao `Developer`.

## Uso por papel

- `Developer` usa esta skill antes de encerrar a propria entrega
- `Quality Assurance` usa esta skill antes de aprovar ou devolver a entrega

## Sinais de aprovacao

Uma entrega so avanca quando:

- a base ficou modularizada
- os arquivos e componentes ficaram pequenos o suficiente
- os testes relevantes existem e passam, ou existe bloqueio externo documentado
- os smoke tests existem para fluxos visiveis no browser
- a evidência cobre o comportamento que mudou e, quando houver UI/browser, contém prints por etapa do fluxo inteiro

## Sinais de rejeicao

Devolva a entrega quando:

- faltar teste apropriado
- faltar smoke test em mudanca de UI
- smoke de UI/browser/API sem página no índice central, comentário de topo com fluxo/etapa, prints por etapa ou sem `fluxo: <id>`
- houver componente ou arquivo grande demais sem quebra aceitavel
- a mudanca duplicar contrato que ja existe em shared/store/component
- a mudanca tornar o codigo mais centralizado, dificil de reaproveitar ou dificil de testar
