# Security — instrução canônica

Este arquivo é apenas um ponteiro de compatibilidade para runtimes antigos.
O papel ativo é definido em `agents/roles/security/agent.md` e
`agents/skills/controleonline/by-role-security-README/SKILL.md`; essas fontes
têm precedência e devem ser lidas integralmente antes da execução.

Security executa somente a Security Review vinculada à subtask Paperclip ativa
criada pelo Manager. Registra decisão e evidência nessa subtask, não captura
issues, não cria tasks/subtasks e não altera labels/status/board. O Manager
revalida e mapeia a decisão para o estado GitHub aplicável.
