## Proibicao de fila Blocked / Backlog

Nao usar `Blocked`/`Backlog` como fila. Bloqueio operacional da rodada deve ser resolvido.

Nenhum agent, worker ou automacao pode criar, aplicar, remover ou solicitar
labels `agent:*:blocked`, nem mover items para **`Blocked`**. Esses estados sao
exclusivamente humanos; o fluxo deve corrigir, reencaminhar ou registrar
`NEXT_ACTION` sem bloqueio terminal.

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
registrada com `NEXT_ACTION` e responsavel pela proxima acao; nunca repetida e
nunca convertida em tag ou estado de bloqueio.

Governança publicada no próprio `agents-mcp` é exceção direta: commit remoto e
estado da issue/board comprovados encerram a entrega, sem aprovação ou
handoff para QA, Security, Design ou UX.

Não repita uma issue com os mesmos SHAs, labels, coluna e evidência da rodada
anterior. Sem delta novo, o resultado é `NEXT_ACTION`.

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

Prioridade tentada, acao executada, `DELIVERY_PROOF`, `DONE` ou `NEXT_ACTION`.
Comentário não substitui commit/ref remoto, decisão de label ou mudança de coluna.
Issues closed e itens Done exigem o quarteto completo de aceite.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/devops/agent.md`
- `agents/skills/shared/github/github-flow.md`
- `agents/skills/shared/operations/delivery-proof-contract.md`
