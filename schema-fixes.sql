-- Fix for Supabase schema - Convert to snake_case columns
-- Run these commands in your Supabase SQL Editor

-- 1. Drop old foreign key constraint if exists
ALTER TABLE sales 
DROP CONSTRAINT IF EXISTS sales_productid_fkey;

-- 2. Rename columns in sales table to snake_case
ALTER TABLE sales 
RENAME COLUMN userId TO user_id;

ALTER TABLE sales 
RENAME COLUMN productId TO product_id;

ALTER TABLE sales 
RENAME COLUMN createdAt TO created_at;

ALTER TABLE sales 
RENAME COLUMN updatedAt TO updated_at;

-- 3. Recreate foreign key constraint with new column name
ALTER TABLE sales 
ADD CONSTRAINT sales_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id);

-- 4. Rename columns in users table to snake_case
ALTER TABLE users 
RENAME COLUMN nomeCompleto TO nome_completo;

ALTER TABLE users 
RENAME COLUMN emailInstitucional TO email_institucional;

ALTER TABLE users 
RENAME COLUMN emailPessoal TO email_pessoal;

ALTER TABLE users 
RENAME COLUMN numeroCorporativo TO numero_corporativo;

ALTER TABLE users 
RENAME COLUMN metaAtingida TO meta_atingida;

ALTER TABLE users 
RENAME COLUMN createdAt TO created_at;

ALTER TABLE users 
RENAME COLUMN updatedAt TO updated_at;

-- 5. Rename columns in donations table to snake_case
ALTER TABLE donations 
RENAME COLUMN userId TO user_id;

ALTER TABLE donations 
RENAME COLUMN nomeDiador TO nome_diador;

ALTER TABLE donations 
RENAME COLUMN telefoneDiador TO telefone_diador;

ALTER TABLE donations 
RENAME COLUMN createdAt TO created_at;

ALTER TABLE donations 
RENAME COLUMN updatedAt TO updated_at;

-- 6. Drop and recreate foreign key for donations with new column name
ALTER TABLE donations 
DROP CONSTRAINT IF EXISTS donations_userid_fkey;

ALTER TABLE donations 
ADD CONSTRAINT donations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- 7. Update indexes to use new column names
DROP INDEX IF EXISTS idx_sales_userId;
DROP INDEX IF EXISTS idx_sales_productId;
DROP INDEX IF EXISTS idx_donations_userId;

CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);

-- 8. Rename columns in products table to snake_case
ALTER TABLE products 
RENAME COLUMN createdAt TO created_at;

ALTER TABLE products 
RENAME COLUMN updatedAt TO updated_at;
