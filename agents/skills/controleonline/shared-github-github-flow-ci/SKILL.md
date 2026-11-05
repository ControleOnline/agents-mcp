# GitHub Flow — CI

Este arquivo e apenas um complemento historico de CI. Ele **nao substitui** o
rito de Release Candidate definido em `shared-github-github-flow/SKILL.md` e
`shared-github-release-candidate/SKILL.md`.

## Regra atual

- `dev` recebe merges por task a partir de `task-{id}`.
- `staging` recebe somente RC congelada `rc/X.Y.Z-rc.N`.
- `master` recebe somente a mesma RC homologada em `Deploy`.
- `Security` e o gate ativo antes da revalidacao do Manager.
- `Design` e `UX` estao suspensos e nao bloqueiam RC. QA esta ativo: RC exige `agent:qa:accepted` + `agent:security:accepted`.
- Hotfix tambem precisa de RC congelada antes de master.
