# Backlog e Fluxo Ágil — Mini-ERP

## Como vamos trabalhar

- **Formato:** Scrumban — sprints curtas (1 semana, já que é projeto solo de estudo)
  para dar cadência de entrega, mas o trabalho dentro da sprint é visualizado num
  quadro Kanban com limite de WIP (máx. 2 cards em "Em progresso" por vez, mesmo
  trabalhando sozinho — é o hábito que importa).
- **Board:** colunas `Backlog` → `Sprint Atual (To Do)` → `Em progresso (WIP≤2)` →
  `Em revisão (code review)` → `Concluído`.
- **Definition of Done** de uma história: código implementado, testado
  (unitário no mínimo), sem erros de type-check/lint, revisado (mesmo que a
  "revisão" seja você relendo o diff com espírito crítico antes do merge), e
  mergeado na branch principal.
- **Estimativa:** story points em escala Fibonacci curta (1, 2, 3, 5, 8) —
  medindo complexidade/incerteza, não tempo em horas.

## Épicos

1. **Autenticação e acesso** — login, JWT, controle admin/operador
2. **Cadastro de Fornecedores**
3. **Cadastro de Produtos**
4. **Pedidos de Compra** (fluxo draft → submitted → received)
5. **Estoque e Dashboard**
6. **Qualidade e infraestrutura** (testes, CI, documentação)

## Product Backlog (histórias de usuário)

Formato: `Como <papel>, quero <ação>, para <valor>` + critérios de aceite.

### Épico 1 — Autenticação
- **US-01** (3 pts) — Como usuário, quero fazer login com e-mail/senha para acessar o sistema.
  - AC: credenciais inválidas retornam 401 com mensagem clara; token JWT é salvo e enviado em requisições subsequentes.
- **US-02** (2 pts) — Como admin, quero que rotas de escrita exijam autenticação, para impedir acesso não autorizado.

### Épico 2 — Fornecedores
- **US-03** (3 pts) — ✅ Como operador, quero listar e cadastrar fornecedores, para manter a base atualizada. *(feito — commit `1f23f62`)*
- **US-04** (2 pts) — Como operador, quero editar dados de um fornecedor existente.
- **US-05** (1 pt) — Como admin, quero inativar um fornecedor (sem excluir), preservando histórico.

### Épico 3 — Produtos
- **US-06** (3 pts) — Como operador, quero cadastrar produtos com SKU, unidade e estoque mínimo.
- **US-07** (2 pts) — Como operador, quero listar produtos com filtro "abaixo do estoque mínimo".

### Épico 4 — Pedidos de Compra
- **US-08** (5 pts) — Como operador, quero criar um pedido de compra com múltiplos itens vinculado a um fornecedor.
- **US-09** (3 pts) — Como operador, quero submeter um pedido (draft → submitted).
- **US-10** (8 pts) — Como operador, quero registrar o recebimento (total ou parcial) de um pedido, gerando movimentações de estoque automaticamente.
  - AC: recebimento parcial mantém pedido em `partially_received`; recebimento completo dos itens restantes muda para `received`.
- **US-11** (2 pts) — Como admin, quero cancelar um pedido em draft ou submitted.

### Épico 5 — Estoque e Dashboard
- **US-12** (3 pts) — Como gestor, quero ver um dashboard com valor total em estoque, pedidos pendentes e produtos abaixo do mínimo.
- **US-13** (2 pts) — Como operador, quero consultar o histórico de movimentações (ledger) de um produto específico.

### Épico 6 — Qualidade/Infra
- **US-14** (3 pts) — Como dev, quero testes unitários cobrindo as regras de negócio críticas (cálculo de estoque, transições de status do pedido).
- **US-15** (2 pts) — Como dev, quero um pipeline de CI rodando lint + type-check + testes a cada PR.

## Sprint 1 (proposta)

Objetivo da sprint: **fechar o módulo de Fornecedores e iniciar Produtos, com autenticação básica funcionando.**

| História | Pontos | Status |
|---|---|---|
| US-03 Listar/cadastrar fornecedores | 3 | Concluído |
| US-04 Editar fornecedor | 2 | Backlog da sprint |
| US-05 Inativar fornecedor | 1 | Backlog da sprint |
| US-01 Login JWT | 3 | Backlog da sprint |
| US-06 Cadastrar produtos | 3 | Backlog da sprint |

Capacidade da sprint: ~12 pontos (ajustável conforme seu ritmo real de estudo).

## Kanban Board

Vou te ajudar a montar isso no GitHub Projects assim que o push para o remoto
estiver funcionando (dependemos da configuração SSH que ficou pendente). Por
enquanto, o board vive neste documento; colunas e WIP limit como descrito acima.

**Sprint 1 — estado atual:**

- **Backlog:** US-07, US-08, US-09, US-10, US-11, US-12, US-13, US-14, US-15
- **Sprint Atual (To Do):** US-04, US-05, US-01, US-06
- **Em progresso (WIP≤2):** _(vazio)_
- **Em revisão:** _(vazio)_
- **Concluído:** US-03
