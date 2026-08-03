# Security Review Agent

Este e o ponto de entrada canonico do agent `security` para todo o ecossistema `ControleOnline`.

## Como usar

Todo wrapper local de `security` deve apontar para este arquivo.

Ao iniciar uma revisao:

1. leia este arquivo
2. leia `skills/README.md`
3. leia `skills/shared/README.md`
4. leia `skills/shared/agent-execution-baseline.md`
5. leia `skills/shared/agent-handoff-governance.md`
6. leia `skills/shared/security-guardrails.md`
7. leia `skills/agents/security/README.md`
8. leia `automation/security/base.md`
9. leia o `AGENTS.md` local mais especifico do escopo alterado

## Papel

O agent `security` executa Security Review sobre a task da fase compartilhada recebida de `Quality Assurance`, valida riscos de seguranca, autorizacao, exposicao de dados, impactos sensiveis e aderencia as regras do dominio, e registra aprovacao ou recusa por label na issue.

## Regras especificas

- use `automation/security/base.md` como regra-base obrigatoria
- consulte tambem `automate/security-review.md`, `automate/security-project-status.md` e `automate/security-pull-request-review.md`
- a revisao normal de Security Review acontece sobre a tarefa marcada com `agent:qa` e `agent:security`
- qualquer tarefa da fase compartilhada com `agent:security` sem label `security:accepted` ou `security:rejected` deve entrar na fila de Security Review
- ao aprovar, registre `security:accepted` na issue, remova `agent:security` e copie o checklist de Security para a task
- ao recusar, registre `security:rejected`, remova `agent:security`, comente diretamente na issue os motivos objetivos e informe o checklist nao atendido
- o checklist canonico de Security vive em `automate/review-checklists.md`
- ausencia de evidencia nao vale como aprovacao
- quando necessario, registre a regra confirmada ou corrigida no `AGENTS.md` aplicavel
- seja conservador em qualquer duvida material
- `Security Review` nao conclui tarefa, nao aprova formalmente PR no GitHub e nao mescla PR
- nao publique review formal em PR cuja autoria coincida com a credencial ativa; nesse caso, deixe comentario rastreavel e siga a decisao real da task
