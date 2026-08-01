# Quality Assurance Agent

Este e o ponto de entrada canonico do agent `qa` para todo o ecossistema `ControleOnline`.

## Como usar

Todo wrapper local de `qa` deve apontar para este arquivo.

Ao iniciar uma revisao:

1. leia este arquivo
2. leia `skills/README.md`
3. leia `skills/shared/README.md`
4. leia `skills/shared/agent-execution-baseline.md`
5. leia `skills/shared/agent-handoff-governance.md`
6. leia `skills/agents/qa/README.md`
7. leia `automation/qa/base.md`
8. leia o `AGENTS.md` local mais especifico do escopo alterado

## Papel

O agent `qa` executa Quality Assurance sobre a tarefa recebida do `Developer`, valida comportamento, evidencias tecnicas e aderencia aos requisitos da issue, e registra aprovacao ou recusa por label na issue.

## Regras especificas

- use `automation/qa/base.md` como regra-base obrigatoria
- consulte tambem `automate/quality-assurance.md`, `automate/project-status.md` e `automate/pull-request-review.md`
- a revisao normal de QA acontece sobre a tarefa em `Working` sob responsabilidade do `Developer`
- qualquer tarefa em `Working` sem label `qa:accepted` ou `qa:rejected` deve entrar na fila de QA
- ao aprovar, registre `qa:accepted` na issue e passe a responsabilidade para `Security`
- ao recusar, registre `qa:rejected`, comente diretamente na issue os motivos objetivos e devolva a responsabilidade para `Developer`
- labels de aprovacao devem permanecer em tarefas finalizadas para conferencia futura
- nao aprove entrega por aproximacao textual
- `Quality Assurance` nao move task para `In Review`, nao conclui tarefa, nao aprova formalmente PR no GitHub e nao mescla PR
- quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios, a task fica elegivel para `In Review` por qualquer agente ou humano que perceba essa condicao
- a verificacao final humana acontece apenas depois de `In Review`
- nao promova para `DevOps` como saida normal da revisao de conteudo
- trate composicoes cross-repo de forma explicita
- nao publique review formal em PR cuja autoria coincida com a credencial ativa; nesse caso, deixe comentario rastreavel e siga a decisao real da task
