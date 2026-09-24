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

- `agents/skills/controleonline/README/SKILL.md`
- `agents/skills/controleonline/shared-README/SKILL.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- `agents/skills/controleonline/by-role-<agent>-README/SKILL.md`
- `agents/skills/controleonline/runners-README/SKILL.md`
- `agents/roles/*/agent.md`
- `workers/automation/`
- `workers/automate/`



## Configuracao do fork (obrigatoria)

Antes de qualquer acao operacional, leia **`config/ecosystem.config.json`**.

- Use os campos `value` e `runners.defaults` para resolver `<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>` e repositorios de produto.
- Tokens (`GITHUB_TOKEN`) nao ficam no arquivo; use secrets do ambiente.
- Modelo: `config/ecosystem.config.example.json` — detalhes em `config/README.md`.

## Paperclip Direct Execution

Todo agent do ecossistema **deve estender** `agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md`.

- Execução direta pelo Paperclip usando `agents/roles/*/agent.md`.
- Workflows, wrappers e assignees tecnicos nao sao canal operacional principal.

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

- comportamento compartilhado, politicas, guardrails e criterios comuns vivem em `agents/skills/controleonline/shared-*/SKILL.md`
- qualidade de codigo, modularizacao e limite de tamanho de componentes vivem em `agents/skills/controleonline/shared-quality-code-quality/SKILL.md`
- documentacao de cliente e wiki tecnica vivem em `agents/skills/controleonline/shared-documentation-documentation-governance/SKILL.md`
- seguranca editorial e sanitizacao de evidencias vivem em `agents/skills/controleonline/shared-security-security-guardrails/SKILL.md`
- fluxo de branches e entrega (GitHub Flow adaptado) vive em `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- papel, ownership, limites e handoff por agent vivem em `agents/skills/controleonline/by-role-<agent>-README/SKILL.md`
- mapas de runtime, workflows, entry points e scripts reais vivem em `agents/skills/controleonline/runners-README/SKILL.md`
- `agents/roles/*/agent.md` devem ficar enxutos e conter apenas ponto de entrada, papel, fronteiras e referencias obrigatorias
- a execução usa diretamente a fonte canônica e o contexto local mínimo

## Documentação (navegação humana)

| Categoria | Destino |
| --- | --- |
| Home deste repositório | este `AGENTS.md` + skills em `agents/skills/` |
| Qualidade | [code-quality.md](agents/skills/controleonline/shared-quality-code-quality/SKILL.md) |
| Governança documental | [documentation-governance.md](agents/skills/controleonline/shared-documentation-documentation-governance/SKILL.md) |

### Por categoria — qualidade

| Página | O que documenta |
| --- | --- |
| [code-quality.md](agents/skills/controleonline/shared-quality-code-quality/SKILL.md) | Limites de arquivo, testes automatizados e critérios de qualidade |

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

Fonte completa: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.
Para qualquer conflito ou divergência ampla, aplicar também
`agents/skills/controleonline/shared-github-conflict-resolution/SKILL.md`; a task permanece em
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
estiver em `Deploy`. Agents não movem tasks isoladas para `In Review`: essa
coluna só é usada quando o `DevOps` cria/congela uma RC e o `Manager` confirma
que a task esta no inventario.

- branch de trabalho: `task-{id_issue}` derivada de `master`
- `Developer` entrega em **`dev`** por **merge** da task branch (sem PR)
- `Design`, `UX` e `QA` estao temporariamente suspensos: nao criam subtasks, nao
  aplicam labels e nao bloqueiam staging/RC
- `Security` e o unico validador ativo antes da revalidacao do `Manager`
- `DevOps` reúne tecnicamente de 1 a 5 tasks com `agent:security:accepted` em uma RC congelada `rc/X.Y.Z-rc.N`, sem criar task pai
- a RC nasce do `master`, possui manifesto imutável de SHAs e é homologada como composição em `staging`
- humano confere staging e move as tasks homologadas para **`Deploy`**
- `DevOps` promove **a mesma RC congelada** diretamente para `master`; `staging` nunca é origem de master
- qualquer mudança depois do freeze gera `rc.N+1` e nova homologação

Alinhamento obrigatório dos submódulos: em `master`, cada gitlink aponta para
a ponta de `master` do submódulo; em `dev`, para a ponta de `dev`; em
`staging`, para a ponta de `staging`. `.gitmodules` declara a mesma branch.
Refs `dev`/`staging` ausentes são criadas a partir de `master`; em seguida,
atualiza-se o gitlink do pai por PR protegido. O deploy não está alinhado
enquanto qualquer nível recursivo apontar para SHA diferente da ponta de sua
branch correspondente.

O ruleset de cada repositório deve proteger `master`, `dev` e `staging`, exigir
Pull Request e tornar obrigatório o check `Submodule branch alignment` do
workflow `Integration source gate`. A configuração nativa do GitHub protege o
branch e exige o check; o workflow faz a comparação recursiva dos gitlinks.

## Ownership operacional

Labels oficiais de review na task:

- `agent:security:accepted` / `agent:security:rejected`

Labels de `QA`, `Design` e `UX` existem apenas como historico/instrucoes
documentadas; enquanto a suspensao estiver ativa, nao entram na fila, nao
geram subtasks e nao sao gate de `staging`, `In Review`, `Deploy` ou `Done`.

