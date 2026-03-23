-- Execute cada comando abaixo um por um no Supabase SQL Editor

-- 1. Adicionar constraint na tabela sales para produto_id
ALTER TABLE sales 
ADD CONSTRAINT sales_produto_id_fkey 
FOREIGN KEY (produto_id) REFERENCES products(id);

-- 2. Adicionar constraint na tabela sales para user_id
ALTER TABLE sales 
ADD CONSTRAINT sales_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- 3. Adicionar constraint na tabela donations para user_id
ALTER TABLE donations 
ADD CONSTRAINT donations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- 4. Pronto! Verificar se funcionou:
SELECT constraint_name, table_name 
FROM information_schema.table_constraints 
WHERE table_name IN ('sales', 'donations');
