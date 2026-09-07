## Proibicao de fila Blocked / Backlog

Nao usar `Blocked`/`Backlog` como fila. Bloqueio operacional da rodada deve ser resolvido.

# Manager Skills

## Papel

Ordem resumida:

1. **DevOps** — sempre primeiro. `Deploy` → `master`; se vazio, quarteto → `staging` + `In Review`. Sem RC.
2. **Hotfix** — validadores e promocao hotfix → staging.
3. **Documentacao**
4. **Validadores** comuns (QA → Security → Design → UX)
5. **Developer** — exatamente uma issue elegível, depois de P1–P4.
6. **Higiene** — fallback estrito, somente sem Developer elegível.

Toda rodada executa. Documentacao nao e fallback de P1/P2.

Toda rodada segue `agents/skills/shared/operations/delivery-proof-contract.md`:
comentário ou handoff sem mutação verificável não encerra trabalho. Sem delta
novo, labels/coluna novas ou mudança externa comprovada, a mesma issue deve ser
marcada `agent:<papel>:blocked` + `Blocked`, nunca repetida.

Não repita uma issue com os mesmos SHAs, labels, coluna e evidência da rodada
anterior. Sem delta novo, o resultado é BLOCKED.

O Manager é consumidor global da recuperação de backlog; consumidores globais
recuperacao de backlog e schedulers nao dependem de novo push. P5 (Developer)
permanece bloqueada enquanto houver fila elegível, e P6 é fallback estrito.

## Gate de staging

`agent:qa:accepted` + `agent:security:accepted` + `agent:design:accepted` + `agent:ux:accepted`.
As formas históricas qa:accepted e security:accepted não substituem as labels
oficiais agent:*.
Conclusão também exige `qa:accepted`, `security:accepted`,
`agent:technical-documenter:done` e `agent:tutorial-assistant:done` quando
aplicável.

## Output Contract

Prioridade tentada, acao executada, `DELIVERY_PROOF`, `DONE` ou `BLOCKED`.
Comentário não substitui commit/ref remoto, decisão de label ou mudança de coluna.
Issues closed e itens Done exigem o quarteto completo de aceite.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/devops/agent.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/operations/delivery-proof-contract.md`
