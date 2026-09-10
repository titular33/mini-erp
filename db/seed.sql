-- Dados de exemplo para desenvolvimento local — espelha os mocks usados no
-- front-end (frontend/src/mocks) para facilitar comparação ao trocar o MSW
-- pela API real.

INSERT INTO users (id, name, email, password_hash, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin', 'admin@erp.local',
     '$2b$10$replace-with-a-real-bcrypt-hash', 'admin');

INSERT INTO suppliers (id, name, tax_id, email, phone, status) VALUES
    ('30000000-0000-0000-0000-000000000001', 'Fornecedora Alfa Ltda', '12.345.678/0001-90', 'contato@alfa.com', '(11) 4000-1000', 'active'),
    ('30000000-0000-0000-0000-000000000002', 'Beta Suprimentos', '98.765.432/0001-10', 'vendas@betasuprimentos.com', '(21) 3000-2000', 'inactive');

INSERT INTO products (id, sku, name, unit, min_stock) VALUES
    ('90000000-0000-0000-0000-000000000001', 'PRD-001', 'Parafuso Sextavado M8', 'UN', 500),
    ('90000000-0000-0000-0000-000000000002', 'PRD-002', 'Tinta Acrílica Branca 18L', 'L', 20);

-- Movimentações iniciais, só para o estoque agregado (product_stock_position)
-- não nascer zerado — simula um saldo inicial de migração de sistema legado.
INSERT INTO inventory_movements (product_id, type, quantity, unit_cost, reason, reference_id) VALUES
    ('90000000-0000-0000-0000-000000000001', 'in', 1200, 0.35, 'manual_adjustment', NULL),
    ('90000000-0000-0000-0000-000000000002', 'in', 8, 145.90, 'manual_adjustment', NULL);
