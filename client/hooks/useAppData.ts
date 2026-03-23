import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente Supabase
const supabase = createClient(
  'https://qhtzxqlnuubuvxnmwhax.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodHp4cWxudXVidXZ4bm13aGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODc5NzUsImV4cCI6MjA4NTU2Mzk3NX0.y8n4kjhup_q3oxd7S-UV3opGHTprMHzj2M9ey32MK1o'
);

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
  is_admin?: boolean;
}

export interface Product {
  id: string;
  nome: string;
  preço: number;
  imagem?: string;
}

export interface Sale {
  id: string;
  userId: string;
  productId: string;
  quantidade: number;
  data: string;
  local?:
    | "acoes"
    | "vendaExterna"
    | "vendaInterna"
    | "quimioterapia"
    | "portaria"
    | "sus"
    | "convenio";
  pagamento?: "cartao" | "dinheiro" | "pix";
  parcelas?: number;
  nomeComprador?: string;
  telefoneComprador?: string;
  emailComprador?: string;
}

export interface Donation {
  id: string;
  userId: string;
  tipo: "agua" | "luz" | "pix";
  valor: number;
  parcelas?: number;
  data: string;
  nomeDiador?: string;
  telefoneDiador?: string;
}

// Chaves de armazenamento para fallback (quando offline)
const STORAGE_KEYS = {
  CURRENT_USER: "posso_ajudar_current_user",
  USERS: "posso_ajudar_users",
  PRODUCTS: "posso_ajudar_products",
  SALES: "posso_ajudar_sales",
  DONATIONS: "posso_ajudar_donations",
};

