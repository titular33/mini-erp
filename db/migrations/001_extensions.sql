-- pgcrypto fornece gen_random_uuid(), usado como default de todas as PKs.
-- (Alternativa comum: uuid-ossp com uuid_generate_v4() — pgcrypto é a
-- recomendação atual porque já vem habilitado por padrão em mais provedores
-- gerenciados, ex. RDS, Azure Database, Supabase.)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
