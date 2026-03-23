-- ============================================================================
-- SOLUÇÃO COMPLETA PARA: "insert or update on table sales violates foreign key constraint"
-- ============================================================================

-- PASSO 1: Ver estrutura atual da tabela sales
-- Execute isso primeiro para confirmar os nomes das colunas
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'sales' 
ORDER BY ordinal_position;

-- ============================================================================
-- PASSO 2: REMOVER TODAS AS CONSTRAINTS ANTIGAS
-- ============================================================================

-- Remover constraint com qualquer nome possível
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_productid_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_productid_fkey CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_product_id_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_product_id_fkey CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_produto_id_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_produto_id_fkey CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_productId_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_productId_fkey CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "fk_sales_product" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS fk_sales_product CASCADE;

-- Remover constraint para user_id se existir
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_userid_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_userid_fkey CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS "sales_user_id_fkey" CASCADE;
ALTER TABLE IF EXISTS sales DROP CONSTRAINT IF EXISTS sales_user_id_fkey CASCADE;

-- ============================================================================
-- PASSO 3: ADICIONAR CONSTRAINTS CORRETAS
-- ============================================================================

-- Se a coluna é "produto_id" (português)
ALTER TABLE sales ADD CONSTRAINT sales_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES products(id);
ALTER TABLE sales ADD CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- Se a coluna é "product_id" (inglês)
-- ALTER TABLE sales ADD CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
-- ALTER TABLE sales ADD CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- ============================================================================
-- PASSO 4: CORRIGIR DONATIONS TAMBÉM
-- ============================================================================

-- Remover constraints antigas de donations
ALTER TABLE IF EXISTS donations DROP CONSTRAINT IF EXISTS "donations_userid_fkey" CASCADE;
ALTER TABLE IF EXISTS donations DROP CONSTRAINT IF EXISTS donations_userid_fkey CASCADE;
ALTER TABLE IF EXISTS donations DROP CONSTRAINT IF EXISTS "donations_user_id_fkey" CASCADE;
ALTER TABLE IF EXISTS donations DROP CONSTRAINT IF EXISTS donations_user_id_fkey CASCADE;

-- Adicionar constraint correta para donations
ALTER TABLE donations ADD CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

-- ============================================================================
-- PASSO 5: VERIFICAR SE FUNCIONOU
-- ============================================================================

-- Ver todas as constraints criadas
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name IN ('sales', 'donations', 'users', 'products')
ORDER BY table_name;

-- ============================================================================
-- ALTERNATIVA: Se ainda der erro, execute ISSO para resetar tudo
-- ============================================================================

-- SOMENTE SE OS COMANDOS ACIMA NÃO FUNCIONAREM:
-- Recrie as tabelas sem constraints e depois adicione novamente

-- Backup de dados (se quiser preservar)
CREATE TABLE sales_backup AS SELECT * FROM sales;
CREATE TABLE donations_backup AS SELECT * FROM donations;

-- Dropar tabelas (cuidado!)
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS sales CASCADE;

-- Recriar tabelas com constraints já na criação
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  produto_id TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  data TEXT NOT NULL,
  local TEXT,
  pagamento TEXT,
  parcelas INTEGER,
  criadoem TEXT NOT NULL,
  atualizadoem TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (produto_id) REFERENCES products(id)
);

CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tipo TEXT NOT NULL,
  valor REAL NOT NULL,
  data TEXT NOT NULL,
  nome_diador TEXT,
  telefone_diador TEXT,
  criadoem TEXT NOT NULL,
  atualizadoem TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Recriar índices
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_produto_id ON sales(produto_id);
CREATE INDEX idx_sales_data ON sales(data);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_data ON donations(data);

-- Restaurar dados do backup
INSERT INTO sales SELECT * FROM sales_backup;
INSERT INTO donations SELECT * FROM donations_backup;

-- Dropar tabelas de backup
DROP TABLE sales_backup;
DROP TABLE donations_backup;
