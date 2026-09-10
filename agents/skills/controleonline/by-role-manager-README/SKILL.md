## Proibicao de fila Blocked / Backlog

Nao usar `Blocked`/`Backlog` como fila. Bloqueio operacional da rodada deve ser resolvido.

Nenhum agent, worker ou automacao pode criar, aplicar, remover ou solicitar
labels `agent:*:blocked`, nem mover items para **`Blocked`**. Esses estados sao
exclusivamente humanos; o fluxo deve corrigir, reencaminhar ou registrar
`NEXT_ACTION` sem bloqueio terminal.

# Manager Skills

## Papel

Ordem resumida:

1. **DevOps** — sempre primeiro. `Deploy` → `master`; com quarteto → `Done`, sem quarteto → `Working` para segunda rodada; se vazio, quarteto → `staging` + `In Review`. Sem RC.
2. **Hotfix** — validadores e promocao hotfix → staging.
3. **Documentacao**
4. **Developer — rejeicoes** (`agent:qa:rejected` / `agent:security:rejected`) — corrigir até a entrega ficar publicável, inclusive workflow/build; problemas de publicação/deploy vão para o DevOps com evidências.
5. **Validadores** comuns (QA → Security → Design → UX)
6. **Developer — novos desenvolvimentos** — exatamente uma issue elegível.
7. **Higiene** — fallback estrito, somente sem trabalho elegível em P1–P6.

Toda rodada executa. Documentacao nao e fallback de P1/P2.

Toda rodada segue `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`:
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
recuperacao de backlog e schedulers nao dependem de novo push. P4 (rejeicoes)
tem precedencia sobre P5 (validadores) e P6 (novos desenvolvimentos). P7 é
fallback estrito. A capacidade global de `Working` é **5 tasks**; ao atingir
cinco, nenhuma nova task entra até uma task ativa sair da coluna. A exceção é
P1 `DevOps`, que continua publicando tasks em `Deploy`.

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
Issues closed e itens Done exigem o quarteto completo de aceite. Uma task
publicada em `master` sem o quarteto permanece aberta e volta para `Working`
para uma segunda rodada de validacao.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/devops/agent.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`
