# Resolução de conflitos de integração

## Objetivo

Esta skill se aplica sempre que uma task, submódulo ou branch de integração
apresentar conflito, divergência ampla ou um diff que não possa ser revisado
semanticamente com segurança.

## Regra principal

Conflito não é autorização para escolher `ours`, `theirs`, fazer force-push ou
mesclar diretamente em `master`. Quando a task precisa ser refeita sem os
quatro accepts, o estado operacional é **Working**, respeitando o limite de 5
tasks simultâneas; **In Review** continua reservado à revisão humana depois
que os quatro accepts existirem e a task tiver chegado a staging.

## Fluxo obrigatório

1. Pare antes do merge final e registre origem, destino, SHAs, merge-base,
   arquivos conflitantes e o requisito afetado.
2. Aborte o merge/rebase e preserve a evidência; não publique a branch
   conflitante em `dev`, `staging` ou `master`.
3. Não altere a coluna pelo agent. Registre a devolução e, se a task estiver
   sendo refeita sem os quatro accepts, o estado esperado é **Working**;
   remova decisões/aceites que dependam da versão descartada e reative os
   validadores aplicáveis após a reaplicação.
4. Se a branch for aproveitável, atualize-a a partir de `origin/master`,
   resolva manualmente preservando as duas intenções e valide o diff final.
5. Se a branch estiver muito divergente, contaminada por commits de outras
   tasks ou não permitir separar o delta, descarte a branch local e remota,
   registre os SHAs antigos e recrie `task-{id}` a partir de `origin/master`.
6. Reimplemente a correção do zero, sem copiar gitlink, sem herdar labels,
   evidências ou aceites, e execute novamente os testes do escopo.
7. Faça a entrega pelo caminho obrigatório de merge ou PR em `dev`, depois
   `staging` e finalmente `master`. Em submódulos, mescle primeiro o módulo e
   depois o pai com o pin do commit já integrado.
8. Antes de cada promoção, confira o diff semântico, requisitos negativos,
   submódulos, CI e estado da task. Só depois permita a próxima transição.

## Critérios de segurança

- Um PR com `mergeable: false`, conflito ou CI incompleto não pode ser
  mesclado para contornar o bloqueio.
- A ausência de marcadores de conflito não prova que o resultado está correto;
  compare sempre `master`, merge-base, origem e o commit final.
- Force-push só pode ocorrer na branch descartável de task, após registro da
  evidência e com `--force-with-lease`; nunca em `master`, `dev` ou `staging`.
- `TESTADO:ALE` e quaisquer labels de validação não substituem revisão do
  resultado recriado e não podem ser herdadas automaticamente.
- Agents não movem tasks entre colunas. A passagem para `In Review` só ocorre
  no rito humano após staging e os quatro accepts; não é uma ação de recuperação
  de conflito.
