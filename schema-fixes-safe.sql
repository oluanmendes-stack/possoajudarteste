-- Safe script to fix Supabase schema
-- This script checks if columns exist before renaming
-- Run these commands one by one in Supabase SQL Editor

-- First, let's see what columns currently exist in sales table
-- (Run this query first to see the current structure)
SELECT column_name, data_type FROM information_schema.columns WHERE table_name='sales' ORDER BY ordinal_position;

-- If you see the columns are already in snake_case (user_id, product_id, etc.), skip to the end
-- If columns are in camelCase, run the commands below:

-- ===== IF COLUMNS ARE IN CAMELCASE - RUN THESE =====

-- Drop the foreign key constraint first
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_productid_fkey;

-- Rename sales columns from camelCase to snake_case
ALTER TABLE IF EXISTS sales 
  RENAME COLUMN "userId" TO user_id;

ALTER TABLE IF EXISTS sales 
  RENAME COLUMN "productId" TO product_id;

ALTER TABLE IF EXISTS sales 
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE IF EXISTS sales 
  RENAME COLUMN "updatedAt" TO updated_at;

-- Recreate foreign key
ALTER TABLE sales 
  ADD CONSTRAINT sales_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id);

-- Rename users columns
ALTER TABLE IF EXISTS users 
  RENAME COLUMN "nomeCompleto" TO nome_completo;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "emailInstitucional" TO email_institucional;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "emailPessoal" TO email_pessoal;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "numeroCorporativo" TO numero_corporativo;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "metaAtingida" TO meta_atingida;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE IF EXISTS users 
  RENAME COLUMN "updatedAt" TO updated_at;

-- Rename donations columns
ALTER TABLE IF EXISTS donations 
  DROP CONSTRAINT IF EXISTS donations_userid_fkey;

ALTER TABLE IF EXISTS donations 
  RENAME COLUMN "userId" TO user_id;

ALTER TABLE IF EXISTS donations 
  RENAME COLUMN "nomeDiador" TO nome_diador;

ALTER TABLE IF EXISTS donations 
  RENAME COLUMN "telefoneDiador" TO telefone_diador;

ALTER TABLE IF EXISTS donations 
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE IF EXISTS donations 
  RENAME COLUMN "updatedAt" TO updated_at;

-- Recreate foreign key for donations
ALTER TABLE donations 
  ADD CONSTRAINT donations_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id);

-- Rename products columns
ALTER TABLE IF EXISTS products 
  RENAME COLUMN "createdAt" TO created_at;

ALTER TABLE IF EXISTS products 
  RENAME COLUMN "updatedAt" TO updated_at;

-- Drop old indexes
DROP INDEX IF EXISTS idx_sales_userId;
DROP INDEX IF EXISTS idx_sales_productId;
DROP INDEX IF EXISTS idx_donations_userId;

-- Create new indexes with snake_case names
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);

-- Verify the changes
SELECT column_name, data_type FROM information_schema.columns WHERE table_name='sales' ORDER BY ordinal_position;
