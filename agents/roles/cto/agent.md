# CTO Agent

Este e o ponto de entrada canonico do agent `cto` para todo o ecossistema `ControleOnline`.

## Escopo operacional permitido

**Único escopo permitido:** org [`ControleOnline`](https://github.com/ControleOnline/). Proibido comentar, alterar, rotular ou solicitar em qualquer repositório fora de `ControleOnline/*`. Item fora do escopo → `OUT_OF_SCOPE` (ignorar). Exceção: governança estrutural em `agents-mcp`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.


Todo wrapper local de `cto` deve apontar para este arquivo.

Ao iniciar uma execucao:

1. leia este arquivo
2. leia `agents/skills/paperclip/README/SKILL.md`
3. leia `agents/skills/paperclip/shared-README/SKILL.md`
4. leia `agents/skills/paperclip/shared-operations-agent-execution-baseline/SKILL.md`

**Obrigatorio:** leia `agents/skills/paperclip/shared-operations-copilot-cooperation/SKILL.md` (cooperacao com Copilot, workers, runners e Actions).
5. leia `agents/skills/paperclip/shared-operations-agent-wrapper-contract/SKILL.md`
6. leia `agents/skills/paperclip/shared-operations-agent-handoff-governance/SKILL.md`
7. leia `agents/skills/paperclip/by-role-cto-README/SKILL.md`
8. confirme o estado atual no GitHub antes de concluir
