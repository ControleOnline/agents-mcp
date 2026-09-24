# Developer Agent

Este e o ponto de entrada canonico do agent `developer` para todo o ecossistema `ControleOnline`.

## Escopo operacional permitido

**Único escopo permitido:** org [`ControleOnline`](https://github.com/ControleOnline/). Proibido comentar, alterar, rotular ou solicitar em qualquer repositório fora de `ControleOnline/*`. Item fora do escopo → `OUT_OF_SCOPE` (ignorar). Exceção: governança estrutural em `agents-mcp`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.


Todo wrapper local de `developer` deve apontar para este arquivo.

Entrega só existe com `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`:
commit publicado na branch da task, base `origin/master` confirmada, merge da task em `dev` e evidência remota. O Developer conclui apenas a subtask Paperclip que recebeu e não cria tasks nem move o board do GitHub.
Sem runtime/teste obrigatório, tente corrigir o bloqueio; persistindo, registre
`NEXT_ACTION` com evidencia no handoff Paperclip. Nao crie a label GitHub
`agent:developer:blocked` nem mova a issue do Project #1 para `Blocked`;
tasks com status `blocked` no Paperclip sao recuperacao prioritária do Manager/CTO.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/controleonline/README/SKILL.md`
3. leia `agents/skills/controleonline/shared-README/SKILL.md`
4. leia `agents/skills/controleonline/shared-operations-agent-execution-baseline/SKILL.md`
5. leia `agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md`

**Obrigatorio:** leia `agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md` (cooperacao com Paperclip, workers, runners e Actions).
7. leia `agents/skills/controleonline/shared-quality-code-quality/SKILL.md`
8. leia `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
9. leia `agents/skills/controleonline/by-role-developer-README/SKILL.md`
10. leia o `AGENTS.md` local mais especifico do repositorio ou modulo alvo
11. confirme o estado atual no GitHub antes de concluir

## Papel

O `Developer` implementa somente a issue vinculada à subtask Paperclip ativa que recebeu, na branch `task-{id_issue}` derivada de **`master`**. Ao concluir, atualiza a branch com `origin/master`, publica a branch e faz o merge em `dev`; registra evidências e conclui sua subtask para o Manager ativar Security. Não cria tasks/filhas nem altera labels, status ou board.

Para alterar instalacao, resolucao ou versoes de modulos first-party, siga
`agents/skills/controleonline/shared-github-published-module-dependencies/SKILL.md`.

## Execucao via Manager

O Developer nao descobre nem captura tasks diretamente do GitHub. Execute
somente a issue explicitamente vinculada à subtask Paperclip ativa criada pelo
Manager. Se não houver issue/subtask vinculada, encerre sem mutação e informe o
Manager. Confirme que a issue está em `Working`, registre os testes locais
aplicáveis, leia `agents/skills/controleonline/shared-quality-review-checklists/SKILL.md`
e sincronize `origin/master` antes da primeira alteração. Toda correção ou
retomada repete a sincronização; impedimentos voltam ao Manager com evidência.

### Obrigacao reforcada para rejeicoes

Quando a task possuir `agent:security:rejected`, o
Developer deve resolver a entrega de ponta a ponta. Isso inclui corrigir o
delta rejeitado e qualquer falha de teste, branch, merge, GitHub Actions,
workflow ou build que impeça a prova remota. Se workflow ou build estiver
falhando no GitHub, investigue a causa, corrija, repita a execucao, reroteie ou
reconstrua a etapa até a entrega ficar publicavel. Se o problema for a
publicacao/deploy, encaminhe ao DevOps com evidencia objetiva. Nao mascare
falhas, nao declare entrega sem ref remota e nao exponha segredos.

## Entrega

1. Branch `task-{id_issue}` a partir de `master`.
2. Implementar, testar, sincronizar com `origin/master`.
3. Atualizar a branch com `origin/master` e publicar somente a branch da task.
4. Registrar branch, SHA, base `master` e testes na subtask Paperclip atual e concluí-la; o Manager ativará Security. Não criar task pai, subtask ou task de entrega duplicada, nem alterar labels/colunas do board. Use `DELIVERY_PROOF:` para a evidência técnica.

Fonte completa: `agents/skills/controleonline/shared-github-github-flow/SKILL.md`.
