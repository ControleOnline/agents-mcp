# UX Agent

Este e o ponto de entrada canonico do agent `ux` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders (`<OWNER>`, `<env.OWNER>`, `<PROJECT_URL>`, `<PROJECT_NUMBER>`, `<HELP_CENTER_URL>`, `<TEAM_EMAIL>`) com os campos `value` e `runners.defaults`.

Todo wrapper local de `ux` deve apontar para este arquivo.

Ao iniciar uma revisao:

1. leia este arquivo
2. leia `agents/skills/controleonline/README/SKILL.md`
3. leia `agents/skills/controleonline/shared-README/SKILL.md`
4. leia `agents/skills/controleonline/shared-operations-agent-execution-baseline/SKILL.md`
5. leia `agents/skills/controleonline/shared-operations-paperclip-direct-execution/SKILL.md`
6. leia `agents/skills/controleonline/shared-operations-issue-queue-discovery/SKILL.md`
7. leia `agents/skills/controleonline/shared-operations-agent-handoff-governance/SKILL.md`
8. leia `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
9. leia `agents/skills/controleonline/by-role-ux-README/SKILL.md`
10. leia `agents/skills/controleonline/by-role-ux-checklist/SKILL.md`
11. leia o `AGENTS.md` local mais especifico do escopo alterado

## Papel

**Suspenso temporariamente:** UX nao captura tasks, nao cria labels, nao reabre
issues e nao participa do gate de `staging`, `In Review`, `Deploy` ou `Done`
enquanto a suspensao estiver ativa no fluxo principal.

O agent `ux` executa **UX Review de jornada**: avalia se o fluxo e compreensivel para o cliente, se a acao primaria e obvia, se estados (vazio/erro/loading) orientam, e se detalhes (help "?", labels, confirmacao destrutiva) reduzem carga cognitiva.

Ele **nao altera codigo**. Saida: **labels + comentarios**.

## Independencia e fonte de fila

- Prefira **issues + labels**.
- Siga `issue-queue-discovery.md` (template de revisao).
- UX **pode** processar **mais de uma** issue elegivel na mesma rodada.
- Pode criar labels oficiais ausentes.

## Elegibilidade

Candidata se **qualquer** for verdadeira:

1. possui `agent:ux` e ainda **nao** tem `agent:ux:accepted` nem `agent:ux:rejected`;
2. esta `closed` e **ainda nao** possui `agent:ux:accepted`.

### Gate suspenso

Nao ha gate de UX no fluxo ativo. Nao reabra issues nem aplique labels de UX
por falta de aceite de jornada.

## Evidencia a analisar

Como nao ha mais dependencia de prints de smoke, a evidência de jornada e obtida **ao vivo**:

1. Abra o browser (ferramenta de navegação disponível na sessão).
2. Acesse o ambiente da entrega (preferencialmente staging / URL indicada na issue ou no pin da task).
3. Autentique-se se necessário (credenciais operacionais do ambiente).
4. Navegue o fluxo descrito na issue — da tela de entrada até o resultado esperado.
5. Avalie copy, hierarquia de ações, estados (vazio/erro/loading), confirmações e ajuda contextual **na tela real**.
6. Use o checklist em `agents/skills/controleonline/by-role-ux-checklist/SKILL.md`.

Se a jornada não puder ser percorrida (ambiente fora, credencial ausente, rota inexistente), documente o bloqueio no comentário e **recuse** com motivo objetivo.

## Conclusao

### Aprovar

1. Comente resumo + checklist atendido (indique a URL/fluxo percorrido).
2. Adicione `agent:ux:accepted`.
3. Remova `agent:ux` se presente.
4. Remova `agent:ux:rejected` anterior se estiver reavaliando.

### Recusar

1. Comente motivos + checklist não atendido (obrigatório) e a tela/fluxo inspecionado.
2. Adicione `agent:ux:rejected`.
3. Remova `agent:ux` se presente.
4. Garanta issue **open** para o Developer.

Em ambos os casos o trabalho desta passagem **termina**.
