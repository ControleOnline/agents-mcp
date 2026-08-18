# Configuracao do ecossistema (`agents-mcp`)

**Obrigatorio:** antes de executar qualquer papel, leia `config/ecosystem.config.json` e use os campos `value` / `runners.defaults` para resolver placeholders.

A documentacao em `agents/` pode usar placeholders genericos. Os valores reais do fork ficam neste diretorio (sem tokens).

## Arquivos

| Arquivo | Uso |
|---------|-----|
| `ecosystem.config.json` | Valores do fork (versionado; **sem** secrets) |
| `ecosystem.config.example.json` | Modelo de referencia |
| `ecosystem.config.schema.json` | Schema JSON |

## Placeholders

| Placeholder | Campo / env |
|-------------|-------------|
| `<OWNER>` / `<env.OWNER>` | `owner.value` → `OWNER`, `PROJECT_ORG`, … |
| `<OWNER>/agents-mcp` | `github.core_repository.value` → `AGENTS_MCP_REPOSITORY` |
| `<PROJECT_URL>` | `project.url.value` → `PROJECT_URL` |
| `<PROJECT_NUMBER>` | `project.number.value` → `PROJECT_NUMBER` |
| `<HELP_CENTER_URL>` | `documentation.help_center_url.value` |
| `<HELP_CENTER_HOST>` | `documentation.help_center_host.value` |
| `<TEAM_EMAIL>` | `documentation.team_email.value` |

## Fork checklist

1. Preencher `owner.value`, `project.*`, `github.product_repositories`
2. Preencher `documentation.*` se houver central de ajuda
3. Exportar env no CI ou carregar o JSON no entrypoint dos workers
4. Nao gravar `GITHUB_TOKEN` neste arquivo
