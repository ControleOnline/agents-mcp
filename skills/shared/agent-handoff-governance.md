# Agent Handoff Governance

## Overview

Use esta skill para padronizar tags, transicao de etapa, handoff tecnico e desvio operacional entre agents.

## Workflow

1. confirme a tag `agent:*` esperada para a etapa atual e, quando houver PR de Deploy, os checks
2. nunca atribua a task a pessoas, bots ou fallbacks tecnicos; assignee nao faz parte do fluxo
3. agentes nao fecham tasks; so humanos podem mover a issue para `closed`
4. se a task estiver em `Ready` ou `Working` sem `agent:*`, a entrada padrao e `Developer`
5. o fluxo tecnico padrao e sequencial: `Developer` implementa a mudanca e entrega para `Q.A.` via `agent:qa` mantendo a task em `Working`, `Q.A.` valida a entrega e registra `qa:accepted` ou `qa:rejected` por label, `Security` valida a entrega e registra `security:accepted` ou `security:rejected` por label, e quando as duas aprovacoes coexistem `DevOps` cria a release tecnica; depois disso, o humano aprova movendo a task para `Deploy`, `DevOps` publica a build em producao ate a finalizacao e, por fim, a task segue para `Documentation`
6. qualquer etapa pode abrir uma task paralela de infraestrutura com `agent:sysadmin`; essa task nunca substitui a tarefa-mãe e deve sempre referenciá-la
7. quando o `Sysadmin` concluir a task paralela, ele deve trocar essa task para `agent:security` e comentar na tarefa-mãe que o impedimento foi resolvido ou diagnosticado
8. cada agent so troca a tag da propria proxima etapa quando sua etapa estiver realmente concluida
9. `Developer` trabalha em `Working` depois da primeira captura; `Ready` e a fila de entrada inicial para `Developer`, enquanto `Quality Assurance` e `Security` dependem da label `agent:*` esperada para atuar; quando `qa:accepted` e `security:accepted` coexistirem sem novas solicitacoes nos comentarios, `DevOps` assume a task para preparar a release tecnica, o humano move a task para `Deploy`, `DevOps` publica a build em producao ate a finalizacao e a task segue para `Documentation`, onde `agent:tutorial-assistant` ou `agent:technical-documenter` inicia a trilha documental conforme o tipo de conteudo; agents documentais externos ao nucleo, como `Documentor`, trabalham em `Done`
10. nao faca handoff sem evidencia concreta do que foi validado, corrigido ou bloqueado

## Output Contract

Ao concluir, informe objetivamente:

- qual era a tag operacional atual
- qual foi a proxima tag definida pela sequencia real
- qual evidencia sustentou o handoff ou o bloqueio
- se houve devolucao para etapa anterior, por que isso foi necessario
- se existiu task paralela de `Sysadmin`, qual foi a tarefa-mãe referenciada

## Quality Bar

- nao retenha task na fila errada
- nao use assignee como atalho de ownership
- nao trate conflito de merge como detalhe secundario quando ele bloqueia o fluxo
- nao mova tarefa por aproximacao textual ou intuicao
- nao esconda pendencia operacional no momento do handoff
- nao capture task com tag fora da etapa esperada para o papel atual
- nao substitua a tarefa-mãe por uma task paralela de infraestrutura
