# Documentation Governance Skill

## Objetivo

Padronizar o fluxo de documentacao do `ControleOnline` para duas trilhas complementares:

- `Tutorial Assistant`: documentacao publica orientada ao cliente final
- `Technical Documenter`: wiki tecnica e de negocio por projeto

## Regra central

Uma tarefa de documentacao so pode ser concluida quando as duas validacoes documentais exigidas pela trilha tiverem acontecido e nao houver nova solicitacao pendente nos comentarios.

Ordem nao importa:

- `Tutorial Assistant` pode aprovar primeiro
- `Technical Documenter` pode aprovar primeiro

Quando as duas tags de aprovacao estiverem presentes, a tarefa pode seguir para `Done`.

## Tutorial Assistant

Use esta trilha quando a entrega precisar virar ajuda pratica para cliente final.

Regras principais:

- ensine uma acao real do usuario
- use prints sanitizados ou artefatos visuais gerados em smoke test
- se a pagina ou secao da wiki ja existir, atualize o conteudo relevante em vez de criar duplicata
- se o smoke test nao trouxer a imagem ou o contexto necessario, devolva a tarefa para `Working` e deixe claro no comentario o que faltou
- jamais publique material com dados reais, segredos ou referencias internas
- se a tarefa nao tiver acao ensinavel, nao force pagina publica

## Technical Documenter

Use esta trilha quando a entrega precisar virar wiki tecnica ou de negocio do projeto.

Regras principais:

- documente regras de negocio, modularizacao, contratos, diagramas e informacoes tecnicas do projeto
- publique a wiki do projeto correspondente
- se a pagina ou secao da wiki ja existir, atualize apenas o que for relevante em vez de duplicar conteudo
- inclua diagramas renderizados de forma visivel dentro do GitHub Wiki sempre que a pagina pedir suporte visual
- quando existir diagrama oficial do ADMIN, use-o como fonte para copiar ou espelhar a representacao no wiki do projeto
- mantenha a documentacao tecnica segura e sem vazamento de segredo, dado real ou informacao privada

## Aprovação

- `Tutorial Assistant` usa `tutorial-assistant:accepted` e `tutorial-assistant:rejected`
- `Technical Documenter` usa `technical-documenter:accepted` e `technical-documenter:rejected`
- a primeira validacao documental gera a tag do primeiro agente
- a segunda validacao documental gera a tag do segundo agente
- quando `tutorial-assistant:accepted` e `technical-documenter:accepted` existirem sem novas solicitacoes nos comentarios, a tarefa vai para `Done`
- se faltar imagem, print ou diagrama, devolva para a etapa que ainda consegue completar a documentacao

## Segurança

Toda publicacao documental tambem deve obedecer `skills/shared/security-guardrails.md`.
