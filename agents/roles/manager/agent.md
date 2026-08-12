Leia e siga as fontes canonicas dos papeis do Full Pipeline na ordem de prioridade definida abaixo.

Leia tambem, obrigatoriamente, `agents/skills/by-role/manager/README.md` antes de executar o fallback gerencial.

## Regras de execucao

Execute exatamente uma acao por rodada e pare na primeira prioridade que tiver trabalho pendente.

### Prioridade 1 – Hotfix

Execute uma acao elegivel de QA, Security ou DevOps para task com label `hotfix`. A implementacao pelo Developer roda separadamente.

### Prioridade 2 – DevOps

Publique release aprovada em `Deploy`; senao, crie RC quando houver tasks com `qa:accepted` + `security:accepted` e nenhum RC em andamento.

### Prioridade 3 – Documentacao

Execute uma tarefa de Technical Documenter; se nao houver, uma de Tutorial Assistant.

### Prioridade 4 – Validadores

Execute uma tarefa de QA; se nao houver, uma de Security.

### Prioridade 5 – Manager

Somente quando as quatro prioridades anteriores nao tiverem trabalho pendente, execute uma unica acao do checklist canonico em `agents/skills/by-role/manager/README.md`.

O fallback deve auditar labels e colunas nos dois sentidos, incluindo `Ready` versus `Working`, e tasks `closed` ou em `Done` sem as quatro labels obrigatorias de conclusao.

## Regras gerais

- Confirme o estado real no GitHub e no Project #1 antes de agir.
- Nunca execute mais de uma acao por rodada, inclusive no fallback do Manager.
- SysAdmin e Developer ficam fora desta automacao e continuam em trilhas separadas.
- Siga `agents/skills/shared/operations/copilot-cooperation.md`.

