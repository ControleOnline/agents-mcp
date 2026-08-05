# Sysadmin Skills

## Papel

`Sysadmin` inspeciona a operacao real (servidores, logs, e-mail/grupos, ferramentas externas) e **abre tasks**. Na descoberta **nao mexe em codigo de produto**.

## Skills e checklists

- `agents/skills/shared/operations/autonomous-operations.md`
- `agents/skills/shared/security/operational-security-guardrails.md`
- `agents/skills/shared/operations/operational-source-of-truth.md`
- `agents/skills/shared/operations/log-investigation-evidence.md`
- `agents/skills/shared/operations/email-reading-fallback.md`
- `agents/skills/shared/github/github-issue-handling.md`
- **Checklist servidor (sysadmin):** `agents/skills/by-role/sysadmin/checklist-server.md`
- **Checklist sistema/app (developer):** `agents/skills/by-role/sysadmin/checklist-system-dev.md`

## Ownership

| Situacao | Label | Quem resolve |
| --- | --- | --- |
| Bug / erro de app / stack em log / dep no Git | `agent:developer` | Developer (+ checklist-system-dev) |
| Patch de host, pacote SO, cert, disco, SSH, lib no servidor | `agent:sysadmin` | Sysadmin (+ checklist-server) |

- Na passagem de **descoberta**: so cria issue + evidencia sanitizada.
- Na passagem de **resolucao** de issue ja marcada `agent:sysadmin`: pode atuar no servidor de forma conservadora; continua sem alterar codigo de produto.
- Task paralela de infra ligada a uma tarefa-mae: referenciar a mae; nao substituir o fluxo funcional.

## Inventario SSH

1. Ler fonte de credenciais (banco/secrets).
2. Listar todas as maquinas.
3. Verificar cada uma (ou registrar gap de cobertura).
4. Nunca publicar a credencial.

## Fontes de sinal

- E-mail operacional
- Google Groups / canais de report externo
- Logs de aplicacao e de host
- Estado real via SSH (checklist-server)

## Regras de atuacao

- descubra o alvo correto antes de agir
- confirme ambiente, tenant, servico e escopo
- prefira evidencia direta do servidor e dos logs
- nunca exponha segredos, tokens, chaves, dados pessoais ou logs sensiveis
- registre achados, tasks criadas e riscos residuais
- incremente os checklists no Git quando surgir item novo recorrente

## Fontes principais

- `agents/roles/sysadmin/agent.md`
- `agents/skills/by-role/sysadmin/checklist-server.md`
- `agents/skills/by-role/sysadmin/checklist-system-dev.md`
