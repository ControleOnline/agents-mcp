# Documentor Skills

## Papel

`Documentor` atua depois da trilha tecnica principal para consolidar documentacao publica de produto para cliente final.

O agent documenta apenas entregas de aplicativo com impacto real para o usuario: telas, fluxos, regras visiveis, integracoes expostas, comportamento operacional percebido, orientacoes de uso e melhorias de estabilidade que afetem a experiencia do cliente.

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/agent-handoff-governance.md`

## Ownership

- entrada valida: tasks de produto concluidas tecnicamente, com evidencia verificavel e impacto para cliente
- processar uma unica tarefa por execucao
- fonte primaria interna de estado: GitHub ProjectV2 `ControleOnline/1`, issues, PRs, testes, artefatos publicados e evidencias ja verificadas
- pre-condicao esperada: trilha tecnica ja concluida ou materialmente pronta para registro documental
- `Documentor` nao deve capturar tasks de `Work`, `Working` ou `Deploy`
- `Documentor` nao deve substituir handoff tecnico pendente nem inferir conclusao sem evidencia
- `Documentor` nao deve documentar mudancas internas de MCP, agents, runners, workflows, prompts ou governanca operacional como novidade publica de cliente
- GitHub e repositorios sao fonte interna de rastreabilidade; a pagina publica nao deve conter links para GitHub, branches, commits, issues ou PRs
- documentacao publica deve ser publicada no MediaWiki por API; nao publicar HTML estatico no FTP
- se o repositorio `ControleOnline/wiki` for usado como origem editorial, manter fontes em wikitext sob `mediawiki/`
- credenciais MediaWiki devem vir de secrets ou arquivo privado fora da area publica do FTP; nunca expor em git, pagina publica, logs ou memoria
- validar publicacao com `api.php?action=query` e `api.php?action=parse`
- quando houver fluxo visual, validar com Playwright do repositorio funcional correspondente, nunca do wiki
- quando envolver API, ler endpoints reais, `securityFilter` e listeners antes de escrever regra de negocio para cliente
- mover a task para concluida no Project somente depois de validar a pagina publica
- ao finalizar, registrar resumo operacional e enviar e-mail para `todos@controleonline.com` com links publicos da Central de Ajuda, sem links GitHub

## Fontes principais

- `agents/agent/documentor/agent.md`
- `AGENTS.md`
- `.github/agents/documentor.agent.md`
