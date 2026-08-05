# Security Review Automation

## Objetivo

Centralizar a lógica operacional do analista de segurança para que agents, automações e workflows do GitHub apliquem a mesma decisão ao revisar tasks da fase compartilhada associadas aos agents `QA` e `Security` do ecossistema `ControleOnline`, sempre por labels e comentário na issue.

Fonte de branches/entrega: `agents/skills/shared/github/github-flow.md`.

## Resultado final obrigatório

Toda revisão de segurança deve terminar em exatamente um destes resultados:

- registrar `security:accepted` quando a task estiver aprovada
- registrar `security:rejected` quando a task estiver reprovada

Não encerrar a análise de outra forma. Só deixe de mover quando houver bloqueio real de ferramenta, acesso ou indisponibilidade operacional do GitHub. Mesmo nesse caso, a decisão final pretendida deve ficar explícita.

Exceção operacional desta base automatizada:

- quando `SECURITY_USE_COPILOT=true` e a rodada ainda não tiver decisão estruturada suficiente, o item pode continuar temporariamente na fase compartilhada depois de acionar o Copilot cloud agent para aprofundar a investigação

## Escopo mínimo da análise

Toda revisão da fase compartilhada deve cobrir, no mínimo:

- autorização e controle de acesso
- exposição indevida de dados
- leitura, escrita, alteração ou exclusão indevida
- validação de regras de negócio sensíveis
- ataques previsíveis no contexto da mudança
- aderência ao padrão de segurança da empresa

## Riscos que exigem atenção explícita

- bypass de autorização
- privilege escalation
- IDOR
- mass assignment
- injeções
- falhas de validação de entrada
- exposição de dados sensíveis
- alteração indevida de status ou fluxo
- inconsistência entre regra de negócio e regra técnica
- ausência de trilha clara de validação em services, controllers, handlers, resolvers ou camadas equivalentes

## Fontes de verdade

Use sempre, nesta ordem:

1. associação real do agent responsável da task por GraphQL, quando disponível
2. issue principal ligada à entrega
3. branch `task-{id}`, commits e merge em `staging`
4. checks, arquivos alterados e diff
5. `AGENTS.md` mais específico do escopo alterado
6. `agents.md` do módulo quando houver regra de negócio ou autorização registrada

Não use comentários soltos, título, busca textual ou heurística sobre cards como substituto da associação real do agent responsável.

Não existe PR do Developer no fluxo normal. A única PR formal é a de promoção `staging` -> `master` do `DevOps`.

## Regra de entrada

Uma revisão de segurança só pode começar quando:

- a issue estiver vinculada ao fluxo operacional
- a issue estiver na fase compartilhada com `agent:qa` e `agent:security`

Se GraphQL estiver indisponível por limitação de infraestrutura, continue a coleta com as ações suportadas do GitHub e registre a limitação no comentário final.

## Regra obrigatória de `securityFilter`

Esta regra é mandatória:

- toda entidade deve ter um `securityFilter` no service equivalente
- o `securityFilter` deve definir com clareza quem pode ver e quem pode gravar a entidade
- a ausência de `securityFilter`, um filtro incompleto ou um filtro incapaz de proteger leitura e escrita é falha relevante de segurança

Não basta verificar a existência nominal do método. A validação precisa considerar o comportamento efetivo.

## Regras de negócio

Ao revisar uma entidade ou fluxo, deixar explícito:

- quem pode ver
- quem pode criar
- quem pode editar
- quem pode alterar status
- quais restrições dependem de role, ownership, tipo, status ou contexto

Quando a regra não existir, estiver ambígua ou incompleta:

- explicitar a lacuna
- propor a regra mais segura e coerente com o negócio
- adotar o menor privilégio necessário
- registrar a decisão no `agents.md` do módulo correspondente

## Registro obrigatório em `agents.md`

Sempre que a análise exigir definição, refinamento, correção ou explicitação de regra de negócio ou autorização, registrar no `agents.md` do módulo:

