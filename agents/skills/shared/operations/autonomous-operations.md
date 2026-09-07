# Autonomous Operations

## Overview

Use esta skill quando o agent precisar agir com autonomia operacional maxima em rotinas tecnicas, investigacoes, triagem, correcoes seguras e continuidade de execucao.

## Request Shapes

Use principalmente quando o pedido se parecer com:

- "verifique e corrija o problema"
- "rode a rotina operacional sem me perguntar nada"
- "investigue, aja no que for seguro e me traga o resultado"

## Workflow

1. trate o usuario como destinatario de resultado, nao como operador interativo do fluxo
2. nunca interrompa a execucao com perguntas, confirmacoes, preferencias ou escolhas quando for possivel continuar com seguranca
3. em caso de ambiguidade, escolha o caminho mais seguro, conservador e rastreavel
4. antes de reportar, investigue, execute verificacoes, faca as correcoes seguras cabiveis e registre o que foi feito
5. se a investigacao revelar problema corrigivel dentro do escopo atual, nao pare apenas no diagnostico: execute a correcao na mesma rodada
6. comentario isolado nao substitui acao corretiva quando ainda houver medida segura cabivel na etapa atual
7. se faltar dado para agir com seguranca, tente obter a resposta nas fontes de verdade disponiveis
8. se ainda assim houver divergência, aplique o rito de recriação da task ou reencaminhe para a etapa capaz de corrigir, sem deixar a fila parada

## Output Contract

Ao concluir, entregue um resumo curto com:

- o que foi verificado
- o que foi corrigido ou descartado
- o que ficou pendente
- qual correção ou reencaminhamento permitiu o avanço
## Quality Bar

## Política de execução contínua

O ecossistema é autogerenciável: nenhum agent pode encerrar uma rodada pedindo
que alguém destrave a execução ou deixar uma task
aguardando indefinidamente. Quando a etapa atual não puder avançar, o agent
deve, na mesma execução:

1. voltar à última etapa consistente;
2. corrigir a causa encontrada;
3. recriar a branch ou refazer a task do zero quando a base estiver contaminada;
4. reencaminhar a task para o agent/etapa responsável; e
5. continuar até publicar a próxima transição válida.

`Blocked` e `Backlog` são a única exceção: são colunas de segurança
exclusivamente humanas e nenhum agent, worker ou automação pode selecioná-las,
movê-las, limpá-las ou editar seus itens.

- nao transforme rotinas operacionais em entrevista com o usuario
- nao peca confirmacao para tarefas operacionais normais
- nao avance em acoes inseguras; corrija o fluxo e retome pela fronteira segura
- nao encerre a rodada so com analise quando ainda existir correcao segura cabivel
- sempre prefira continuidade segura, rastreabilidade e objetividade
