CREATE TABLE inventory_movements (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id),
    type          TEXT NOT NULL CHECK (type IN ('in', 'out')),
    quantity      NUMERIC(14, 3) NOT NULL CHECK (quantity > 0),
    unit_cost     NUMERIC(14, 4) NOT NULL CHECK (unit_cost >= 0),
    reason        TEXT NOT NULL CHECK (reason IN ('purchase_receipt', 'manual_adjustment')),
    reference_id  UUID, -- ex.: purchase_orders.id quando reason = 'purchase_receipt'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_reference_id ON inventory_movements(reference_id);

-- Esta tabela é o ledger: append-only por convenção de aplicação (a API nunca
-- executa UPDATE/DELETE aqui, só INSERT). Em um ambiente com controle de
-- acesso mais rígido, isso pode virar regra de banco de verdade revogando os
-- privilégios de UPDATE/DELETE do usuário de aplicação nesta tabela:
--
--   REVOKE UPDATE, DELETE ON inventory_movements FROM app_user;
--
-- Não fazemos isso agora para não travar migrations de correção de dados em
-- ambiente de desenvolvimento, mas é a prática correta em produção para um
-- ledger de auditoria (o mesmo princípio usado em livros contábeis: você
-- lança um estorno, nunca apaga o lançamento original).
