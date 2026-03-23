-- PASSO 1: Verificar colunas existentes na tabela sales
-- Execute isso primeiro para ver quais colunas você tem
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'sales' 
ORDER BY ordinal_position;

-- Se vir colunas como: user_id, product_id, created_at, updated_at (snake_case)
-- então pule para o FINAL

-- Se vir colunas como: userId, productId, createdAt, updatedAt (camelCase)
-- então execute os comandos abaixo:

-- ================================================
-- PASSO 2: Executar se as colunas forem camelCase
-- ================================================

-- REMOVER CONSTRAINTS ANTES DE RENOMEAR
ALTER TABLE sales DROP CONSTRAINT IF EXISTS "sales_productid_fkey" CASCADE;
ALTER TABLE donations DROP CONSTRAINT IF EXISTS "donations_userid_fkey" CASCADE;

-- RENOMEAR COLUNAS DA TABELA SALES
ALTER TABLE sales RENAME COLUMN "userId" TO user_id;
ALTER TABLE sales RENAME COLUMN "productId" TO product_id;
ALTER TABLE sales RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE sales RENAME COLUMN "updatedAt" TO updated_at;

-- RENOMEAR COLUNAS DA TABELA USERS
ALTER TABLE users RENAME COLUMN "nomeCompleto" TO nome_completo;
ALTER TABLE users RENAME COLUMN "emailInstitucional" TO email_institucional;
ALTER TABLE users RENAME COLUMN "emailPessoal" TO email_pessoal;
ALTER TABLE users RENAME COLUMN "numeroCorporativo" TO numero_corporativo;
ALTER TABLE users RENAME COLUMN "metaAtingida" TO meta_atingida;
ALTER TABLE users RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE users RENAME COLUMN "updatedAt" TO updated_at;

-- RENOMEAR COLUNAS DA TABELA DONATIONS
ALTER TABLE donations RENAME COLUMN "userId" TO user_id;
ALTER TABLE donations RENAME COLUMN "nomeDiador" TO nome_diador;
ALTER TABLE donations RENAME COLUMN "telefoneDiador" TO telefone_diador;
ALTER TABLE donations RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE donations RENAME COLUMN "updatedAt" TO updated_at;

-- RENOMEAR COLUNAS DA TABELA PRODUCTS
ALTER TABLE products RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE products RENAME COLUMN "updatedAt" TO updated_at;

-- ================================================
-- PASSO 3: RECRIAR CONSTRAINTS (FOREIGN KEYS)
-- ================================================

-- Adicionar constraint para sales -> products
ALTER TABLE sales ADD CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);

-- Adicionar constraint para donations -> users
ALTER TABLE donations ADD CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- Adicionar constraint para sales -> users
ALTER TABLE sales ADD CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- ================================================
-- PASSO 4: RECRIAR ÍNDICES
-- ================================================

DROP INDEX IF EXISTS idx_sales_userId CASCADE;
DROP INDEX IF EXISTS idx_sales_productId CASCADE;
DROP INDEX IF EXISTS idx_donations_userId CASCADE;

CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_users_matricula ON users(matricula);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_sales_data ON sales(data);
CREATE INDEX idx_donations_data ON donations(data);

-- ================================================
-- VERIFICAR O RESULTADO
-- ================================================
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'sales' 
ORDER BY ordinal_position;
