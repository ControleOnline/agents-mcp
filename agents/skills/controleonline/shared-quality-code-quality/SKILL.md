# Code Quality Skill

## Objetivo

Definir a barra comum de qualidade de codigo para `Developer` e `Quality Assurance` no ecossistema `ControleOnline`.

Esta skill e a fonte oficial para criterios compartilhados de:

- modularizacao
- tamanho de arquivos e componentes
- reuso de contratos e componentes
- cores exclusivamente via variaveis de tema
- termos de UI exclusivamente via traducao
- manutencao de mudancas pequenas e rastreaveis
- validacao de testes quando presentes na entrega

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
- **cores:** no delta de frontend, toda cor deve vir de variaveis de tema/CSS (`brandColors`, tokens do theme, `var(--*)` / palette). Hex, rgb, rgba e nomes de cor hardcoded no delta sao recusa
- **termos/textos de UI:** todo texto visivel ao usuario deve vir do mecanismo de traducao (`t` / `translate` / store de traducao). String literal de UI no delta e recusa; chaves cruas (`mk7`, ids tecnicos) nao podem aparecer como label final
- **testes automatizados nao sao obrigatorios** para aceite de QA. A ausencia de teste novo nao justifica `agent:qa:rejected`
- **quando a entrega inserir ou alterar testes automatizados**, esses testes devem passar na execucao local registrada; teste novo/alterado falhando ou sem evidencia de execucao justifica recusa
- lint do escopo deve estar coerente com o padrao do repositorio
- o resultado da validacao deve ser descrito com o escopo real do que foi coberto

## Teste automatizado versionado x artefato de execução

Quando houver teste na entrega, a entrega do teste e o **codigo automatizado versionado**, integrado na task e publicado no destino previsto (`dev` para Developer). Ela exige:

1. arquivo de teste executavel (por exemplo, PHPUnit, Jest, Node test ou Playwright);
2. comando ou runner que descubra o teste em auditorias futuras;
3. execucao registrada com o resultado real, ou bloqueio tecnico objetivo;
4. commit remoto da task e merge remoto no destino previsto.

PNG, screenshot, video, trace, `report.json`, manifesto ou indice gerado pelo
runner sao **artefatos de execucao**. Eles podem complementar uma auditoria
visual, mas nao sao a entrega do teste e nao devem ser tratados como gate
geral de aceite.

A falta de teste automatizado **nao** bloqueia QA. Somente testes presentes
(novos ou alterados) precisam passar.

## Uso por papel

- `Developer` usa esta skill antes de encerrar a propria entrega
- `Quality Assurance` usa esta skill antes de aprovar ou devolver a entrega

## Sinais de aprovacao

Uma entrega so avanca quando:

- a base ficou modularizada
- os arquivos e componentes ficaram pequenos o suficiente
- cores do delta usam apenas variaveis de tema
- termos de UI do delta passam pela traducao (sem string literal e sem chave crua como label)
- se houver testes novos/alterados, eles passam na execucao registrada
- a evidencia cobre o comportamento que mudou

## Sinais de rejeicao

Devolva a entrega quando:

- houver componente ou arquivo grande demais sem quebra aceitavel
- a mudanca duplicar contrato que ja existe em shared/store/component
- a mudanca tornar o codigo mais centralizado, dificil de reaproveitar ou dificil de testar
- cores hardcoded no delta de frontend
- texto de UI hardcoded ou chave tecnica crua exibida ao usuario
- testes novos/alterados na entrega falhando ou sem evidencia de execucao
