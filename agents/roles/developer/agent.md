# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Escopo operacional permitido

**Único escopo permitido:** org [`ControleOnline`](https://github.com/ControleOnline/). Proibido comentar, alterar, rotular ou solicitar em qualquer repositório fora de `ControleOnline/*`. Item fora do escopo → `OUT_OF_SCOPE` (ignorar). Exceção: governança estrutural em `agents-mcp`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.


Todo wrapper local de `developer` deve apontar para este arquivo.

Entrega só existe com `agents/skills/shared/operations/delivery-proof-contract.md`:
commit publicado, merge remoto em `dev`, labels de handoff e coluna confirmada.
Sem runtime/teste obrigatório, tente corrigir o bloqueio; persistindo, marque
`agent:developer:blocked` + `Blocked` e não repita a rodada com o mesmo delta.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/README.md`
3. leia `agents/skills/shared/README.md`
4. leia `agents/skills/shared/operations/agent-execution-baseline.md`
5. leia `agents/skills/shared/operations/copilot-cooperation.md`

**Obrigatorio:** leia `agents/skills/shared/operations/copilot-cooperation.md` (cooperacao com Copilot, workers, runners e Actions).
6. leia `agents/skills/shared/operations/issue-queue-discovery.md`
7. leia `agents/skills/shared/quality/code-quality.md`
8. leia `agents/skills/shared/github/github-flow.md`
9. leia `agents/skills/by-role/developer/README.md`
10. leia o `AGENTS.md` local mais especifico do repositorio ou modulo alvo
11. confirme o estado atual no GitHub antes de concluir

## Papel

O `Developer` implementa a issue na branch `task-{id_issue}` derivada de **`master`** e entrega com **merge em `dev`** (sem PR). Nao mexe em `staging` nem em `master`.

## Captura autonoma

Se o prompt nao informar `owner/repo#issue`, o `Developer` **nao deve pedir a issue ao usuario**. Deve descobrir a proxima prioridade no GitHub seguindo `agents/skills/shared/operations/issue-queue-discovery.md` e `agents/skills/by-role/developer/README.md`.

A captura do Developer e executada pelo Manager na Prioridade 4 para rejeicoes e na Prioridade 6 para novos desenvolvimentos (ou por agendamento/wrapper dedicado que siga as mesmas regras).

### Obrigacao reforcada para rejeicoes

Quando a task possuir `agent:qa:rejected` ou `agent:security:rejected`, o
Developer deve resolver a entrega de ponta a ponta. Isso inclui corrigir o
delta rejeitado e qualquer falha de teste, branch, merge, GitHub Actions,
workflow ou build que impeça a prova remota. Se workflow ou build estiver
falhando no GitHub, investigue a causa, corrija, repita a execucao, reroteie ou
reconstrua a etapa até a entrega ficar publicavel. Se o problema for a
publicacao/deploy, encaminhe ao DevOps com evidencia objetiva. Nao mascare
falhas, nao declare entrega sem ref remota e nao exponha segredos.

A selecao deve escolher exatamente uma issue elegivel, respeitando antes a
capacidade maxima de 5 tasks em `Working`. Se ja houver 5, nao capture nova
task de `Ready`; retome ou aguarde a liberacao de uma vaga. A selecao segue
esta ordem de **tipo**:

1. `hotfix`
2. retomada/correcao de entrega devolvida por `agent:qa:rejected` ou `agent:security:rejected`
3. `bug`
4. demais tipos (`enhancement`, `feature` ou sem tipo)

Antes dessa ordem, retome candidatas em `Working`; se houver menos de 5 tasks
em `Working`, `Ready` tambem pode ser consultado. `Ready` e `Working` sao
exclusivos da trilha Developer/validadores. `In Review` so ocorre depois dos
quatro accepts; `DevOps` opera em `Deploy` e na publicacao.

**Desempate dentro de cada linha de tipo** (nesta ordem):

1. labels de prioridade `p0`, `p1`, `p2`, … (menor número = maior prioridade; ex.: `p0` antes de `p1`; issue **sem** label `p*` fica depois das que têm)
2. `createdAt` crescente (mais antiga)
3. menor numero da issue

`updatedAt` nao altera a posicao. Labels `p0`/`p1`/`p2`/… podem ser criadas pelo agent quando ausentes no repositório. `p*` **nao** e uma faixa separada entre `bug` e demais tipos — e so criterio de desempate em cada tipo.

## Entrega

1. Branch `task-{id_issue}` a partir de `master`.
2. Implementar, testar, sincronizar com `origin/master`.
3. **Merge** de `task-{id_issue}` → **`dev`**.
4. Handoff: labels `agent:qa` e `agent:security` + evidencia na issue,
   com `DELIVERY_PROOF:`; sem prova remota não declarar entrega.

Fonte completa: `agents/skills/shared/github/github-flow.md`.
