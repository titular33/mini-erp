-- Índices em foreign keys: o Postgres NÃO cria índice automático em colunas
-- FK (diferente da PK, que sempre ganha índice único). Sem isso, um JOIN ou
-- filtro por supplier_id/product_id faria table scan.
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_order_items_purchase_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product_id ON purchase_order_items(product_id);

-- Suporta GET /purchase-orders?status= e a listagem "pedidos pendentes" do dashboard.
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- Suporta GET /suppliers?status= (US-05: fornecedores ativos no formulário de pedido).
CREATE INDEX idx_suppliers_status ON suppliers(status);

-- Busca textual simples por nome/SKU de produto (GET /products?search=).
-- Um índice B-tree comum não acelera ILIKE '%termo%' (padrão sem prefixo
-- fixo) — isso exigiria pg_trgm (índice GIN trigram). Deixamos como nota
-- para quando o volume de produtos justificar a complexidade extra; por
-- ora, um índice normal já ajuda buscas por prefixo (LIKE 'termo%').
CREATE INDEX idx_products_name ON products(name);
-- products.sku já tem índice único implícito via a constraint UNIQUE (migration 004) —
-- criar outro índice na mesma coluna seria redundante.
