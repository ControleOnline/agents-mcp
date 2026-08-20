# ControleOnline GitHub Project MCP Agents

Este repositorio e a fonte oficial para automacoes, agents, runners, workflows e instrucoes operacionais do ecossistema ControleOnline.

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

- branch de trabalho: `task-{id_issue}` derivada de `master`
- `Developer` entrega em **`dev`** por **merge** da task branch (sem PR)
- `QA` e `Security` decidem por labels na task; evidencia em `dev`; nao abrem PR
- `DevOps` empacota **todas** as tasks com `agent:qa:accepted` + `agent:security:accepted` em um **RC semver**, coloca o pacote em **`staging`** (pai + submodulos), cria **task pai de deploy** com as demais como **subtasks**, move pai e filhas para **`In Review`**
- **um RC por vez**; freeze — nenhuma task nova entra no RC aberto; nao ha novo RC ate publicar o atual
- humano confere staging e move a task pai para **`Deploy`**
- `DevOps` mescla **`staging` → `master`** e move para **`Done`**

## Ownership operacional

Labels oficiais de review na task:

- `agent:qa:accepted`
- `agent:qa:rejected`
- `agent:security:accepted`
- `agent:security:rejected`

Regras obrigatorias:

- nenhuma task deve ser atribuida a pessoas, bots ou fallbacks tecnicos como mecanismo de captura de trabalho
- assignees do GitHub nao participam do roteamento operacional e devem ser removidos quando aparecerem em tasks da fila
- `Developer` seleciona trabalho apenas quando a issue ainda esta aberta, foi criada por membro da equipe e nao existe pendencia ativa de decisao por `QA` e `Security`
- `Developer` so trabalha na `task-{id_issue}` e entrega em **`dev`** por merge, sem abrir PR
- `Developer` nao mexe diretamente em `master`, `main`, `dev`, `staging`
- `Security` e `QA` registram apenas labels de aceite/recusa na task
- quando `Security` ou `QA` recusarem, comentam de forma objetiva para o `Developer`
- somente o `DevOps` monta RC em `staging`, cria a task pai de deploy e promove `staging` → `master` apos coluna `Deploy`
- agents nao fecham tasks por conta propria fora do rito de colunas do board; `closed` formal segue governanca humana quando aplicavel

## Fronteira do CTO

O CTO supervisiona o ecossistema e corrige diretamente o `agents-mcp` quando houver falha estrutural de instrucao, runner, workflow, ownership ou automacao.

O CTO nao deve substituir a execucao normal de `Developer`, `Security`, `Quality Assurance`, `DevOps` ou `Sysadmin` quando a trilha ja pertence claramente a um desses agents.

Quando `agent:qa:accepted` e `agent:security:accepted` coexistirem, a trilha de RC/`staging`/`master` pertence ao `DevOps`, conforme `agents/skills/shared/github/github-flow.md` e `agents/skills/shared/github/master-publication.md`.

## Fluxos operacionais paralelos

O Full Pipeline / Manager governa, na ordem:

1. Hotfix (já implementado → QA/Security/DevOps)
2. DevOps (Deploy / RC)
3. Documentação
4. Validadores (QA → Security)
5. **Developer** (captura + implementação + merge em `dev` + handoff)
6. Higiene residual + organização do board

O Manager, ao chegar em P5, executa (ou despacha) o papel de Developer conforme `agents/roles/developer/agent.md`.

SysAdmin continua em fluxo paralelo separado.

## Mode de Acao do Agent (Full Pipeline / Manager)

Quando a automação unificada (`Controle Online - Full Pipeline`) for executada, ela deve seguir **estritamente** a ordem de prioridade abaixo.  
O princípio é: **sempre atuar no que está mais avançado no pipeline do Manager**.

### Ordem de prioridade (uma ação por execução)

1. **Hotfix**
   - Qualquer issue com label `hotfix` (validar QA/Security, promover/deploy) tem prioridade absoluta
   - Implementação de hotfix (quando ainda não feita) é capturada pelo Developer em P5
   - Hotfix **pode entrar** em RC já freezeado; ainda assim **sempre** passa por **In Review** + ação humana em **Deploy** (nunca direto a master)
   - Ao criar task hotfix: **sempre** aplicar a label `hotfix`
   - Ver seção Hotfix em `agents/skills/shared/github/github-flow.md`
   - Merge sempre **somente** da `task-{id}` (nunca `dev` inteiro → `staging`)

2. **DevOps**
   - Publicar release aprovada na coluna Deploy (se existir)
   - Criar Release Candidate (se houver tasks com `agent:qa:accepted` + `agent:security:accepted` e não houver RC em andamento)
   - No RC: merge **somente** das `task-{id}` aprovadas em `staging` (nunca `dev` inteiro)

3. **Documentação** (Documentadores)
   - Technical Documenter
   - Tutorial Assistant

4. **Validadores**
   - QA
   - Security

5. **Developer**
   - Captura a próxima issue elegível, implementa em `task-{id}` a partir de `master`, merge em `dev`, handoff QA/Security
   - Fonte: `agents/roles/developer/agent.md`

6. **Higiene residual + board**
   - Somente quando P1–P5 estiverem vazias (ou P2 somente gate humano + P5 vazia/incapacidade documentada)

### Regras deste mode

- Execute **exatamente uma** ação por rodada.
- Pare na primeira prioridade que tiver trabalho pendente.
- Dentro da mesma prioridade funcional, selecione a task elegivel mais antiga por `createdAt` crescente; em empate, use o menor numero da issue.
- `updatedAt` serve apenas como evidencia de atividade e nunca reposiciona uma task na fila.
- SysAdmin **não** participa deste mode (deve continuar rodando em paralelo em automação separada).
- Sempre confirme o estado real no GitHub / Project #1 antes de agir.
- Siga integralmente as fontes canônicas de cada papel (`agents/roles/*/agent.md` e skills referenciadas).
