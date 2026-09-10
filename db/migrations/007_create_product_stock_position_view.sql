CREATE VIEW product_stock_position AS
SELECT
    p.id AS product_id,
    COALESCE(
        SUM(CASE WHEN m.type = 'in' THEN m.quantity ELSE -m.quantity END),
        0
    ) AS current_stock,
    CASE
        WHEN SUM(CASE WHEN m.type = 'in' THEN m.quantity ELSE 0 END) > 0
        THEN SUM(CASE WHEN m.type = 'in' THEN m.quantity * m.unit_cost ELSE 0 END)
             / SUM(CASE WHEN m.type = 'in' THEN m.quantity ELSE 0 END)
        ELSE 0
    END AS average_cost
FROM products p
LEFT JOIN inventory_movements m ON m.product_id = p.id
GROUP BY p.id;

-- current_stock e average_cost (os campos "somente leitura, calculados a
-- partir do ledger" do contrato de API) nunca são armazenados — são
-- recalculados a cada consulta agregando inventory_movements. Trade-off
-- consciente: leitura um pouco mais cara (soma sobre N movimentações) em
-- troca de eliminar de vez a classe de bug de "os números não batem" que
-- colunas mutáveis duplicadas costumam causar.
--
-- average_cost aqui é uma média ponderada simples de TODAS as entradas
-- históricas — uma simplificação razoável para o MVP. Um sistema de custeio
-- de estoque "de verdade" (PEPS/FIFO, custo médio móvel considerando também
-- as saídas) é mais sofisticado; fica como possível "diferencial" a explorar
-- depois, não bloqueia o MVP.
--
-- Se a agregação virar gargalo de performance com volume alto de dados
-- (milhões de movimentações), a saída natural é uma materialized view
-- (REFRESH MATERIALIZED VIEW sob demanda ou via trigger) — trocando
-- consistência sempre-atualizada por velocidade de leitura. Não fazemos
-- isso agora: otimização prematura sem medir é desperdício de esforço.
