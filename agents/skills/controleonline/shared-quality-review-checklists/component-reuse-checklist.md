# QA Component Reuse Checklist

Este subchecklist e obrigatorio em toda validacao de frontend antes de aplicar `agent:qa:accepted`.

## Regra de negocio

Componentes de UI recorrentes devem ser reaproveitados. Todo padrao reutilizavel deve ter um componente base correspondente no formato `Default<Componente>`.

## Itens obrigatorios

- [ ] Inputs comuns reutilizam ou criam `DefaultInput`.
- [ ] Selects comuns reutilizam ou criam `DefaultSelect`.
- [ ] Options comuns reutilizam ou criam `DefaultOption`.
- [ ] Buttons comuns reutilizam ou criam `DefaultButton`.
- [ ] Componentes, campos, controles e acoes repetidos nao foram implementados diretamente em telas quando ja existe componente padrao equivalente.
- [ ] Novos `Default<Componente>` seguem estrutura, props, tema, acessibilidade e estados ja usados no projeto.
- [ ] Variacoes visuais usam props ou composicao, sem duplicar implementacao por tela.
- [ ] Excecoes estao justificadas na issue com evidencia de que o componente e especifico demais para virar padrao reutilizavel.

## Criterio de aceite

O QA so pode aceitar a task de frontend quando os componentes reutilizaveis estiverem cobertos pelo respectivo `Default<Componente>` ou quando a excecao estiver documentada e comprovada na issue.
