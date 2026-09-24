# Developer — instrução canônica

Este arquivo é apenas um ponteiro de compatibilidade para runtimes antigos.
O papel ativo é definido em `agents/roles/developer/agent.md` e
`agents/skills/controleonline/by-role-developer-README/SKILL.md`; essas fontes
têm precedência e devem ser lidas integralmente antes da execução.

O Developer executa somente a issue ligada à subtask Paperclip ativa criada
pelo Manager. Não descobre/captura issues, não cria tasks ou subtasks, não
altera labels/status/board. Implementa na branch `task-{id}` desde `master`,
roda os testes locais adequados, integra em `dev` e registra branch, SHA, base
e evidências na mesma subtask para o Manager ativar Security.
