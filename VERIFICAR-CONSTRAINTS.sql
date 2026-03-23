-- Ver TODAS as constraints de foreign key que existem

SELECT 
  constraint_name, 
  table_name, 
  column_name,
  referenced_table_name,
  referenced_column_name
FROM information_schema.key_column_usage 
WHERE table_name IN ('sales', 'donations', 'users', 'products')
  AND constraint_name LIKE '%fkey%'
ORDER BY table_name, column_name;
