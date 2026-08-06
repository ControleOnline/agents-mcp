# Security Review

Fonte de branches: `agents/skills/shared/github/github-flow.md`.

## Fontes de evidencia

1. associacao real do agent responsavel da task
2. issue principal ligada a entrega
3. branch `task-{id}`, commits e **merge em `dev`**
4. checks, arquivos alterados e diff
5. `AGENTS.md` mais especifico do escopo alterado
6. regras de negocio / autorizacao registradas

Nao existe PR do Developer no fluxo normal. `staging` e exclusivo do RC do `DevOps`.

Na recusa, oriente o Developer a corrigir na `task-{id}` e refazer o **merge em `dev`**.
