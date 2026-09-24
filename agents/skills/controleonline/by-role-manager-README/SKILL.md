## Distincao obrigatoria: GitHub Blocked e Paperclip blocked

Proibicao de tags de bloqueio: agents nao criam nem aplicam labels `agent:*:blocked`
no GitHub. Isso nao impede a recuperacao prioritaria de
issues Paperclip com status `blocked`.

- `Blocked` no GitHub Project #1 e `Backlog` sao estados de board sob controle
  humano. Agents/workers nao comentam, validam, rotulam, editam nem movem itens
  dessas colunas.
- `blocked` no Paperclip (`issue.status=blocked` / `/CON/inbox/blocked`) e a fila
  de recuperacao e prioridade maxima do Manager. Investigue a causa, retome ou
  corrija a execucao/task Paperclip e confirme por readback antes de capturar
  nova task.
- Se uma task Paperclip blocked apontar para uma issue GitHub em `Blocked`, a
  recuperacao limita-se ao estado Paperclip que possa ser corrigido sem mutar a
  issue/board GitHub; o trabalho GitHub aguarda acao humana.
- Nao crie/aplique/remova/solicite labels GitHub `agent:*:blocked` nem mova
  itens GitHub para `Blocked`. Essa vedacao nao se aplica ao status Paperclip.

# Manager Skills

## Papel

O Manager coordena uma task pai por issue GitHub e somente as etapas ativas
Developer → Security → Manager → DevOps. Esses sao os unicos papeis de execucao
de produto habilitados no Paperclip. A task pai usa `blocked by` para ativar
uma etapa de cada vez. Developer implementa e testa localmente; Security
valida; Manager revalida; DevOps cria a RC congelada e so entao move a task para
`In Review`. Somente Manager altera labels/status/colunas no board; os demais
agentes registram evidencias nas proprias subtasks.

Ordem de execucao:

1. Recupere tasks existentes bloqueadas no Paperclip; nao abra nova task pai.
2. DevOps publica RC ja em `Deploy`; caso contrario, compoe RC apenas com tasks revalidadas pelo Manager.
3. Continue a task ativa pelo fluxo Developer → Security → Manager → DevOps.
4. Sem task ativa, o Manager pode selecionar exatamente uma issue em `Ready`, movê-la para `Working` se houver capacidade abaixo de cinco e criar sua task pai com Developer como primeira subtask.

Toda rodada retoma a primeira etapa elegivel da task ativa. Apenas o Manager
descobre/captura issues e cria tasks pai. Developer executa somente a issue
atribuida; ela precisa estar em `Working` antes da primeira passagem e
permanecer nela durante a entrega.

Na primeira passagem, o Developer deve ler e registrar o checklist local de
`workers/automate/review-checklists.md` antes de alterar o alvo. Cada correção
ou retomada deve atualizar a branch com o `master` remoto atual. Impedimentos
de checklist ou de sincronização devem voltar ao Manager com evidência.

Toda rodada segue `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`:
comentário ou handoff sem mutação verificável não encerra trabalho. Sem delta
novo, labels/coluna novas ou mudança externa comprovada, a mesma issue deve ser
registrada com `NEXT_ACTION` e responsavel pela proxima acao; nunca repetida e
nunca convertida em tag ou estado de bloqueio.

Governança publicada no próprio `agents-mcp` segue o contrato direto de
entrega; nao crie etapas de validacao adicionais para esse repositorio.

Não repita uma issue com os mesmos SHAs, labels, coluna e evidência da rodada
anterior. Sem delta novo, o resultado é `NEXT_ACTION`.

O Manager e responsavel pela recuperacao global de tasks Paperclip bloqueadas;
rotinas nao dependem de novo push. Tasks rejeitadas por Security retornam ao
Developer antes de nova captura. A capacidade global de `Working` e **5 tasks**;
ao atingir cinco, nenhuma nova task entra ate uma task ativa sair da coluna.
DevOps continua publicando tasks autorizadas em `Deploy`.

## Gate de staging

`agent:security:accepted` + revalidacao do Manager com testes locais e evidencia
da entrega em `dev`. Apos a revalidacao, DevOps cria/congela a RC e publica em
staging; somente as tasks inventariadas entram em `In Review`. Depois da
aprovacao humana e movimentacao para `Deploy`, DevOps promove a mesma RC para
master. Nao crie subtasks adicionais fora da sequencia ativa.

## Output Contract

Prioridade tentada, acao executada, `DELIVERY_PROOF`, `DONE` ou `NEXT_ACTION`.
Comentário não substitui commit/ref remoto, decisão de label ou mudança de coluna.
Issues closed e itens Done exigem RC publicada e Security aceito. Uma task
publicada em `master` sem Security/evidencia local permanece aberta e volta
para `Working` para uma segunda rodada de validacao.

## Fontes principais

- `agents/roles/manager/agent.md`
- `agents/roles/devops/agent.md`
- `agents/skills/controleonline/shared-github-github-flow/SKILL.md`
- `agents/skills/controleonline/shared-operations-delivery-proof-contract/SKILL.md`
