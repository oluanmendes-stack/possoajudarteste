-- Adicionar constraints de foreign key que faltam

-- Primeiro, remover constraint se existir com qualquer nome
ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS sales_productid_fkey CASCADE;

ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS sales_product_id_fkey CASCADE;

ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS fk_sales_product CASCADE;

-- Agora adicionar a constraint correta
ALTER TABLE sales 
ADD CONSTRAINT sales_produto_id_fkey 
FOREIGN KEY (produto_id) REFERENCES products(id);

-- Fazer o mesmo para user_id em sales (se não existir)
ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS sales_userid_fkey CASCADE;

ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS sales_user_id_fkey CASCADE;

ALTER TABLE IF EXISTS sales 
DROP CONSTRAINT IF EXISTS fk_sales_user CASCADE;

ALTER TABLE sales 
ADD CONSTRAINT sales_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Fazer o mesmo para donations
ALTER TABLE IF EXISTS donations 
DROP CONSTRAINT IF EXISTS donations_userid_fkey CASCADE;

ALTER TABLE IF EXISTS donations 
DROP CONSTRAINT IF EXISTS donations_user_id_fkey CASCADE;

ALTER TABLE IF EXISTS donations 
DROP CONSTRAINT IF EXISTS fk_donations_user CASCADE;

ALTER TABLE donations 
ADD CONSTRAINT donations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Verificar constraints criadas
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name IN ('sales', 'donations', 'users');
