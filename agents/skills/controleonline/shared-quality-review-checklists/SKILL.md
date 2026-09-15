# Review Checklists

Estas listas sao o criterio de aprovacao que deve ser copiado para a task quando QA ou Security registrarem a decisao.

## QA

- base da implementação confirmada em `master` remoto atualizado; em cada
  correção/retomada, a nova rodada foi sincronizada novamente com `master`
- limite de linhas e tamanho do componente estao coerentes com o escopo
- componentes, hooks, services e helpers existentes foram reaproveitados quando possivel
- subchecklist de reaproveitamento de componentes em `agents/skills/controleonline/shared-quality-review-checklists/component-reuse-checklist.md` foi executado quando a entrega afetar frontend
- testes automatizados adequados ao risco foram executados e os resultados correspondem à entrega revisada; sem evidência de execução, recusar e devolver ao Developer
- testes unitarios relevantes em PHP e JS foram adicionados ou atualizados
- helpers da pasta `ui-commun` foram usados quando aplicavel
- a issue e o `AGENTS.md` mais especifico do escopo foram consultados

## Gate de primeira passagem do Developer

O Developer deve ler este checklist no início da primeira passagem, registrar
os itens aplicáveis na issue e manter a lista como critério de entrega. A
primeira passagem não pode ser encerrada sem evidência dos testes e critérios
QA aplicáveis, ou sem encaminhar o impedimento objetivo ao Manager.

## Security

- autorizacao e controle de acesso foram validados
- exposicao de dados e leituras indevidas foram revisadas
- IDOR, mass assignment e alteracao indevida de status foram considerados
- o `securityFilter` do service equivalente foi localizado e validado para proteger leitura e escrita quando aplicavel
- as regras sensiveis do dominio e o `AGENTS.md` do escopo foram conferidos
