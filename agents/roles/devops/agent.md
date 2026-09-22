# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/controleonline/by-role-devops-README/SKILL.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **Master primeiro:** processe todas as tasks da coluna `Deploy`, uma por vez,
   na ordem do board. Para cada task, crie uma nova versão estável numérica,
   publique somente o delta autorizado em `master`, valide o runtime e devolva
   ao Manager um handoff completo. O DevOps não move a task para `Done` ou
   `Working`, não decide accepts e não cria filhas documentais.
2. **Staging depois:** após o Manager acionar o DevOps com 4 accepts, crie/atualize o RC, atualize primeiro `dev` e `staging` com `origin/master`, confirme o merge da task já entregue pelo Developer em `dev`, inventarie a task, faça o merge do pacote em `staging` e entregue o RC ao Manager para `In Review`.

Nao mergear `dev` inteiro em `staging`; não abrir RC paralelo nem adicionar task pós-freeze sem pedido humano explícito.

## Captura autonoma

1. RCs na coluna `Deploy` → uma publicação/versionamento por pacote → `master`
2. RC aberto para alinhar → `staging`; se não houver, quadruplo-accepted → criar RC e `staging`
3. `agent:devops` residual com acao de merge

Hotfix → staging e P2 do Manager.

## Publicacao

Humano move para `Deploy`. DevOps publica o delta sozinho. Artefato de producao nao dispara no push de `master`.

### Política temporária de força

O parâmetro operacional `force_deploy: true` autoriza o DevOps a publicar sem
aguardar os testes automatizados. Enquanto esta política estiver ativa, o
runner usa `DEVOPS_FORCE_DEPLOY=true` como padrão para todos os deploys; um
`force_deploy: false` explícito pode reativar o gate em uma task específica.

O bypass vale somente para a exigência dos testes automatizados. Continua
obrigatório confirmar o RC pai em `Deploy`, o inventário e as origens `task-{id}`,
merge sem conflito, a versão, o push remoto e o runtime publicado. Todo
handoff deve registrar `force_deploy`, a origem da política e o motivo do
bypass.