- entidade analisada
- service correspondente
- regras de visualização
- regras de gravação
- restrições por role
- restrições por status, tipo, ownership ou contexto
- exceções administrativas
- decisão adotada quando a regra original não existia ou era ambígua

## Checklist obrigatório

Antes da decisão final, validar:

- a issue e a branch `task-{id}` corretas foram analisadas
- o merge em `staging` foi confirmado ou o bloqueio ficou explícito
- o `AGENTS.md` aplicável foi consultado
- o código alterado e o código relacionado foram lidos
- não existe brecha material de autorização
- o `securityFilter` existe onde deveria existir e protege os cenários relevantes
- as regras de negócio sensíveis foram confirmadas ou definidas
- o `agents.md` do módulo foi atualizado quando necessário
- a evidência disponível sustenta revisão humana posterior sem esconder risco relevante
- o checklist canonico de Security em `workers/automate/review-checklists.md` foi copiado para a task

## Regras de decisão

### Devolver para `Developer`

Reprovar quando houver qualquer situação de gravidade equivalente a:

- ausência de `securityFilter` obrigatório
- `securityFilter` incompleto, superficial ou inconsistente
- regra de visualização ou gravação sem definição confiável
- brecha de autorização relevante
- risco material de alteração indevida por role incorreto
- fluxo sensível dependente de suposição não comprovada
- regra crítica ausente, ambígua ou implementada de forma incorreta
- evidência insuficiente para sustentar aprovação
- documentação obrigatória em `agents.md` não realizada quando necessária

Ao reprovar:

- deixar comentário final objetivo na issue com escopo, evidências, checklist e motivo
- remover `agent:security` da task
- repassar a task para `agent:developer`
- **não** publicar review formal de PR de produto

### Aprovar na task

Aprovar apenas quando houver evidência suficiente de que:

- os riscos relevantes foram analisados
- a proteção da entidade ou fluxo é coerente
- o `securityFilter` cumpre seu papel
- as regras de negócio sensíveis foram validadas ou definidas com clareza
- não restam lacunas materiais de autorização
- o registro em `agents.md` foi feito quando aplicável

Ao aprovar:

- comentar na issue com rastreabilidade do escopo revisado
- registrar `security:accepted`
- remover `agent:security` da task
- copiar o checklist de Security para a task
- **não** publicar review formal de PR de produto

## Regra de comentário final

O comentário final da revisão deve informar:

- escopo analisado
- entidades, services, regras ou fluxos revisados
- principais riscos encontrados ou validados
- situação do `securityFilter`
- regras de negócio confirmadas ou definidas
- checklist aplicado na decisao
- se houve atualização em `agents.md`
- próximo agent responsável e o motivo

## Regras de automação

Uma automação que implemente este fluxo deve:

- preferir GraphQL para ler e atualizar a associação oficial do agent responsável
- usar REST ou app equivalente apenas como fallback operacional
- poder acionar o Copilot cloud agent como apoio investigativo quando a rodada exigir contexto adicional
- falhar de forma conservadora quando não houver evidência suficiente
- nunca aprovar por aproximação textual
- nunca encerrar a rodada mantendo a task sem decisão de roteamento, exceto na etapa transitória de apoio do Copilot cloud agent explicitamente configurada

## Apoio com Copilot cloud agent

Quando configurado, o workflow pode acionar o Copilot cloud agent para apoiar a revisão.

Essa delegação serve para:

- explorar o código relacionado com mais profundidade
- sugerir trilhas de validação
- levantar pontos de atenção no diff

Essa delegação não substitui a decisão final do analista de segurança. A aprovação ou reprovação continua dependendo de evidência verificável e de decisão operacional explícita.

## Estrutura sugerida

- `workers/automate/security-review.md`: política e regras
- `workers/automate/security-project-status.md`: roteamento de agents e transições
- `workers/automate/security-pull-request-review.md`: critérios de review da entrega (sem PR de produto)
- `workers/automate/scripts/security-project-review.mjs`: coleta de evidência e execução do fluxo
- `workers/automate/workflows/security-project-review.yml`: workflow base no GitHub Actions
