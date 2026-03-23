-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  matricula TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  nomeCompleto TEXT NOT NULL,
  apelido TEXT NOT NULL,
  emailInstitucional TEXT NOT NULL,
  emailPessoal TEXT,
  numeroCorporativo TEXT,
  ramal TEXT,
  foto TEXT,
  meta INTEGER DEFAULT 100,
  metaAtingida INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  imagem TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  productId TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  data TEXT NOT NULL,
  local TEXT,
  pagamento TEXT,
  parcelas INTEGER,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  tipo TEXT NOT NULL,
  valor REAL NOT NULL,
  data TEXT NOT NULL,
  nomeDiador TEXT,
  telefoneDiador TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_userId ON sales(userId);
CREATE INDEX IF NOT EXISTS idx_sales_productId ON sales(productId);
CREATE INDEX IF NOT EXISTS idx_sales_data ON sales(data);
CREATE INDEX IF NOT EXISTS idx_donations_userId ON donations(userId);
CREATE INDEX IF NOT EXISTS idx_donations_data ON donations(data);
CREATE INDEX IF NOT EXISTS idx_users_matricula ON users(matricula);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
