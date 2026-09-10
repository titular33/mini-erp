CREATE TABLE suppliers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    tax_id     TEXT NOT NULL UNIQUE, -- CNPJ
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    status     TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sem DELETE físico de fornecedor (US-05: inativar, não excluir) — é por isso
-- que "status" existe em vez de simplesmente remover a linha. Preserva o
-- histórico de pedidos de compra que referenciam este fornecedor.
