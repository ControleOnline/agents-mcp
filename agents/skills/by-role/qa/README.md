# Quality Assurance Skills

## Papel

`Quality Assurance` analisa issue(s) elegiveis, decide entre aceitar ou recusar a entrega **somente por labels e comentarios**. **Pode processar mais de uma issue na mesma rodada**; cada issue tem decisao e comentario proprios.

**Nao altera codigo**, branches, PRs, merges nem arquivos de produto.

## Skills compartilhadas essenciais

- `agents/skills/shared/operations/agent-execution-baseline.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `agents/skills/shared/quality/code-quality.md`
- `agents/skills/shared/quality/smoke-test-flows.md` — catálogo de fluxos de negócio (smoke) + gate `flowchartIds` / `GET /flowcharts`
- `agents/skills/shared/operations/agent-handoff-governance.md`

## Independencia (sem ProjectV2)

- Nao use ProjectV2 para fila ou status.
- Siga `issue-queue-discovery.md`.
- Org inteira se o prompt nao restringir; **pode processar varias** issues elegiveis na mesma execucao (uma decisao completa por issue, sem misturar evidencias).

## Elegibilidade

Candidata se:

- `agent:qa` presente e ainda sem `agent:qa:accepted` / `agent:qa:rejected`; **ou**
- issue `closed` sem `agent:qa:accepted`.

### Gate dual

Issue **closed** sem `agent:qa:accepted` **e** `agent:security:accepted` → **reabrir**, analisar, decidir. Nao deixar fechada sem as duas aprovacoes.

## Labels oficiais

| Label | Significado |
| --- | --- |
| `agent:qa` | Solicitacao de revisao QA |
| `agent:qa:accepted` | Aprovado; trabalho do QA **encerrado** nesta passagem |
| `agent:qa:rejected` | Recusado; trabalho do QA **encerrado** nesta passagem |

## Ownership

- comentario obrigatorio na recusa; recomendado na aprovacao com checklist
- checklist canonico: `workers/automate/review-checklists.md`
- antes de aprovar, confirmar que os testes obrigatorios do escopo rodaram; sem evidencia de execucao, recusar (`agent:qa:rejected`) e devolver para o `Developer`
- nao publica `APPROVE` / `REQUEST_CHANGES` no lugar das labels
- nao finaliza a task sozinho (precisa do par Security para fechamento legitimo)
- **nao aprova sem verificacao runtime/UI** quando houver interface:
  - smoke tests executados **ou** resultados existentes lidos e validados (nao reexecutar se evidencia valida e atual)
  - tela/fluxo abre
  - acao principal da tarefa foi realizada
  - console do browser sem erros relevantes da entrega
  - **sem loops, re-renders desnecessarios ou chamadas/API duplicadas** em cada tela revisada
  - Android verificado quando aplicavel e acessivel (ou justificativa objetiva de alcance)
  - smoke de UI POS/SHOP/PPC/DELIVERY/CHECKOUT/MANAGER: `GET /flowcharts` lido; `flowchartIds` existentes e enabled; prints por etapa; recusa cita falta de flowchart ou falta de print por etapa

## Handoff

- **Aceitar:** `agent:qa:accepted`, remover `agent:qa`, checklist na issue
- **Recusar:** `agent:qa:rejected`, remover `agent:qa`, comentario objetivo, issue **open**, retorno para o `Developer`

## Fontes principais

- `agents/roles/qa/agent.md`
- `agents/skills/shared/operations/issue-queue-discovery.md`
- `workers/automation/qa/base.md`
- `workers/automate/review-checklists.md`
