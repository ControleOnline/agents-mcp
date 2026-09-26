# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/controleonline/by-role-devops-README/SKILL.md`, `agents/skills/controleonline/shared-github-release-candidate/SKILL.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **RC/staging primeiro:** com tasks que tenham `agent:security:accepted` e revalidacao do Manager, monte uma RC tecnica congelada com 1 a 5 tasks. A RC nasce do master atual, recebe cada task individualmente, gera manifesto de SHAs e **e promovida como snapshot para staging ate `origin/staging` coincidir com o tip da RC**. Nao mergeie `dev` inteiro em staging. Nao declare RC concluida so com a branch `rc/*`.
2. **Master depois da homologacao:** quando as tasks daquela RC forem autorizadas em Deploy, publique **a mesma RC congelada** em master. Nao recalcule pins, nao inclua task nova e nao use staging como origem. Se qualquer SHA mudar, gere nova RC e repita a homologacao.

A RC e artefato tecnico, nao task agregadora. Branch obrigatoria: `rc/X.Y.Z-rc.N`; manifesto obrigatorio: `.release/rc-manifest.json`. Maximo de 5 tasks por RC.

### Staging e homologacao humana

- A RC existe para o humano validar **no staging**.
- Promover/resetar `staging` para o tip da RC e **obrigatorio** no mesmo ciclo de "criar RC".
- Historico divergente em staging: **reset** para o SHA da RC (PR `automation/reset-rc-…-staging`, force autorizado ou workflow de reset). Nao misturar commits fora do manifesto.
- So apos `staging` == tip da RC o Manager move as tasks para **In Review**.

## Captura autonoma

1. RC homologada cujas tasks estejam em `Deploy` → mesma RC congelada → `master`
2. tasks com `agent:security:accepted` ainda fora de RC → montar RC de 1 a 5 tasks → **promover snapshot para `staging`** → Manager move para In Review
3. RC com branch `rc/*` publicada mas `staging` divergente → **P1 urgente:** alinhar staging ao tip da RC
4. `agent:devops` residual com acao de merge

Hotfix → staging e P2 do Manager.

## Publicacao

Humano move as tasks homologadas para `Deploy`. DevOps publica exatamente a RC congelada homologada, sem recompor o delta. Artefato de producao nao dispara no push de `master`.

Com todas as tasks da RC em `Deploy`, publique a nova versão em `master` e
registre o handoff ao Manager; DevOps não move a task no board.

### Política temporária de força

O parâmetro operacional `force_deploy: true` autoriza o DevOps a publicar sem
aguardar os testes automatizados. Enquanto esta política estiver ativa, o
runner usa `DEVOPS_FORCE_DEPLOY=true` como padrão para todos os deploys; um
`force_deploy: false` explícito pode reativar o gate em uma task específica.

O bypass vale somente para a exigência dos testes automatizados. Continua obrigatório confirmar que todas as tasks da RC estão em `Deploy`, a origem `rc/X.Y.Z-rc.N`, o manifesto congelado, os mesmos SHAs homologados, a versão, o push remoto e o runtime publicado. Todo
handoff deve registrar `force_deploy`, a origem da política e o motivo do
bypass.
