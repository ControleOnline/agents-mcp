# Documentation Governance

## Overview

Governanca da documentacao tecnica e de tutorial no ecossistema ControleOnline.

## Trilhas

- `agent:tutorial-assistant` — ajuda pratica para cliente final
- `agent:technical-documenter` — wiki tecnica/negocio por projeto

## Technical Documenter

O `technical-documenter` **cria e atualiza** a wiki tecnica dos repositorios afetados pela tarefa.

- **Nao aprova** e **nao recusa** tarefas.
- **Nao usa ProjectV2** como fonte de fila ou status.
- Fonte de trabalho: issues do GitHub (org inteira se o prompt nao restringir).
- Uma issue por execucao.
- Labels oficiais (nomes exatos):
  - `agent:technical-documenter` — solicitacao de documentacao (qualquer status)
  - `agent:technical-documenter:done` — documentacao tecnica concluida
- Issues `closed` sem `agent:technical-documenter:done` tambem sao elegiveis.
- Se a tarefa tocou multiplos repositorios, documentar a wiki pertinente em **todos** eles.

### Navegacao humana e links cruzados

- Toda pagina nova deve ser alcancavel a partir da **Home** da wiki do modulo, em **categoria** ou indice clicavel.
- O `AGENTS.md` do modulo e ponte curta para Home → categorias → paginas → modulos relacionados.
- **Links entre repositorios/wikis do ecossistema sao preferiveis** e, em fluxo multi-modulo, obrigatorios no minimo (pagina canonica + Homes dos afetados).
- Fluxos transversais devem aparecer tambem na Home de `app-community` e/ou `api-community` quando couber.
- Interpretar visoes de app (`APP_TYPE` / `MODOS_OPERACAO.md`) ao descrever o papel de cada modulo.

## Tutorial Assistant

Labels de aprovacao da trilha publica:

- `tutorial-assistant:accepted` / `tutorial-assistant:rejected`

## Seguranca

Toda publicacao documental deve obedecer `agents/skills/shared/security/security-guardrails.md`.

## Fonte completa

Detalhes operacionais por papel ficam em `agents/skills/by-role/*/README.md` e nos `agents/roles/*/agent.md` correspondentes.
