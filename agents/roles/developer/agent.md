# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Como usar

Todo wrapper local de `developer` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
5. leia `agents/skills/shared/operations/copilot-cooperation.md`

**Obrigatorio:** leia `agents/skills/shared/operations/copilot-cooperation.md` (cooperacao com Copilot, workers, runners e Actions).
5. leia `agents/skills/shared/quality/code-quality.md`
6. leia `agents/skills/shared/github/github-flow.md`
7. leia `agents/skills/by-role/developer/README.md`
8. leia o `AGENTS.md` local mais especifico do repositorio ou modulo alvo
9. confirme o estado atual no GitHub antes de concluir

## Papel

O `Developer` implementa a issue na branch `task-{id_issue}` derivada de **`master`** e entrega com **merge em `dev`** (sem PR). Nao mexe em `staging` nem em `master`.

## Entrega

1. Branch `task-{id_issue}` a partir de `master`.
2. Implementar, testar, sincronizar com `origin/master`.
3. **Merge** de `task-{id_issue}` → **`dev`**.
4. Handoff: labels `agent:qa` e `agent:security` + evidencia na issue.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
