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

## Paperclip

Os endpoints, o ID da empresa, os caminhos do servidor e as referências de
credenciais usadas pelo CTO ficam em `paperclip`. Este bloco é versionado sem
valores secretos; tokens, senhas e chaves permanecem no runtime ou nas
referências autorizadas de credenciais.

## Limite operacional

`runners.defaults.DEVELOPER_WORKING_LIMIT` está definido como **5** e é um teto
absoluto para `Working`. Com cinco tasks, a seleção de novas tasks e qualquer
mutação que tente colocar uma sexta task em `Working` devem ser recusadas. A
única exceção é o P1 `DevOps` processar `Deploy`, sem aumentar `Working`.

O dispatcher lê o valor canônico a cada execução e falha fechado quando ele
está ausente ou inválido. Não use override de ambiente ou do projeto para
alterar esse limite sem mudar a configuração versionada.

## Fork checklist

1. Preencher `owner.value`, `project.*`, `github.product_repositories`
2. Preencher `documentation.*` se houver central de ajuda
3. Exportar env no CI ou carregar o JSON no entrypoint dos workers
4. Nao gravar `GITHUB_TOKEN` neste arquivo
