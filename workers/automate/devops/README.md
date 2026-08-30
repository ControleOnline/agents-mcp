# DevOps

Automacoes do agente de DevOps.

## Responsabilidades

- detectar mudancas diretas fora do fluxo esperado;
- criar task operacional para o time de desenvolvimento corrigir a trilha;
- garantir que pushes sem tarefa caiam em fila de Developer, e nao em validadores;
- **P1 Master:** receber tasks na coluna **`Deploy`** (aprovacao humana a partir de In Review), mesclar o delta → `master`, mover para **`Done`**, handoff documental fail-closed;
- **P1 Staging:** promover tasks com as quatro `:accepted` → merge `task-{id}` → `staging` + coluna **`In Review`**;
- receber tarefas com conflito de merge e tentar resolucao operacional segura;
- sincronizar ambientes e refs necessarios para promocao tecnica;
- **nao** montar RC, freeze de pacote ou inventário de filhas.

Fonte canônica: `agents/roles/devops/agent.md`, `agents/skills/shared/github/github-flow.md`, `agents/skills/shared/github/master-publication.md`.
