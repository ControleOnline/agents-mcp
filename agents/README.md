# Agents

Esta pasta concentra os pontos de entrada canonicos dos custom agents.

## Estrutura

- `agents/agent/cto/agent.md`
- `agents/agent/developer/agent.md`
- `agents/agent/qa/agent.md`
- `agents/agent/security/agent.md`
- `agents/agent/devops/agent.md`
- `agents/agent/sysadmin/agent.md`
- `agents/agent/documentor/agent.md`

Os wrappers locais em `.github/agents/*.agent.md` de cada projeto e submodulo devem apontar para exatamente um desses arquivos centrais por tipo.

As regras compartilhadas vivem em `skills/shared/`. As regras detalhadas de execucao continuam em `automation/` e `automate/`.

Os wrappers locais podem ser regenerados pelo script:

- `scripts/sync-copilot-agents.mjs`

- Sempre leia o agents.md antes de fazer qualquer tarefa.

Mantenha os componentes do front pequenos, com menos de 500 linhas e menos de 200 se possível. Prefira sempre reutilizar os componentes Default* em vez de criar algo novo.

Na API, nunca esqueça de olhar o securityFilter e sempre leia os listeners pois existem várias coisas resolvidas neles.

Para maior acertividade, você pode:

Ler os endpoints da api, e deve fazer isso em vez de tentar adivinhar e criar diversos fallbacks.
Ler o banco de dados.

Sempre prefira gravar as regras de negócio em comentários no código em vez de o agents.md.

Ao finalizar qualquer tarefa, crie testes automatizados, testes de browser, adicione o que for pertinente no POSTMAN.
