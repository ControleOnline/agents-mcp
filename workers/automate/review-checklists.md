# Review Checklists

Estas listas sao o criterio de aprovacao que deve ser copiado para a task quando QA ou Security registrarem a decisao.

## QA

- limite de linhas e tamanho do componente estao coerentes com o escopo
- componentes, hooks, services e helpers existentes foram reaproveitados quando possivel
- smoke tests foram executados ou seus resultados existentes foram lidos e validados quando a interface foi afetada (nao reexecutar se ja houver evidencia valida e atual)
- a tela / fluxo afetado abre corretamente
- a acao principal da tarefa foi realizada com sucesso (comportamento observado, nao apenas codigo)
- nao ha erros/warnings relevantes no console do browser relacionados a entrega
- nao ha loops, re-renders desnecessarios ou chamadas duplicadas (API/requests) em cada tela/fluxo revisado
- quando a entrega afetar app Android (ou houver build/artefato disponivel), bugs obvios de runtime Android foram verificados ou explicitamente justificados como fora de alcance
- testes unitarios relevantes em PHP e JS foram adicionados ou atualizados
- helpers da pasta `ui-commun` foram usados quando aplicavel
- a issue e o `AGENTS.md` mais especifico do escopo foram consultados

## Security

- autorizacao e controle de acesso foram validados
- exposicao de dados e leituras indevidas foram revisadas
- IDOR, mass assignment e alteracao indevida de status foram considerados
- o `securityFilter` do service equivalente foi localizado e validado para proteger leitura e escrita quando aplicavel
- as regras sensiveis do dominio e o `AGENTS.md` do escopo foram conferidos
