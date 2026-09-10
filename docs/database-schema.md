# Modelagem do banco de dados (PostgreSQL)

## Diagrama conceitual (relacionamentos)

```
suppliers 1───* purchase_orders 1───* purchase_order_items *───1 products
                                                                    │
                                                                    │ 1
                                                                    │
                                                                    *
                                                          inventory_movements

users (independente — só autenticação/autorização)
```

## Migrations

Numeradas e aplicadas em ordem (`db/migrations/001_*.sql` a `008_*.sql`).
Cada arquivo é uma migration "forward-only" (sem `down` nesta fase inicial —
adicionamos migrations de rollback quando plugarmos uma ferramenta de
migration real no back-end, ex. EF Core Migrations no .NET ou
node-pg-migrate/Prisma Migrate no Node).

| Arquivo | Conteúdo |
|---|---|
| 001_extensions.sql | `pgcrypto` para `gen_random_uuid()` |
| 002_create_users.sql | Autenticação |
| 003_create_suppliers.sql | Fornecedores (com `status`, sem delete físico) |
| 004_create_products.sql | Produtos (sem estoque/custo — ver abaixo) |
| 005_create_purchase_orders.sql | Pedido + itens, com a máquina de estados do `status` |
| 006_create_inventory_movements.sql | O ledger de estoque |
| 007_create_product_stock_position_view.sql | View que deriva estoque/custo do ledger |
| 008_indexes.sql | Índices de suporte às queries do contrato de API |

## Decisões de modelagem e por quê

### 1. Estoque como ledger, nunca como coluna mutável

Esta é a decisão mais importante do schema, e vem direto da discussão que
tivemos ao planejar o mock: se `products.current_stock` fosse uma coluna
comum, dois recebimentos de pedido concorrentes no mesmo produto sofreriam
*lost update* (ambos leem o valor antigo, um dos incrementos se perde). Em
vez disso, `inventory_movements` é **append-only** (só `INSERT`, nunca
`UPDATE`/`DELETE`), e `current_stock`/`average_cost` são **derivados** por
agregação numa `VIEW` (`product_stock_position`), nunca armazenados. Isso é
literalmente o princípio do *event sourcing*: guardar os eventos, derivar o
estado.

### 2. `CHECK` constraints como invariantes, não como solução de concorrência

`purchase_order_items` tem `CHECK (quantity_received <= quantity_ordered)`.
Isso garante que **nenhuma linha nunca existirá** violando essa regra — mas,
como o comentário na migration 005 detalha, isso sozinho **não** resolve a
condição de corrida de dois recebimentos simultâneos incrementando o mesmo
item (cada um pode individualmente satisfazer o CHECK e ainda assim juntos
ultrapassarem o limite, com um sobrescrevendo o outro). A solução real é um
`UPDATE ... SET quantity_received = quantity_received + :x WHERE ... AND
quantity_received + :x <= quantity_ordered` — atômico na cláusula `WHERE`,
não em "ler, calcular na aplicação, gravar". O `CHECK` continua valioso como
defesa em profundidade (pega bugs de aplicação, edições manuais futuras).

### 3. Sem DELETE físico em fornecedores

`suppliers.status` existe para permitir inativar sem apagar — um fornecedor
referenciado por pedidos de compra antigos não pode simplesmente sumir sem
quebrar o histórico (e a Foreign Key nem deixaria, sem `ON DELETE CASCADE`,
que aqui seria o comportamento errado).

### 4. UUID em vez de `SERIAL`/`BIGSERIAL`

IDs sequenciais expõem contagem de registros (ex.: "pedido #4" revela que só
existem 4 pedidos) e dificultam merge de dados entre ambientes (dev/staging)
ou uma futura extração para microsserviço, onde IDs gerados por serviços
diferentes não podem colidir. UUID resolve os dois problemas ao custo de um
índice um pouco maior (16 bytes vs 4/8) — trade-off aceitável neste porte de
sistema.

## Próximo passo

Quando plugarmos o back-end real (.NET ou Node), essas migrations viram a
fonte da verdade do schema — a ferramenta de migration de cada stack (EF Core
Migrations / node-pg-migrate) vai gerenciar a aplicação incremental delas,
não vamos rodar esses `.sql` manualmente em produção.
