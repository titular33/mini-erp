CREATE TABLE products (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku        TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    unit       TEXT NOT NULL CHECK (unit IN ('UN', 'KG', 'CX', 'L')),
    min_stock  NUMERIC(14, 3) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Note a ausência deliberada de "current_stock" e "average_cost" aqui.
-- No mock (frontend/src/mocks), esses campos existiam como colunas mutáveis
-- só por simplicidade de protótipo. No schema real, isso seria dado
-- duplicado e mutável derivável de outra fonte de verdade (inventory_movements)
-- — a receita clássica para inconsistência ("os números não batem"). Em vez
-- disso, current_stock/average_cost são calculados por uma VIEW (ver
-- migration 007) que agrega o ledger de movimentações sob demanda.
