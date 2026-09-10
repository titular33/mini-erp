CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'operator')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- password_hash guarda o hash (ex. bcrypt/argon2), nunca a senha em texto puro.
-- Isso é responsabilidade do back-end (.NET/Node) no momento do cadastro/login,
-- não do banco — o schema só garante que a coluna existe e é obrigatória.
