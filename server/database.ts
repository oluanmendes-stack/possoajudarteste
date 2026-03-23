// Banco de dados em memória para desenvolvimento
// Em produção, isso será substituído pelo Cloudflare D1

export interface User {
  id: string;
  matricula: string;
  cpf: string;
  nomeCompleto: string;
  apelido: string;
  emailInstitucional: string;
  emailPessoal?: string;
  numeroCorporativo?: string;
  ramal?: string;
  foto?: string;
  meta: number;
  metaAtingida: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  userId: string;
  productId: string;
  quantidade: number;
  data: string;
  local?: "acoes" | "vendaExterna" | "vendaInterna" | "quimioterapia" | "portaria" | "sus" | "convenio";
  pagamento?: "cartao" | "dinheiro" | "pix";
  parcelas?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  userId: string;
  tipo: "agua" | "luz";
  valor: number;
  data: string;
  nomeDiador?: string;
  telefoneDiador?: string;
  createdAt: string;
  updatedAt: string;
}

class Database {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private sales: Map<string, Sale> = new Map();
  private donations: Map<string, Donation> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Produtos padrão
    const defaultProducts: Product[] = [
      {
        id: "1",
        nome: "Água (500ml)",
        preco: 2.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        nome: "Café",
        preco: 1.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        nome: "Suco",
        preco: 3.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        nome: "Bracelete Hospital",
        preco: 5.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    defaultProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // =====================
  // USUÁRIOS
  // =====================

  getAllUsers(): User[] {
    return Array.from(this.users.values()).sort((a, b) =>
      a.nomeCompleto.localeCompare(b.nomeCompleto)
    );
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getUserByMatricula(matricula: string): User | null {
    return Array.from(this.users.values()).find(u => u.matricula === matricula) || null;
  }

  getUserByCpf(cpf: string): User | null {
    return Array.from(this.users.values()).find(u => u.cpf === cpf) || null;
  }

  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updated: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  // =====================
  // PRODUTOS
  // =====================

  getAllProducts(): Product[] {
    return Array.from(this.products.values()).sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }

  getProductById(id: string): Product | null {
    return this.products.get(id) || null;
  }

  createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
    const product = this.products.get(id);
    if (!product) return null;

    const updated: Product = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.products.set(id, updated);
    return updated;
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  // =====================
  // VENDAS
  // =====================

  getAllSales(): Sale[] {
    return Array.from(this.sales.values()).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  getSaleById(id: string): Sale | null {
    return this.sales.get(id) || null;
  }

  getSalesByUserId(userId: string): Sale[] {
    return Array.from(this.sales.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  createSale(sale: Omit<Sale, "id" | "createdAt" | "updatedAt">): Sale {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const newSale: Sale = {
      ...sale,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.sales.set(id, newSale);

    // Atualizar metaAtingida do usuário
    const user = this.users.get(sale.userId);
    if (user) {
      this.updateUser(sale.userId, {
        metaAtingida: (user.metaAtingida || 0) + sale.quantidade,
      });
    }

    return newSale;
  }

  // =====================
  // DOAÇÕES
  // =====================

  getAllDonations(): Donation[] {
    return Array.from(this.donations.values()).sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  getDonationById(id: string): Donation | null {
    return this.donations.get(id) || null;
  }

  getDonationsByUserId(userId: string): Donation[] {
    return Array.from(this.donations.values())
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  createDonation(donation: Omit<Donation, "id" | "createdAt" | "updatedAt">): Donation {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const newDonation: Donation = {
      ...donation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.donations.set(id, newDonation);
    return newDonation;
  }
}

// Exportar instância única
export const db = new Database();
