# Checklist — Design Review

Usar nos prints de smoke. Cada item: `ok` / `fail` / `n/a` + evidencia (arquivo do print ou etapa).

Fontes de referencia (nao copiar produto de terceiros; so criterio):
- consistencia de UI (paleta, hierarquia, espaco, icones, tipo)
- tokens de design system / tema do produto
- contraste WCAG AA 4.5:1 como barra minima de texto

## 1. Paleta e tema

- [ ] Cores primarias, secundarias, fundo e superficie vêm do tema/tokens do produto (sem cor solta)
- [ ] Success / warning / error usados com o mesmo significado em todas as telas do fluxo
- [ ] Contraste de texto sobre fundo suficiente para leitura do cliente
- [ ] Cor nao e o unico sinal (acompanha icone ou texto)

## 2. Hierarquia visual

- [ ] Um foco primario por tela (titulo + acao principal)
- [ ] Titulos, rotulos e corpo seguem a escala tipografica do produto (nao misturar pesos/tamanhos aleatorios)
- [ ] Acao primaria visualmente mais forte que secundaria/terciaria
- [ ] Elementos alinhados; sem deslocamento acidental

## 3. Espacamento e densidade

- [ ] Padding/gap consistentes (grade 4/8 do produto)
- [ ] Tela nao esta abarrotada; ha respiro entre grupos
- [ ] Cards/listas nao colapsam visualmente uns nos outros

## 4. Icones e componentes

- [ ] Icones da mesma familia/peso/tamanho no fluxo
- [ ] Icone sozinho tem tooltip ou rotulo se o significado nao for obvio
- [ ] Botoes, inputs e tabelas reutilizam componentes padrao (sem one-off injustificado)
- [ ] Estados visiveis: default, disabled, loading, erro de campo

## 5. Clareza para o cliente (anti-mural)

- [ ] Nao ha blocos longos de explicacao no corpo da tela
- [ ] Duvida pontual usa controle de ajuda **"?"** (ou equivalente) — texto curto no ponto de uso
- [ ] Labels de campo sao curtos e no idioma do cliente
- [ ] Prints nitidos; layout nao cortado / nao esticado

## 6. Consistencia entre telas do smoke

- [ ] Header, footer e navegacao estaveis no fluxo
- [ ] Mesmo tipo de acao usa o mesmo controle nas telas seguintes

## Decisao

Qualquer `fail` em tela de produto → `agent:design:rejected`.
Todos `ok` ou `n/a` justificados → `agent:design:accepted`.
