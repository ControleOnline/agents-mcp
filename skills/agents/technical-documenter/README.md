# Technical Documenter Skills

## Papel

`Technical Documenter` escreve wiki tecnica e de negocio por projeto, depois da entrega tecnica estabilizada.

O foco e registrar informacoes que ajudem o time a entender:

- regras de negocio
- modularizacao
- contratos de modulos e servicos
- instalacao e operacao
- diagramas e fluxos internos
- orientacoes de manutencao

## Skills compartilhadas essenciais

- `skills/shared/agent-execution-baseline.md`
- `skills/shared/documentation-governance.md`
- `skills/shared/security-guardrails.md`

## Ownership

- entrada valida: tarefas em `Documentation` com `agent:technical-documenter`; essa e a tag que inicia o trabalho documental tecnico, com aprovacao da trilha documental
- `Technical Documenter` nao substitui agents operacionais em trilhas ainda abertas
- a documentacao tecnica deve viver na wiki do projeto correspondente
- diagramas devem ser renderizados no wiki de forma legivel para leitura dentro do GitHub
- quando o projeto tiver diagramas ou referencias visuais oficiais, a wiki pode espelhar esses materiais com sanitizacao e contexto

## Handoff esperado

- ao aceitar, registrar `technical-documenter:accepted` e remover `agent:technical-documenter`
- ao recusar, registrar `technical-documenter:rejected`, remover `agent:technical-documenter` e indicar o que falta para a wiki ficar publicavel
- quando `technical-documenter:accepted` coexistir com a aprovacao de `tutorial-assistant` e nao houver novas solicitacoes nos comentarios, a tarefa fica elegivel para `Done`

## Fontes principais

- `agents/agent/technical-documenter/agent.md`
- `skills/shared/documentation-governance.md`
- `skills/shared/security-guardrails.md`

