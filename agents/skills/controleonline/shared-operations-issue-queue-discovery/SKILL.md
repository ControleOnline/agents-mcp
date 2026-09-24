# Issue Queue Discovery — desativada no fluxo atual

Esta skill historica nao faz parte do fluxo operacional ativo do Paperclip.
Nao deve ser usada para descobrir, selecionar, reabrir, rotular ou mover tasks.

O Manager e o unico coordenador da fila e segue
`agents/roles/manager/agent.md` e
`agents/skills/controleonline/by-role-manager-README/SKILL.md`. As unicas
subtasks de produto permitidas sao Developer, Security e DevOps, encadeadas
pela regra especifica do Manager. Developer, Security e DevOps so atuam em
subtasks explicitamente atribuidas pelo Manager.

Para regras sobre coluna GitHub `Blocked`, limite `Working`, tasks pai, RC,
`In Review` e `Deploy`, prevalecem as instrucoes do Manager e do fluxo GitHub
ativo. Este arquivo nao autoriza capturas nem mutacoes por qualquer outro
agente ou mecanismo de fila.
