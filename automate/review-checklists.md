# Review Checklists

Estas listas sao o criterio de aprovacao que deve ser copiado para a task quando QA ou Security registrarem a decisao.

## QA

- limite de linhas e tamanho do componente estao coerentes com o escopo
- componentes, hooks, services e helpers existentes foram reaproveitados quando possivel
- smoke tests foram executados ou atualizados quando a interface foi afetada
- testes unitarios relevantes em PHP e JS foram adicionados ou atualizados
- helpers da pasta `ui-commun` foram usados quando aplicavel
- a issue e o `AGENTS.md` mais especifico do escopo foram consultados

## Security

- autorizacao e controle de acesso foram validados
- exposicao de dados e leituras indevidas foram revisadas
- IDOR, mass assignment e alteracao indevida de status foram considerados
- o `securityFilter` do service equivalente protege leitura e escrita quando aplicavel
- as regras sensiveis do dominio e o `AGENTS.md` do escopo foram conferidos
