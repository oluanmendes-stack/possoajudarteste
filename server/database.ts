import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  // =====================
  // USUÁRIOS
  // =====================

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nomeCompleto", { ascending: true });

    if (error) throw error;
    return (data || []) as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as User | null;
  }

  async getUserByMatricula(matricula: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("matricula", matricula)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as User | null;
  }

  async getUserByCpf(cpf: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("cpf", cpf)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as User | null;
  }

  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          ...user,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as User | null;
  }

  // =====================
  // PRODUTOS
  // =====================

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("nome", { ascending: true });

    if (error) throw error;
    return (data || []) as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as Product | null;
  }

  async createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          ...product,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as Product | null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  // =====================
  // VENDAS
  // =====================

  async getAllSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("data", { ascending: false });

    if (error) throw error;
    return (data || []) as Sale[];
  }

  async getSaleById(id: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as Sale | null;
  }

  async getSalesByUserId(userId: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("userId", userId)
      .order("data", { ascending: false });

    if (error) throw error;
    return (data || []) as Sale[];
  }

  async createSale(sale: Omit<Sale, "id" | "createdAt" | "updatedAt">): Promise<Sale> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("sales")
      .insert([
        {
          ...sale,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Atualizar metaAtingida do usuário
    const user = await this.getUserById(sale.userId);
    if (user) {
      await this.updateUser(sale.userId, {
        metaAtingida: (user.metaAtingida || 0) + sale.quantidade,
      });
    }

    return data as Sale;
  }

  // =====================
  // DOAÇÕES
  // =====================

  async getAllDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("data", { ascending: false });

    if (error) throw error;
    return (data || []) as Donation[];
  }

  async getDonationById(id: string): Promise<Donation | null> {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return (data || null) as Donation | null;
  }

  async getDonationsByUserId(userId: string): Promise<Donation[]> {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("userId", userId)
      .order("data", { ascending: false });

    if (error) throw error;
    return (data || []) as Donation[];
  }

  async createDonation(donation: Omit<Donation, "id" | "createdAt" | "updatedAt">): Promise<Donation> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("donations")
      .insert([
        {
          ...donation,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Donation;
  }
}

// Exportar instância única
export const db = new Database();
