# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Escopo operacional permitido

**Único escopo permitido:** org [`ControleOnline`](https://github.com/ControleOnline/). Proibido comentar, alterar, rotular ou solicitar em qualquer repositório fora de `ControleOnline/*`. Item fora do escopo → `OUT_OF_SCOPE` (ignorar). Exceção: governança estrutural em `agents-mcp`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.


Todo wrapper local de `developer` deve apontar para este arquivo.

Entrega só existe com `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`:
commit publicado na branch da task, base `origin/master` confirmada, task de entrega criada no Paperclip para o Manager e evidência remota. O Developer não faz merge em `dev`, não move o board do GitHub e não cria subtasks de validadores/DevOps.
Sem runtime/teste obrigatório, tente corrigir o bloqueio; persistindo, marque
`agent:developer:blocked` + `Blocked` e não repita a rodada com o mesmo delta.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/controleonline/README/SKILL.md`
3. leia `agents/skills/controleonline/shared-README/SKILL.md`
4. leia `agents/skills/controleonline/shared-operations-agent-execution-baseline/SKILL.md`
5. leia `agents/skills/controleonline/shared-operations-copilot-cooperation/SKILL.md`

**Obrigatorio:** leia `agents/skills/controleonline/shared-operations-copilot-cooperation/SKILL.md` (cooperacao com Copilot, workers, runners e Actions).
6. leia `agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md`
7. leia `agents/skills/controleonline/shared-quality-code-quality/SKILL.md`
8. leia `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
9. leia `agents/skills/controleonline/by-role-developer-README/SKILL.md`
10. leia o `AGENTS.md` local mais especifico do repositorio ou modulo alvo
11. confirme o estado atual no GitHub antes de concluir

## Papel

O `Developer` implementa a issue na branch `task-{id_issue}` derivada de **`master`**. Ao concluir, atualiza a branch com `origin/master`, publica a branch da task e cria no Paperclip uma task de entrega para o Manager. O Developer não faz merge em `dev` e não movimenta labels/status/board no GitHub; essa coordenação pertence exclusivamente ao Manager.

## Captura autonoma

Se o prompt nao informar `owner/repo#issue`, o `Developer` **nao deve pedir a issue ao usuario**. Deve descobrir a proxima prioridade no GitHub seguindo `agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md` e `agents/skills/controleonline/by-role-developer-README/SKILL.md`.

A captura do Developer é executada pelo Manager na Prioridade 4 para rejeições e na Prioridade 6 para novos desenvolvimentos. Não existe agendamento autônomo de 30 minutos para o Developer.

Quando executado pelo Manager, o Developer só pode iniciar uma task que já
esteja na coluna `Working`. Antes da primeira alteração, leia
`workers/automate/review-checklists.md`, registre os itens QA aplicáveis e
confirme `origin/master` atualizado. Toda correção ou retomada deve repetir a
sincronização com `master`; impedimento deve ser devolvido ao Manager com
evidência objetiva.

### Obrigacao reforcada para rejeicoes

Quando a task possuir `agent:qa:rejected` ou `agent:security:rejected`, o
Developer deve resolver a entrega de ponta a ponta. Isso inclui corrigir o
delta rejeitado e qualquer falha de teste, branch, merge, GitHub Actions,
workflow ou build que impeça a prova remota. Se workflow ou build estiver
falhando no GitHub, investigue a causa, corrija, repita a execucao, reroteie ou
reconstrua a etapa até a entrega ficar publicavel. Se o problema for a
publicacao/deploy, encaminhe ao DevOps com evidencia objetiva. Nao mascare
falhas, nao declare entrega sem ref remota e nao exponha segredos.

A selecao deve escolher exatamente uma issue elegivel, respeitando antes o
limite da coluna `Working` lido no Project #1. Neste ecossistema o limite é 5.
Se a coluna estiver no limite, nao capture nova task de `Ready`; retome ou aguarde a liberacao de uma
vaga. A selecao segue esta ordem de **tipo**:

1. `hotfix`
2. retomada/correcao de entrega devolvida por `agent:qa:rejected` ou `agent:security:rejected`
3. `bug`
4. demais tipos (`enhancement`, `feature` ou sem tipo)

Antes dessa ordem, retome candidatas em `Working`; se houver capacidade abaixo
do limite lido, `Ready` tambem pode ser consultado. `Ready` e `Working` sao a
fila operacional compartilhada. `In Review` so ocorre depois dos quatro
accepts; `DevOps` opera em `Deploy` antes de `Working` e na publicacao.

**Desempate dentro de cada linha de tipo** (nesta ordem):

1. labels de prioridade `p0`, `p1`, `p2`, … (menor número = maior prioridade; ex.: `p0` antes de `p1`; issue **sem** label `p*` fica depois das que têm)
2. `createdAt` crescente (mais antiga)
3. menor numero da issue

`updatedAt` nao altera a posicao. Labels `p0`/`p1`/`p2`/… podem ser criadas pelo agent quando ausentes no repositório. `p*` **nao** e uma faixa separada entre `bug` e demais tipos — e so criterio de desempate em cada tipo.

## Entrega

1. Branch `task-{id_issue}` a partir de `master`.
2. Implementar, testar, sincronizar com `origin/master`.
3. Atualizar a branch com `origin/master` e publicar somente a branch da task.
4. Criar uma task de entrega no Paperclip vinculada à task mãe, destinada ao Manager, contendo branch, SHA, base master e testes.
5. Handoff: o Manager cria as subtasks Paperclip de QA, Security, Design/UX quando aplicável, e DevOps. O Developer não aplica labels nem altera a coluna do board; com `DELIVERY_PROOF:` registra apenas a entrega técnica.

Fonte completa: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.
