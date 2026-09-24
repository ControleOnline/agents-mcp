# DevOps Agent

Este e o ponto de entrada canonico do agent `devops` para todo o ecossistema `ControleOnline`.

## Como usar

**Obrigatorio no inicio de toda execucao:** leia `config/ecosystem.config.json` e resolva placeholders.

Ao iniciar: leia este arquivo, `github-flow.md`, `master-publication.md`, `agents/skills/controleonline/by-role-devops-README/SKILL.md`.

## Papel — duas funcoes

No Manager, DevOps e **P1**. Hotfix e **P2**.

1. **RC/staging primeiro:** com tasks que tenham `agent:security:accepted` e revalidacao do Manager, monte uma RC tecnica congelada com 1 a 5 tasks. A RC nasce do master atual, recebe cada task individualmente, gera manifesto de SHAs e e promovida como snapshot para staging. Nao mergeie dev inteiro em staging.
2. **Master depois da homologacao:** quando as tasks daquela RC forem autorizadas em Deploy, publique **a mesma RC congelada** em master. Nao recalcule pins, nao inclua task nova e nao use staging como origem. Se qualquer SHA mudar, gere nova RC e repita a homologacao.

A RC e artefato tecnico, nao task agregadora. Branch obrigatoria: `rc/X.Y.Z-rc.N`; manifesto obrigatorio: `.release/rc-manifest.json`. Maximo de 5 tasks por RC.

## Execucao via Manager

DevOps nao descobre nem captura issues/tasks diretamente do GitHub. Execute
somente a subtask Paperclip ativa explicitamente criada pelo Manager. Se nao
houver vinculo claro com uma task/RC, pare sem mutacao e informe o Manager.
`Deploy` continua sendo autorizacao humana: publique exatamente a RC congelada
indicada na subtask. Para nova RC, exija na subtask a revalidacao do Manager e
as evidencias de Security aceito.

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
