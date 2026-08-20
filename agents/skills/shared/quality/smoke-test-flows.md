# Smoke Test Business Flows

Skill canônica do catálogo oficial de **fluxos de negócio** usados em smoke tests no ecossistema ControleOnline.

Fonte única de verdade para associação de smokes a fluxos. Alterações no catálogo só por solicitação humana explícita.

## Governança

- **Somente humanos** autorizam inclusão, remoção ou alteração de fluxos neste catálogo.
- Agents (Developer, QA, qualquer papel) **não inventam** novos fluxos.
- Ao criar ou alterar um smoke test, o agent **deve declarar** o fluxo associado (um dos listados abaixo ou `Outros`).
- Se o smoke não se encaixa em nenhum fluxo do catálogo, use o fluxo reservado **`Outros`**.
- Esta skill deve ser lida por Developer, QA e qualquer papel que escreva ou valide smoke.

## Catálogo oficial

Cada entrada: `id` estável, papel (ator), nome legível.

| id | papel | nome |
| --- | --- | --- |
| `leilao-importacao-manual` | super admin | Importação de leilão manual |
| `endereco-criacao` | embarcador | Criação de endereço |
| `leilao-abertura` | embarcador | Abertura de leilão |
| `leilao-antecipacao` | embarcador | Antecipação de leilão |
| `leilao-inclusao-transportador` | transportador | Inclusão em leilão |
| `oferta-voluntaria` | transportador | Oferta voluntária |
| `transportador-suspensao` | embarcador | Suspensão de transportador |
| `viagem-solicitacao-individual` | embarcador | Solicitação de viagem individual |
| `viagem-solicitacao-lote` | embarcador | Solicitação de viagem em lote |
| `viagem-aceite` | transportador | Aceite de viagem |
| `viagem-recusa` | transportador | Recusa de viagem |
| `motorista-cadastro` | transportador | Cadastro de motorista |
| `veiculo-cadastro` | transportador | Cadastro de veículos/placas |
| `motorista-placa-inclusao` | transportador | Inclusão de motorista/placas |
| `outros` | qualquer | Outros (fallback — smoke sem coerência com fluxos acima) |

## Regras de uso

1. Todo smoke novo ou alterado deve referenciar **exatamente um** `id` da tabela (preferir o mais específico).
2. Preferir o fluxo de negócio real exercitado pelo teste; usar `outros` só quando não houver correspondência razoável.
3. Em comentários de PR/issue, evidência de QA ou descrição do smoke, declarar: `fluxo: <id>`.
4. Não criar aliases ou sub-fluxos sem atualização humana desta skill.
5. Smokes de infraestrutura, login genérico, healthcheck ou UI pontual sem jornada de negócio → `outros`.

## Papéis (atores)

- **super admin**: operação de plataforma / importação / configuração global
- **embarcador**: dono da carga / criador de leilão e solicitação de viagem
- **transportador**: executor da viagem / oferta / motorista e frota
- **qualquer**: fallback `outros`

## Relação com code-quality

Smoke tests continuam obrigatórios conforme `quality/code-quality.md`. Esta skill **não** substitui a exigência de smoke; apenas padroniza a **classificação por fluxo de negócio**.

## Fora de escopo desta skill

- Implementação dos arquivos de teste (Playwright, etc.) nos repositórios de produto
- Runners, workflows de CI ou inventário de arquivos de teste
