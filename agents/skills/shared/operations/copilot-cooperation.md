# Copilot Cooperation (PAUSADA temporariamente)

> **PAUSA CTO — ControleOnline/agents-mcp#201 (2026-08-29)**
> A cooperação com GitHub Copilot Coding Agent e o dispatch automatico de workers Copilot estao **desativados por enquanto**.
> Motivo: Copilot nao esta funcionando.
> Nao delegar para `copilot-swe-agent[bot]`, nao acionar `manager-worker` por push, nao usar `agent_assignment` do Copilot.
> Workers permanecem no repositorio apenas para religar sob ordem humana (`workflow_dispatch`).
> Agents na sessao executam o trabalho diretamente, sem o canal Copilot.

Skill **transversal**: todo agent do ecossistema `ControleOnline` **deve estender** esta skill. Durante a pausa, a extensao significa **respeitar o corte do canal Copilot**, nao reativa-lo.

## Objetivo

Em condicao normal: tratar o **GitHub Copilot Coding Agent**, os **workers/runners** deste repositorio e as **GitHub Actions** como **parceiros de execucao**.

**Estado atual:** canal Copilot/workers automaticos **off**. O agent na sessao permanece responsavel e **nao despacha Copilot**.

## Quem deve estender

Todos os papeis:

`cto` · `developer` · `devops` · `qa` · `security` · `sysadmin` · `manager` · `technical-documenter` · `tutorial-assistant`

Wrappers em `.github/agents/*.agent.md` (`target: github-copilot`) herdam esta skill via o `agents/roles/<papel>/agent.md` correspondente.

## Superficies de cooperacao

| Superficie | Estado na pausa |
| --- | --- |
| **GitHub Copilot Coding Agent** | Nao delegar |
| **Workers** (`workers/src`, `workers/automate`) | Sem dispatch automatico |
| **Runners** (`workers/src/*-runner.js`, `npm run …`) | Sem assignment Copilot |
| **GitHub Actions** (`.github/workflows`, `workers/automate/workflows`) | `manager-worker` so `workflow_dispatch` |
| **Scripts de sync** (`workers/scripts/sync-copilot-agents.mjs`) | Nao regenerar para reativar Copilot |
| **API GitHub** | Permitido para issues/PRs/checks sem `agent_assignment` Copilot |

## Fila (ControleOnline)

Siga `issue-queue-discovery.md` deste repositorio (issues/labels e Project quando aplicavel). Nao cite Copilot como executor enquanto a pausa vigorar.

## Regras de cooperacao

1. **Pausa fail-closed.** Nao reative Copilot/workers automaticos sem ordem humana explicita na #201.
2. **Estenda, nao substitua.** O agent na sessao permanece responsavel pelo criterio, elegibilidade, handoff e qualidade.
3. **Nao prefira Copilot** enquanto a pausa estiver ativa.
4. **Nao prefira workers/runners** para assignment Copilot enquanto a pausa estiver ativa.
5. **Actions** so quando nao despacharem Copilot.
6. **Sempre referencie a tarefa** da fila (`owner/repo#n`) em PRs, commits e handoff.
7. **Nao invente canal paralelo** de fila.
8. **Ao receber resultado legado do Copilot**, valide CI, diff e criterios do papel antes do handoff.
9. **Wrappers Copilot** permanecem finos; nao regenere para furar a pausa.
10. **Falha de superficie**: registre o bloqueio e continue sem Copilot.

## Contrato de delegacao ao Copilot

**Suspenso.** Nao montar prompt de delegacao ao Copilot Coding Agent ate revogar a pausa em ControleOnline/agents-mcp#201.

## Contrato de uso de workers / runners

```bash
# Dispatch automatico com assignment Copilot: DESATIVADO
# AGENT_DISPATCH_ROLE=developer npm run dispatch
```

- Fila: workers de project/issue dispatch documentados neste repo permanecem no codigo
- Env: `GITHUB_TOKEN` / GitHub App
- Uso na pausa: somente diagnostico humano / `workflow_dispatch` consciente

## Contrato de Actions

- `manager-worker.yml` nao escuta mais push em `master`/`dev`/`staging`.
- `github-operations.yml` nao roda mais por `schedule` nem `issue_comment`.
- Secrets: `GITHUB_TOKEN` / GitHub App.

## Ordem de leitura (todo agent)

1. `copilot-cooperation.md` (esta skill)
2. `agent-execution-baseline.md`
3. `issue-queue-discovery.md`
4. `agent-handoff-governance.md`
5. skills do papel em `by-role/<papel>/`
6. `github-flow.md` quando houver codigo/PR

## Output minimo ao cooperar

- superficie usada (durante a pausa: sessao direta, sem Copilot)
- tarefa da fila
- PR/run/job IDs
- resultado e proxima label/status

## Quality bar

- nao reative Copilot/workers automaticos nesta pausa
- nao despeje trabalho no Copilot
- nao trate output legado do Copilot como verdade sem validacao do papel
- nao quebre a fonte canonica `agents-mcp` com regras so no wrapper
- nao desvie da skill de fila deste repositorio
