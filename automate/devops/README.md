# DevOps

Automacoes do agente de DevOps.

## Responsabilidades

- detectar mudancas diretas fora do fluxo esperado;
- criar task operacional para o time de desenvolvimento corrigir a trilha;
- garantir que pushes sem tarefa caiam em `Work`, para posterior captura pelo runner de `Developer`, e nao em `Quality Assurance`;
- receber tarefas aprovadas por humano e movidas para `Deploy`;
- receber tarefas com conflito de merge em PR aberto;
- sincronizar ambientes e refs necessarios para promocao tecnica;
- publicar em producao a build contida em `Deploy` ate a finalizacao.
- depois de publicar, mover a task para `Documentation` e aplicar `agent:tutorial-assistant` e/ou `agent:technical-documenter` para iniciar a trilha documental correspondente.
