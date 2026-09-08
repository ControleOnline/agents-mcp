# ControleOnline GitHub Project MCP Agents

Este repositorio e a fonte oficial para automacoes, agents, runners, workflows e instrucoes operacionais do ecossistema ControleOnline.

## Escopo operacional permitido (obrigatório — todos os agents)

**Único escopo permitido:** organização GitHub [`ControleOnline`](https://github.com/ControleOnline/).

- É **proibido** comentar, alterar labels/status, abrir/editar issues ou PRs, fazer requests, handoffs ou qualquer mutação em repositórios **fora** de `github.com/ControleOnline/*`.
- É **proibido** tratar qualquer outra organização/usuário como escopo de produto, board, fila ou validação, salvo a exceção abaixo.
- Consultas de leitura em outros escopos só são aceitáveis quando estritamente necessárias para resolver referência histórica; **nunca** gerar comentário, label ou solicitação fora de ControleOnline.

**Exceção estrutural única:** edição de governança, runners, workflows e documentação **deste** repositório canônico de agents quando a falha for estrutural (`agents-mcp`). Mutações de produto continuam restritas a `ControleOnline/*`.

Qualquer agent (Manager, Developer, QA, Security, DevOps, Sysadmin, Documentadores, CTO) que detectar trabalho elegível fora de ControleOnline deve **ignorar** e registrar no contrato de conclusão: `OUT_OF_SCOPE` (org/repo).

## Fonte canonica

Tudo o que nao for memoria persistente deve estar disponivel aqui.

Entradas principais:

- `agents/skills/README.md`
- `agents/skills/shared/README.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/by-role/*/README.md`
- `agents/skills/runners/README.md`
- `agents/roles/*/agent.md`
- `.github/agents/*.agent.md`
- `workers/automation/`
- `workers/automate/`



## Configuracao do fork (obrigatoria)

Antes de qualquer acao operacional, leia **`config/ecosystem.config.json`**.

- Use os campos `value` e `runners.defaults` para resolver `<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>` e repositorios de produto.
- Tokens (`GITHUB_TOKEN`) nao ficam no arquivo; use secrets do ambiente.
- Modelo: `config/ecosystem.config.example.json` — detalhes em `config/README.md`.

## Copilot Cooperation

Todo agent do ecossistema **deve estender** `agents/skills/shared/operations/copilot-cooperation.md`.

- GitHub Copilot Coding Agent, workers, runners e Actions sao parceiros de execucao
- Wrappers em `.github/agents/*.agent.md` (`target: github-copilot`)
- Regenerar wrappers: `node workers/scripts/sync-copilot-agents.mjs`

## Estrutura do repositorio

```
agents/
├── roles/          # definição canônica de cada papel
└── skills/         # biblioteca de skills
    ├── shared/     # regras transversais (por categoria)
    ├── by-role/    # skills por papel
    └── runners/    # mapas de runtime

workers/            # tudo que executa
├── automate/
├── automation/
├── src/
└── scripts/
```

## Regra central de skills

Toda regra nova deve entrar primeiro na camada certa, em vez de ser repetida entre agents, wrappers e instrucoes locais.

Distribuicao obrigatoria:

- comportamento compartilhado, politicas, guardrails e criterios comuns vivem em `agents/skills/shared/`
- qualidade de codigo, modularizacao, smoke tests e limite de tamanho de componentes vivem em `agents/skills/shared/quality/code-quality.md`
- documentacao de cliente e wiki tecnica vivem em `agents/skills/shared/documentation/documentation-governance.md`
- seguranca editorial e sanitizacao de evidencias vivem em `agents/skills/shared/security/security-guardrails.md`
- fluxo de branches e entrega (GitHub Flow adaptado) vive em `agents/skills/shared/github/github-flow.md`
- papel, ownership, limites e handoff por agent vivem em `agents/skills/by-role/<agent>/README.md`
- mapas de runtime, workflows, entry points e scripts reais vivem em `agents/skills/runners/README.md`
- `agents/roles/*/agent.md` devem ficar enxutos e conter apenas ponto de entrada, papel, fronteiras e referencias obrigatorias
- wrappers locais em `.github/agents/*.agent.md` devem ser finos e apontar para a fonte canonica e para o contexto local minimo

## Documentação (navegação humana)

| Categoria | Destino |
| --- | --- |
| Home deste repositório | este `AGENTS.md` + skills em `agents/skills/` |
| Qualidade / smoke | [code-quality.md](agents/skills/shared/quality/code-quality.md) · [smoke-test-flows.md](agents/skills/shared/quality/smoke-test-flows.md) |
| Espelho app (wiki) | https://github.com/ControleOnline/app-community/wiki/Smoke-Test-Flows |
| Espelho API (wiki) | https://github.com/ControleOnline/api-community/wiki/Fluxos-de-Smoke |
| Governança documental | [documentation-governance.md](agents/skills/shared/documentation/documentation-governance.md) |

### Por categoria — qualidade e smoke

| Página | O que documenta |
| --- | --- |
| [smoke-test-flows.md](agents/skills/shared/quality/smoke-test-flows.md) | Catálogo canônico `fluxo: <id>`, gate de evidência visual completa (prints por etapa), regras de uso |
| [code-quality.md](agents/skills/shared/quality/code-quality.md) | Limites de arquivo, testes, smoke obrigatório, evidência parcial bloqueia QA |
| Teste de governança | `tests/qa-smoke-flow-evidence.test.mjs` |

### Módulos relacionados

| Módulo | Entrada |
| --- | --- |
| app-community | https://github.com/ControleOnline/app-community/wiki/Smoke-Test-Flows |
| api-community | https://github.com/ControleOnline/api-community/wiki/Fluxos-de-Smoke |

## Canal de execucao

Os runners do GitHub deste repositorio estao desativados como canal operacional principal.

A execucao por papel deve acontecer pelos agentes pares no ChatGPT.

Com isso:

- workflows em `.github/workflows/` ficam apenas como trilha desativada e referencia tecnica
- nenhuma rotina por `push` ou `schedule` deve ser reativada sem decisao estrutural explicita
- ownership, handoff e criterios de execucao continuam definidos pelas skills centrais e pelos agents canonicos

## GitHub

Ao consultar ou operar no GitHub, os agents podem usar qualquer busca, API, listagem, ferramenta, mutacao ou superficie que estiver disponivel na sessao. Nao existe restricao artificial de consulta no GitHub dentro do `agents-mcp`; a escolha do caminho deve seguir apenas o que melhor produz a evidencia correta para a tarefa atual.

## GitHub Flow (resumo)

Fonte completa: `agents/skills/shared/github/github-flow.md`.
Para qualquer conflito ou divergência ampla, aplicar também
`agents/skills/shared/github/conflict-resolution.md`; a task permanece em
`Working` para ser refeita e nunca é mesclada diretamente em `master`. Se a
resolução semântica ficar confusa em qualquer etapa, é preferível descartar a
branch `task-{id_issue}`, recriá-la a partir do `master` remoto atualizado e
reexecutar a task desde o início. Nessa recuperação, é permitido ao agent
retroceder a task no Notion/Project #1 para os passos iniciais, limpar labels,
aceites e evidências da entrega descartada e reativar os handoffs aplicáveis;
isso é uma exceção explícita às regras usuais de não movimentação de coluna.
Agents nunca mesclam diretamente em `master`. Todos
os agents devem ler no Project #1 o limite da coluna `Working` antes de
capturar uma nova task. Neste ecossistema, o limite canônico é **5 tasks**:
quando cinco tasks estiverem em `Working`, nenhuma outra entra até uma delas
sair da coluna. A única exceção é o P1 `DevOps`, que continua publicando o que
estiver em `Deploy`. Agents não movem
tasks para `In Review`: essa coluna só é usada após os quatro accepts.

- branch de trabalho: `task-{id_issue}` derivada de `master`
- `Developer` entrega em **`dev`** por **merge** da task branch (sem PR)
- `QA`, `Security`, `Design` e `UX` decidem por labels na task; evidencia em `dev`; nao abrem PR
- `DevOps` publica tasks na coluna **`Deploy`** → `master` (deltas individuais) e, se nao houver Deploy, promove tasks com as **quatro** `:accepted` para `staging` + `In Review`
- **Proibido montar RC** e criar task pai de RC
- humano confere staging e move a task para **`Deploy`**
- `DevOps` promove o delta individual `staging` → `master`; com o quarteto move para **`Done`**, sem o quarteto move para **`Working`** para segunda rodada de validacao

## Ownership operacional

Labels oficiais de review na task:

- `agent:qa:accepted` / `agent:qa:rejected`
- `agent:security:accepted` / `agent:security:rejected`
- `agent:design:accepted` / `agent:design:rejected`
- `agent:ux:accepted` / `agent:ux:rejected`

Regras obrigatorias:

- nenhuma task deve ser atribuida a pessoas, bots ou fallbacks tecnicos como mecanismo de captura de trabalho
- assignees do GitHub nao participam do roteamento operacional e devem ser removidos quando aparecerem em tasks da fila
- `Developer` seleciona trabalho apenas quando a issue ainda esta aberta, foi criada por membro da equipe e nao existe pendencia ativa de decisao por `QA`, `Security`, `Design` ou `UX`
- `Developer` so trabalha na `task-{id_issue}` e entrega em **`dev`** por merge, sem abrir PR
- `Developer` nao mexe diretamente em `master`, `main`, `dev`, `staging`
- validadores registram apenas labels de aceite/recusa na task
- quando um validador recusar, comenta de forma objetiva para o `Developer`
- se um merge ou rebase se tornar confuso, não force a resolução: descarte e
  recrie a branch da task desde `master`, refaça a implementação e retroceda a
  task no Notion aos passos iniciais para uma nova rodada de evidências
- somente o `DevOps` publica `Deploy` → `master` e promove quadruplo-accepted → `staging` / `In Review`; para o DevOps, `Deploy` vem antes de `Working`
- agents nao fecham tasks por conta propria fora do rito de colunas do board; `closed` formal segue governanca humana quando aplicavel

## Fronteira do CTO

O CTO supervisiona o ecossistema e corrige diretamente o `agents-mcp` quando houver falha estrutural de instrucao, runner, workflow, ownership ou automacao.

O CTO nao deve substituir a execucao normal de `Developer`, `Security`, `Quality Assurance`, `DevOps` ou `Sysadmin` quando a trilha ja pertence claramente a um desses agents.

Quando as quatro `:accepted` coexistirem, a trilha de `staging`/`master` pertence ao `DevOps`, conforme `agents/skills/shared/github/github-flow.md` e `agents/skills/shared/github/master-publication.md`.

## Full Pipeline / Manager

Existe **um** Full Pipeline. SysAdmin permanece fora deste mode (automacao separada).

Ordem:

1. P1 DevOps
2. P2 Hotfix
3. P3 Documentacao
4. P4 Developer — rejeicoes de QA/Security
5. P5 Validadores (QA → Security → Design → UX)
6. P6 Developer — novas tarefas
7. P7 Higiene residual + board

O Manager, ao chegar em P4 ou P6 com trabalho elegivel, **le e executa** `agents/roles/developer/agent.md` sobre exatamente uma issue elegivel. Em P4, somente corrige rejeicoes de QA/Security; em P6, captura novos desenvolvimentos. Nao inventa rito proprio de codigo.

Developer executado de forma standalone (prompt direto no papel) continua podendo capturar a propria fila; isso nao cria um segundo pipeline nem autoriza higiene a rodar na frente da implementacao.

## Mode de Acao do Agent (Full Pipeline / Manager)

Quando a automacao unificada (`Controle Online - Full Pipeline`) for executada, ela deve seguir **estritamente** a ordem de prioridade abaixo.
O principio e: **sempre atuar no que esta mais avancado no pipeline do Manager**.

### Ordem de prioridade

1. **P1 DevOps**
   - Publicar todas as tasks em `Deploy` → `master` (deltas individuais, sem RC); com quarteto mover para `Done`, sem quarteto voltar para `Working` para segunda validacao
   - Senao, promover todas as tasks quadruplo-accepted → `staging` + `In Review`
   - A coluna `Deploy` e autorizacao humana explicita de publicacao em `master`; o Manager/DevOps executa o delta sem aguardar aprovacao adicional
   - **Proibido montar RC**
2. **P2 Hotfix**
   - Validar ou promover task `hotfix` ja implementada (QA / Security / Design / UX / DevOps → staging)
   - Implementacao de hotfix e P6 Developer, nao P2
3. **P3 Documentacao**
   - Technical Documenter
   - Tutorial Assistant
4. **P4 Developer — rejeicoes**
   - Corrigir issues com `agent:qa:rejected` ou `agent:security:rejected`
   - A correcao vai ate a entrega publicavel: o Developer deve resolver falhas de workflow, Actions, build, branch, merge ou evidencia que impeçam a entrega
   - Se o workflow/build estiver falhando, deve investigar, corrigir, repetir a execucao, rerotear ou reconstruir a etapa; se o problema for a publicacao/deploy, deve encaminhar ao DevOps com evidencia objetiva
   - Uma correcao por rodada, antes de qualquer nova validacao
5. **P5 Validadores**
   - QA → Security → Design → UX
6. **P6 Developer — novos desenvolvimentos**
   - Exatamente uma issue elegivel
   - Branch `task-{id}` a partir de `master`, merge em `dev`, handoff dos quatro validadores
7. **P7 Higiene residual + board**
   - Somente com P1–P6 sem acao executavel

### Regras deste mode

- Tente a prioridade mais alta com trabalho elegivel e executavel.
- Se `Working` já tiver 5 tasks, não capture outra task para P5 ou P6; continue
  resolvendo as tasks ativas. P1 `DevOps` permanece executável para `Deploy`.
- Dentro da mesma prioridade funcional, selecione a task elegivel mais antiga por `createdAt` crescente; em empate, use o menor numero da issue.
- `updatedAt` serve apenas como evidencia de atividade e nunca reposiciona uma task na fila.
- SysAdmin **nao** participa deste mode (deve continuar rodando em paralelo em automacao separada).
- **Developer participa deste mode como P4 para rejeicoes e P6 para novos desenvolvimentos.** Nao avance para P5 enquanto existir rejeicao elegivel; nao avance para P7 enquanto existir trabalho elegivel em P1–P6.
- Falha operacional em P4 ou P6 nao autoriza fallback para higiene.
- Sempre confirme o estado real no GitHub / Project #1 antes de agir.
- Siga integralmente as fontes canonicas de cada papel (`agents/roles/*/agent.md` e skills referenciadas).
- Colunas `Blocked` e `Backlog` sao exclusivamente humanas.
