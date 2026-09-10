CREATE TABLE purchase_orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status      TEXT NOT NULL CHECK (
                    status IN ('draft', 'submitted', 'received', 'partially_received', 'cancelled')
                ) DEFAULT 'draft',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchase_order_items (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id  UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id         UUID NOT NULL REFERENCES products(id),
    quantity_ordered   NUMERIC(14, 3) NOT NULL CHECK (quantity_ordered > 0),
    quantity_received  NUMERIC(14, 3) NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
    unit_price         NUMERIC(14, 4) NOT NULL CHECK (unit_price > 0),

    CONSTRAINT quantity_received_not_over_ordered CHECK (quantity_received <= quantity_ordered)
);

-- quantity_received_not_over_ordered é um invariante permanente do dado —
-- nenhuma linha pode existir violando essa regra, nem por bug da aplicação
-- nem por um UPDATE manual futuro. MAS atenção: esse CHECK sozinho NÃO
-- resolve a condição de corrida de dois recebimentos concorrentes no mesmo
-- item. Se duas transações leem quantity_received=0 (quantity_ordered=10) e
-- cada uma tenta somar +8, as DUAS satisfazem o CHECK individualmente
-- (8 <= 10) e uma sobrescreve a outra silenciosamente — a soma real recebida
-- (16) nunca aparece em lugar nenhum. A correção de verdade é fazer o UPDATE
-- ser atômico na cláusula WHERE, não em duas etapas de "ler, calcular, gravar":
--
--   UPDATE purchase_order_items
--   SET quantity_received = quantity_received + :incoming
--   WHERE id = :id AND quantity_received + :incoming <= quantity_ordered;
--
-- Se 0 linhas forem afetadas, a API responde 409/422 (excedeu o restante).
-- O CHECK constraint continua valioso como invariante de defesa em
-- profundidade — só não substitui esse padrão de UPDATE atômico.