export function useAppData() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from Supabase
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Tentar carregar do localStorage primeiro (para suporte offline)
        const loadedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        const loadedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        const loadedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const loadedSales = localStorage.getItem(STORAGE_KEYS.SALES);
        const loadedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);

        if (loadedUser) setCurrentUser(JSON.parse(loadedUser));
        if (loadedUsers) setUsers(JSON.parse(loadedUsers));
        if (loadedProducts) setProducts(JSON.parse(loadedProducts));
        if (loadedSales) setSales(JSON.parse(loadedSales));
        if (loadedDonations) setDonations(JSON.parse(loadedDonations));

        // Buscar dados do Supabase com fallback para localStorage
        const fetchWithFallback = async () => {
          try {
            // Buscar usuários
            try {
              const { data: usuariosData, error: usuariosError } = await supabase
                .from('users')
                .select('*')
                .order('nomeCompleto', { ascending: true });

              if (!usuariosError && usuariosData && usuariosData.length > 0) {
                setUsers(usuariosData as User[]);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usuariosData));
              }
            } catch (erro) {
              console.debug('Erro ao buscar usuários:', erro);
            }

            // Buscar produtos
            try {
              const { data: produtosData, error: produtosError } = await supabase
                .from('products')
                .select('*')
                .order('nome', { ascending: true });

              if (!produtosError && produtosData && produtosData.length > 0) {
                setProducts(produtosData as Product[]);
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(produtosData));
              } else {
                // Inicializar produtos padrão se vazio
                const produtosPadrao: Product[] = [
                  { id: "1", nome: "Água (500ml)", preço: 2.0 },
                  { id: "2", nome: "Café", preço: 1.5 },
                  { id: "3", nome: "Suco", preço: 3.0 },
                  { id: "4", nome: "Bracelete Hospital", preço: 5.0 },
                ];

                // Tentar criar produtos padrão no banco de dados
                for (const produto of produtosPadrao) {
                  try {
                    await supabase
                      .from('products')
                      .insert([{
                        id: produto.id,
                        nome: produto.nome,
                        preço: produto.preço,
                      }]);
                  } catch (erro) {
                    console.debug('Erro ao criar produto padrão:', erro);
                  }
                }

                setProducts(produtosPadrao);
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(produtosPadrao));
              }
            } catch (erro) {
              console.debug('Erro ao buscar produtos:', erro);
            }

            // Buscar vendas
            try {
              const { data: vendasData, error: vendasError } = await supabase
                .from('sales')
                .select('*')
                .order('data', { ascending: false });

              if (!vendasError && vendasData) {
                setSales(vendasData as Sale[]);
                localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(vendasData));
              }
            } catch (erro) {
              console.debug('Erro ao buscar vendas:', erro);
            }

            // Buscar doações
            try {
              const { data: doacoesData, error: doacoesError } = await supabase
                .from('donations')
                .select('*')
                .order('data', { ascending: false });

              if (!doacoesError && doacoesData) {
                setDonations(doacoesData as Donation[]);
                localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(doacoesData));
              }
            } catch (erro) {
              console.debug('Erro ao buscar doações:', erro);
            }
          } catch (erro) {
            console.warn('⚠️ Falha ao conectar ao Supabase. Usando dados em cache do localStorage.', erro);
          }
        };

        fetchWithFallback();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const login = (matricula: string, senha: string) => {
    // This will be handled via async call in the component
    return { success: true, error: null };
  };

  // Fazer login assincronamente
  const loginAsync = async (
    matricula: string,
    senha: string
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { data: usuariosData, error } = await supabase
        .from('users')
        .select('*')
        .eq('matricula', matricula);

      if (error) throw error;

      if (!usuariosData || usuariosData.length === 0) {
        return { success: false, error: 'Matrícula não encontrada' };
      }

      const usuario = usuariosData[0];

      // Validar senha: deve ser 11 dígitos correspondendo ao CPF
      const cpfSemCaracteres = usuario.cpf.replace(/\D/g, '');
      if (senha !== cpfSemCaracteres) {
        return { success: false, error: 'Senha inválida' };
      }

      setCurrentUser(usuario);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(usuario));
      return { success: true, error: null };
    } catch (erro: any) {
      return { success: false, error: erro.message || 'Erro ao fazer login' };
    }
  };

  // Registrar novo usuário
  const registerUser = async (
    dadosUsuario: Omit<User, "id" | "meta" | "metaAtingida">
  ): Promise<User> => {
    try {
      const id = Date.now().toString();
      const agora = new Date().toISOString();

      const novoUsuario: User = {
        ...dadosUsuario,
        id,
        meta: 100,
        metaAtingida: 0,
      };

      // Build insert data with only defined fields
      const insertData: any = {
        id,
        matricula: dadosUsuario.matricula,
        cpf: dadosUsuario.cpf,
        nomeCompleto: dadosUsuario.nomeCompleto,
        apelido: dadosUsuario.apelido,
        emailInstitucional: dadosUsuario.emailInstitucional,
        meta: 100,
        metaAtingida: 0,
        criadoem: agora,
        atualizadoem: agora,
      };

      if (dadosUsuario.emailPessoal) insertData.emailPessoal = dadosUsuario.emailPessoal;
      if (dadosUsuario.numeroCorporativo) insertData.numeroCorporativo = dadosUsuario.numeroCorporativo;
      if (dadosUsuario.ramal) insertData.ramal = dadosUsuario.ramal;
      if (dadosUsuario.foto) insertData.foto = dadosUsuario.foto;
      if (dadosUsuario.is_admin) insertData.is_admin = dadosUsuario.is_admin;

      const { error } = await supabase
        .from('users')
        .insert([insertData]);

      if (error) throw error;

      const novosUsuarios = [...users, novoUsuario];
      setUsers(novosUsuarios);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(novosUsuarios));

      return novoUsuario;
    } catch (erro: any) {
      throw new Error(erro.message || 'Erro ao registrar colaboradora');
    }
  };

  // Register admin user
  const registerAdminUser = async (): Promise<User> => {
    return registerUser({
      matricula: "1234",
      cpf: "12345678901",
      nomeCompleto: "Admin",
      apelido: "Admin",
      emailInstitucional: "admin@possoajudar.com",
      is_admin: true,
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  // Atualizar usuário
  const updateUser = async (usuarioAtualizado: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          apelido: usuarioAtualizado.apelido,
          emailPessoal: usuarioAtualizado.emailPessoal,
          numeroCorporativo: usuarioAtualizado.numeroCorporativo,
          ramal: usuarioAtualizado.ramal,
          foto: usuarioAtualizado.foto,
          meta: usuarioAtualizado.meta,
          metaAtingida: usuarioAtualizado.metaAtingida,
          is_admin: usuarioAtualizado.is_admin || false,
          atualizadoem: new Date().toISOString(),
        })
        .eq('id', usuarioAtualizado.id);

      if (error) throw error;

      setCurrentUser(usuarioAtualizado);
      const novosUsuarios = users.map((u) =>
        u.id === usuarioAtualizado.id ? usuarioAtualizado : u
      );
      setUsers(novosUsuarios);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(usuarioAtualizado));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(novosUsuarios));
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao atualizar usuário:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Make current user admin
  const makeCurrentUserAdmin = async () => {
    if (!currentUser) {
      throw new Error('Nenhum usuário logado');
    }

    try {
      const adminUser: User = {
        ...currentUser,
        is_admin: true,
      };

      const { error } = await supabase
        .from('users')
        .update({
          is_admin: true,
          atualizadoem: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setCurrentUser(adminUser);
      const novosUsuarios = users.map((u) =>
        u.id === currentUser.id ? adminUser : u
      );
      setUsers(novosUsuarios);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(novosUsuarios));

      return adminUser;
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao atualizar admin status:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Adicionar novo produto
  const addProduct = async (produto: Omit<Product, "id">) => {
    try {
      const id = Date.now().toString();

      const novoProduto: Product = {
        ...produto,
        id,
      };

      const insertData: any = {
        id,
        nome: produto.nome,
        preço: produto.preço || 0, // Preço é obrigatório, usa 0 como padrão se não fornecido
      };

      // Only add optional image field if provided
      if (produto.imagem) insertData.imagem = produto.imagem;

      const { error } = await supabase
        .from('products')
        .insert([insertData]);

      if (error) throw error;

      const novosProdutos = [...products, novoProduto];
      setProducts(novosProdutos);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(novosProdutos));
      return novoProduto;
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao adicionar produto:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Deletar produto
  const deleteProduct = async (idProduto: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', idProduto);

      if (error) throw error;

      const novosProdutos = products.filter((p) => p.id !== idProduto);
      setProducts(novosProdutos);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(novosProdutos));
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao deletar produto:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const recordSale = async (
    productId: string,
    quantidade: number,
    details?: {
      local?:
        | "acoes"
        | "vendaExterna"
        | "vendaInterna"
        | "quimioterapia"
        | "portaria"
        | "sus"
        | "convenio";
      pagamento?: "cartao" | "dinheiro" | "pix";
      parcelas?: number;
      nomeComprador?: string;
      telefoneComprador?: string;
      emailComprador?: string;
    }
  ) => {
    if (!currentUser) return;

    try {
      const id = Date.now().toString();
      const agora = new Date().toISOString();

      const newSale: Sale = {
        id,
        userId: currentUser.id,
        productId,
        quantidade,
        data: agora,
        local: details?.local,
        pagamento: details?.pagamento,
        parcelas: details?.parcelas,
        nomeComprador: details?.nomeComprador,
        telefoneComprador: details?.telefoneComprador,
        emailComprador: details?.emailComprador,
      };

      // Build insert object with only defined fields
      const insertData: any = {
        id,
        user_id: currentUser.id,
        produto_id: productId,
        quantidade,
        data: agora,
        criadoem: agora,
        atualizadoem: agora,
      };

      // Only add optional fields if they are defined
      if (details?.local) insertData.local = details.local;
      if (details?.pagamento) insertData.pagamento = details.pagamento;
      if (details?.parcelas) insertData.parcelas = details.parcelas;
      if (details?.nomeComprador) insertData.nome_comprador = details.nomeComprador;
      if (details?.telefoneComprador) insertData.telefone_comprador = details.telefoneComprador;
      if (details?.emailComprador) insertData.email_comprador = details.emailComprador;

      const { error } = await supabase
        .from('sales')
        .insert([insertData]);

      if (error) throw error;

      const newSales = [...sales, newSale];
      setSales(newSales);
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(newSales));

      // Update user's meta
      const updatedUser = {
        ...currentUser,
        metaAtingida: currentUser.metaAtingida + quantidade,
      };
      await updateUser(updatedUser);

      return newSale;
    } catch (error: any) {
      const errorMessage = error?.message || JSON.stringify(error);
      console.error('Error recording sale:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getSalesByUser = (userId: string) => {
    return sales.filter((s) => s.userId === userId);
  };

  const getSalesByMonth = (userId: string, date: Date = new Date()) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    return getSalesByUser(userId).filter((s) => {
      const saleDate = new Date(s.data);
      return saleDate.getMonth() === month && saleDate.getFullYear() === year;
    });
  };

  const getSalesByDateRange = (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    return getSalesByUser(userId).filter((s) => {
      const saleDate = new Date(s.data);
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  const getTotalSalesByProduct = (userId: string) => {
    const userSales = getSalesByUser(userId);
    const summary: Record<string, number> = {};

    userSales.forEach((sale) => {
      summary[sale.productId] =
        (summary[sale.productId] || 0) + sale.quantidade;
    });

    return summary;
  };

  const getTotalSalesByProductInRange = (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const salesInRange = getSalesByDateRange(userId, startDate, endDate);
    const summary: Record<string, number> = {};

    salesInRange.forEach((sale) => {
      summary[sale.productId] =
        (summary[sale.productId] || 0) + sale.quantidade;
    });

    return summary;
  };

  const recordDonation = async (
    tipo: "agua" | "luz" | "pix",
    valor: number,
    nomeDiador?: string,
    telefoneDiador?: string,
    parcelas?: number
  ) => {
    if (!currentUser) return;

    try {
      const id = Date.now().toString();
      const agora = new Date().toISOString();

      const newDonation: Donation = {
        id,
        userId: currentUser.id,
        tipo,
        valor,
        data: agora,
        nomeDiador: nomeDiador || undefined,
        telefoneDiador: telefoneDiador || undefined,
        parcelas: parcelas || undefined,
      };

      // Build insert object with only defined fields
      const insertData: any = {
        id,
        user_id: currentUser.id,
        tipo,
        valor,
        data: agora,
        criadoem: agora,
        atualizadoem: agora,
      };

      // Only add optional fields if they are defined
      if (nomeDiador) insertData.nome_diador = nomeDiador;
      if (telefoneDiador) insertData.telefone_diador = telefoneDiador;
      if (parcelas) insertData.parcelas = parcelas;

      const { error } = await supabase
        .from('donations')
        .insert([insertData]);

      if (error) throw error;

      const newDonations = [...donations, newDonation];
      setDonations(newDonations);
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(newDonations));
      return newDonation;
    } catch (error: any) {
      const errorMessage = error?.message || JSON.stringify(error);
      console.error('Error recording donation:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getDonationsByUser = (userId: string) => {
    return donations.filter((d) => d.userId === userId);
  };

  return {
    loading,
    currentUser,
    users,
    products,
    sales,
    donations,
    login,
    loginAsync,
    logout,
    registerUser,
    registerAdminUser,
    makeCurrentUserAdmin,
    updateUser,
    addProduct,
    deleteProduct,
    recordSale,
    recordDonation,
    getSalesByUser,
    getSalesByMonth,
    getSalesByDateRange,
    getTotalSalesByProduct,
    getTotalSalesByProductInRange,
    getDonationsByUser,
  };
}
