# Agent Handoff Governance

## Overview

Use esta skill para padronizar tags, transicao de etapa, handoff tecnico e desvio operacional entre agents.

Regra transversal: leia `delivery-proof-contract.md`. Comentário, diagnóstico,
handoff textual ou commit apenas local não são entrega.

## Workflow

1. O `Manager` e o unico dono de descoberta/captura GitHub, task pai, subtasks, prioridade, labels e colunas.
2. Nunca atribua tasks a pessoas, bots ou fallbacks tecnicos.
3. A esteira de produto e exclusivamente `Developer` → `Security` → `Manager` → `DevOps`; ative apenas a subtask vigente e ligue as dependencias com `blocked by`.
4. `Developer` implementa em `task-{id}` a partir de `master`, executa testes locais, faz merge em `dev` e registra evidencias na subtask atual; nao cria tasks ou subtasks.
5. `Security` revisa somente a subtask atribuida e registra decisao/evidencia nela. O `Manager` traduz a decisao para labels; recusa reativa `Developer`.
6. Apos aceite Security, o `Manager` revalida testes locais e evidencias; so entao ativa `DevOps`.
7. `DevOps` executa somente a subtask atribuida: cria/congela RC com manifesto imutavel, promove para `staging` e solicita ao Manager mover as tasks inventariadas para `In Review`.
8. O humano move a RC homologada para `Deploy`; DevOps publica a mesma RC em `master`, sem alterar SHAs. O Manager atualiza a coluna apos prova do deploy.
9. Nao crie tarefas auxiliares de outros papeis, nem aceite, status ou gate fora desta sequencia.
10. Nao faca handoff sem evidencia concreta; o handoff só é válido com mutação verificável: commit/ref remoto e merge
    para entrega de código, decisão de Security na subtask, ou merge + coluna
    para DevOps/board;
11. se a tentativa falhar após correção objetiva, nao aplique labels GitHub
    `agent:<papel>:blocked` nem mova a issue no GitHub Project #1 para `Blocked`;
    ambos sao estados humanos e a issue/board ficam somente-leitura para agents.
    Registre `NEXT_ACTION` com responsavel, tentativa e evidencia. Se a task de
    execucao Paperclip receber `status=blocked` pelo fluxo operacional, ela
    passa para a inbox Paperclip de recuperacao e deve ser priorizada pelo
    Manager/CTO; esse status nao bloqueia nem altera o item no GitHub.
12. não repita a mesma issue sem SHA/label/coluna/evidência novos.

## Gate obrigatorio de entrega local

Se o agent alterou qualquer arquivo, submodulo, gitlink ou configuracao local, o handoff so pode ser feito depois de entregar o trabalho e registrar evidencia verificavel. Nao e permitido deixar mudanca local solta, commit apenas local ou resultado dependente de um checkout que nao foi publicado.

Antes do handoff, o agent deve:

1. inventariar todos os projetos principais e submodulos afetados;
2. publicar cada mudanca no branch remoto previsto pelo fluxo (`task-{id}`, `dev`, `staging` ou `master` conforme o papel), incluindo primeiro o commit do submodulo e depois o gitlink do projeto pai;
3. confirmar, para cada projeto principal e submodulo afetado, o estado de `origin/master` com `git fetch` direcionado, `git rev-list --count origin/master..HEAD` e `git rev-list --count HEAD..origin/master`, alem de confirmar ausencia de alteracoes staged, unstaged ou untracked;
4. quando o checkout precisar permanecer em uma branch de task ou integracao para a proxima etapa, registrar branch, SHA, remote ref e motivo no handoff, sem tratar isso como alinhamento a `origin/master`;
5. bloquear o handoff e registrar a pendencia se qualquer alteracao local nao puder ser publicada ou se algum projeto/submodulo afetado nao puder ser comprovadamente verificado.

O handoff deve declarar separadamente: (a) o que foi publicado, (b) o estado de cada projeto principal e submodulo em relacao a `origin/master`, e (c) qualquer excecao de branch exigida pelo fluxo. `git status` isolado, commit local ou branch local nao sao evidencia de entrega.

## Output Contract

- tag operacional atual
- proxima tag / coluna
- evidencia do handoff, bloqueio ou pulo
- se houve devolucao, por que

O comentário de conclusão deve conter `DELIVERY_PROOF:` com a ação, refs/IDs e
estado pós-ação.

## Quality Bar

- nao retenha task na fila errada
- nao use assignee como ownership
- nao trate conflito de merge como detalhe
- nao mova tarefa por aproximacao textual
- nao crie task pai de RC nem altere RC congelada
- nao refaca passo ja evidenciado; documente o pulo