Regras obrigatorias:

- nenhuma task deve ser atribuida a pessoas, bots ou fallbacks tecnicos como mecanismo de captura de trabalho
- assignees do GitHub nao participam do roteamento operacional e devem ser removidos quando aparecerem em tasks da fila
- `Developer` seleciona trabalho apenas quando a issue ainda esta aberta, foi criada por membro da equipe e nao existe pendencia ativa de decisao por `Security`
- `Developer` so trabalha na `task-{id_issue}` e entrega em **`dev`** por merge, sem abrir PR
- `Developer` nao mexe diretamente em `master`, `main`, `dev`, `staging`
- `Security` registra apenas labels de aceite/recusa na task
- quando `Security` recusar, comenta de forma objetiva para o `Developer`
- se um merge ou rebase se tornar confuso, não force a resolução: descarte e
  recrie a branch da task desde `master`, refaça a implementação e retroceda a
  task no Notion aos passos iniciais para uma nova rodada de evidências
- somente o `DevOps` publica `Deploy` → `master` e promove RC congelada → `staging` / `In Review`; para o DevOps, `Deploy` vem antes de `Working`
- agents nao fecham tasks por conta propria fora do rito de colunas do board; `closed` formal segue governanca humana quando aplicavel

### QA suspenso; GitHub Actions nao decide QA

- Enquanto suspenso, `Quality Assurance` nao captura tasks, nao cria subtasks e
  nao aplica `agent:qa:*`.
- GitHub Actions, checks de PR e workflows não aprovam, reprovam, bloqueiam nem
  substituem decisao de QA.
- Quando QA for reativado por decisao humana, a decisao volta a ser local no
  workspace Paperclip, com testes adequados ao escopo e evidencia registrada.

## Fronteira do CTO

O CTO supervisiona o ecossistema e corrige diretamente o `agents-mcp` quando houver falha estrutural de instrucao, runner, workflow, ownership ou automacao.

O CTO nao deve substituir a execucao normal de `Developer`, `Security`, `DevOps`
ou `Sysadmin` quando a trilha ja pertence claramente a um desses agents.

Quando `Security` aceitar e o Manager revalidar a entrega com testes locais,
a trilha de `staging`/`master` pertence ao `DevOps`, conforme
`agents/skills/controleonline/shared-github-github-flow/SKILL.md` e
`agents/skills/controleonline/shared-github-master-publication/SKILL.md`.

## Full Pipeline / Manager

Existe **um** Full Pipeline. SysAdmin permanece fora deste mode (automacao separada).

Ordem:

1. P1 DevOps
2. P2 Hotfix
3. P3 Documentacao
4. P4 Developer — rejeicoes de QA/Security
5. P5 Security
6. P6 Developer — novas tarefas
7. P7 Higiene residual + board

O Manager, ao chegar em P4 ou P6 com trabalho elegivel, **le e executa** `agents/roles/developer/agent.md` sobre exatamente uma issue elegivel. Em P4, somente corrige rejeicoes de QA/Security; em P6, captura novos desenvolvimentos. Nao inventa rito proprio de codigo.

Developer executado de forma standalone (prompt direto no papel) continua podendo capturar a propria fila; isso nao cria um segundo pipeline nem autoriza higiene a rodar na frente da implementacao.

## Mode de Acao do Agent (Full Pipeline / Manager)

Quando a automacao unificada (`Controle Online - Full Pipeline`) for executada, ela deve seguir **estritamente** a ordem de prioridade abaixo.
O principio e: **sempre atuar no que esta mais avancado no pipeline do Manager**.

### Ordem de prioridade

1. **P1 DevOps**
   - Se existir RC homologada cujas tasks estejam em `Deploy`, promover exatamente essa RC congelada para `master`
   - Senao, montar RC técnica de 1 a 5 tasks com `agent:security:accepted`, congelar manifesto e promover o snapshot para `staging` + `In Review`
   - `Deploy` autoriza a publicação da composição já homologada; não autoriza recompor SHAs
   - RC é artefato técnico, nunca task/issue agregadora
2. **P2 Hotfix**
   - Validar ou promover task `hotfix` ja implementada (Security / DevOps → staging)
   - Implementacao de hotfix e P6 Developer, nao P2
3. **P3 Documentacao**
   - Technical Documenter
   - Tutorial Assistant
4. **P4 Developer — rejeicoes**
   - Corrigir issues com `agent:qa:rejected` ou `agent:security:rejected`
   - A correcao vai ate a entrega publicavel: o Developer deve resolver falhas de workflow, Actions, build, branch, merge ou evidencia que impeçam a entrega
   - Se o workflow/build estiver falhando, deve investigar, corrigir, repetir a execucao, rerotear ou reconstruir a etapa; se o problema for a publicacao/deploy, deve encaminhar ao DevOps com evidencia objetiva
   - Uma correcao por rodada, antes de qualquer nova validacao
5. **P5 Security**
   - Security valida a entrega ativa; QA, Design e UX permanecem suspensos
6. **P6 Developer — novos desenvolvimentos**
   - Exatamente uma issue elegivel
   - Branch `task-{id}` a partir de `master`, merge em `dev`, handoff para Security
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
