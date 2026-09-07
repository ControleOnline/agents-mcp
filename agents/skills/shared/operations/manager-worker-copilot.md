# Manager Worker + Copilot Workers (fonte canonica)

Este documento define somente o canal **push -> Manager Worker -> Copilot**.

## Escopo invariavel

O workflow `.github/workflows/manager-worker.yml` e os composites `.github/actions/workers/*` sao **estritamente reativos a push** em `master`, `dev` ou `staging`.

- atuam somente sobre a issue resolvida/criada para o push atual;
- nao consultam a fila global para escolher outra issue;
- nao recuperam backlog historico;
- nao devem receber `schedule` para assumir responsabilidade de backlog.
- se a issue resolvida ja estiver no Project #1 com Status `Blocked` ou `Backlog`, nao despachar agent, nao comentar, nao validar, nao documentar e nao mover; essas colunas sao exclusivamente humanas.

A recuperacao global de backlog pertence aos agendamentos que executam `agents/roles/manager/agent.md` (Codex, Grok ou equivalente).

## Fluxo

1. Push em `master`, `dev` ou `staging` executa o Manager Subworker.
2. O Manager resolve a issue do commit ou cria a issue automatica correspondente ao push.
3. Define `run_qa`, `run_security`, `run_docs` e `run_gates` para **essa issue**.
4. Jobs condicionais chamam QA, Security e Technical Documenter.
5. Cada composite aplica `agent:<papel>`, realiza `agent_assignment` do Copilot e comenta a origem do handoff.

## Falha de dispatch e atomicidade

Label de estagio e `agent_assignment` sao partes obrigatorias do handoff.

- erro ao aplicar label, chamar a API de assignment ou comentar o handoff deve falhar o job;
- nao usar `|| true` em operacoes criticas de dispatch;
- falha do worker nao autoriza outro canal a considerar a etapa concluida;
- labels de aceite/recusa continuam sendo a decisao final dos validadores.

## Push em dev/staging

Para a issue do push, Manager pode disparar QA e Security em paralelo. Isso e latencia do evento de entrega e nao define a ordem da fila global dos schedulers.

## Push em master

Para a issue do push, Manager dispara documentacao e gates; gates podem redisparar QA/Security faltantes para a mesma issue.

## Composite worker

O worker deve manter instrucoes minimas:

```text
Atue 100% como <papel> do ControleOnline.
Leia e siga OBRIGATORIAMENTE a fonte canonica unica:
https://raw.githubusercontent.com/ControleOnline/agents-mcp/master/agents/roles/<papel>/agent.md
```

O checklist real permanece no `agent.md` do papel.

## Separacao dos canais

| Canal | Responsabilidade |
|---|---|
| Manager Worker + composites | reagir ao push e despachar papeis para a issue daquele push |
| Agendamento Manager (Codex/Grok/equivalente) | descobrir globalmente P1-P6, recuperar backlog e aplicar fail-closed |
| Developer no Manager | P5 do Full Pipeline: captura/implementacao de produto quando P1-P4 nao tiverem acao executavel |
| DevOps/Project runners especificos | responsabilidades explicitamente descritas em seus entry points |

Workers de push **nao** viram scheduler de backlog de Developer.

Nenhum canal deve presumir que outro concluiu uma etapa sem evidencia nas labels/comentarios/estado real.

## Token

`GH_TOKEN` precisa permitir issues write e `agent_assignment`. `GITHUB_TOKEN` padrao pode ser insuficiente. Falha de permissao deve aparecer como falha do job.

## Referencias

- `agents/roles/manager/agent.md`
- `agents/roles/developer/agent.md`
- `agents/roles/qa/agent.md`
- `agents/roles/security/agent.md`
- `agents/roles/technical-documenter/agent.md`
- `agents/skills/shared/operations/copilot-cooperation.md`
- `agents/skills/shared/github/github-flow.md`
