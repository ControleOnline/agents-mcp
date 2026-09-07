# Contrato de entrega verificável

Este contrato vale para Manager, Developer, DevOps e validadores. Comentário,
diagnóstico, plano, handoff textual ou mudança local não são entrega.

## O que conta como mutação real

Toda rodada que declare `DONE` precisa produzir e comprovar uma mutação
compatível com a prioridade:

- **Código:** commit novo publicado em uma ref remota, merge da task no destino
  previsto e verificação do SHA remoto.
- **Validação:** decisão nova (`agent:<papel>:accepted` ou
  `agent:<papel>:rejected`), remoção da solicitação anterior e coluna coerente.
- **DevOps/board:** merge ou promoção da task individual e mudança confirmada
  de coluna/labels.
- **Governança (`agents-mcp`):** commit publicado no `agents-mcp`, issue
  associada ao Project #1 e estado/coluna atualizados. Esta é uma entrega
  direta: não aguarda QA, Security, Design, UX ou aprovação humana.

Um comentário só pode acompanhar a mutação. Nunca pode substituí-la.

## Fechamento obrigatório

Antes de emitir `DONE`, registre na issue a ação executada, SHA(s)/ref(s)
remotos ou IDs das labels/coluna, verificação pós-ação e próximo papel/coluna.
Se qualquer item faltar, o resultado não é `DONE`.

Para governança do próprio `agents-mcp`, o fechamento ocorre após a publicação
remota do commit e a atualização verificável da issue/board. Não se cria
handoff para validadores e não se mantém a issue em `Working` aguardando
aprovação.

## Bloqueio operacional

Quando uma dependência impedir a ação:

1. tente a correção objetiva disponível (permissão, conflito, credencial,
   checkout, runtime ou API);
2. repita a verificação somente depois da correção;
3. se a dependência continuar impedindo o avanço, registre `NEXT_ACTION` com
   responsável, tentativa, evidência e ação externa necessária; não crie,
   aplique ou solicite tag `agent:*:blocked` e não mova o item para `Blocked`.

`Blocked` não é fila normal e permanece sob controle humano; nenhum agent,
worker ou automação pode criar, mover ou editar esse estado.

## Anti-repetição

Uma nova rodada não pode selecionar a mesma issue quando o estado de entrada é
igual ao da última tentativa: mesmos SHAs, labels, coluna e evidência. Exige-se
um novo delta publicado ou uma mudança externa verificável. Sem isso, registre
`NEXT_ACTION`; não publique outro comentário, não repita o handoff e não
aplique tag ou estado de bloqueio.

O comentário de encerramento deve conter:
`DELIVERY_PROOF: action=<...> refs=<...> state=<...>`.
