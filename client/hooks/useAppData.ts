import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://laxgdxrcamczkyqevimh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxheGdkeHJjYW1jemt5cWV2aW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjgzMjQsImV4cCI6MjA4NjIwNDMyNH0.OcExIFr3fOnqzuL3JkNH5WbrskyCTopo7VRSVLDl6pU';

const supabase = createClient(supabaseUrl, supabaseKey);

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

export interface Periodo {
  id: string;
  nome: string;
  data_inicio: string; // DATE format YYYY-MM-DD
  data_fim: string; // DATE format YYYY-MM-DD
  ativo: boolean;
  descricao?: string;
  criado_em?: string;
  atualizado_em?: string;
}

// Chaves de armazenamento para fallback (quando offline)
const STORAGE_KEYS = {
  CURRENT_USER: "posso_ajudar_current_user",
  USERS: "posso_ajudar_users",
  PRODUCTS: "posso_ajudar_products",
  SALES: "posso_ajudar_sales",
  DONATIONS: "posso_ajudar_donations",
  PERIODOS: "posso_ajudar_periodos",
};

export function useAppData() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
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
        const loadedPeriodos = localStorage.getItem(STORAGE_KEYS.PERIODOS);

        if (loadedUser) setCurrentUser(JSON.parse(loadedUser));
        if (loadedUsers) setUsers(JSON.parse(loadedUsers));
        if (loadedProducts) setProducts(JSON.parse(loadedProducts));
        if (loadedSales) setSales(JSON.parse(loadedSales));
        if (loadedDonations) setDonations(JSON.parse(loadedDonations));
        if (loadedPeriodos) setPeriodos(JSON.parse(loadedPeriodos));

        // Inicializar produtos padrão se não existirem
        if (!loadedProducts) {
          const produtosPadrao: Product[] = [
            { id: "1", nome: "Água (500ml)", preço: 2.0 },
            { id: "2", nome: "Café", preço: 1.5 },
            { id: "3", nome: "Suco", preço: 3.0 },
            { id: "4", nome: "Bracelete Hospital", preço: 5.0 },
          ];
          setProducts(produtosPadrao);
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(produtosPadrao));
        }

        // Buscar dados do Supabase com fallback para localStorage
        const fetchWithFallback = async () => {
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
            console.warn('Aviso ao buscar usuários:', erro);
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
            }
          } catch (erro) {
            console.warn('Aviso ao buscar produtos:', erro);
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
            console.warn('Aviso ao buscar vendas:', erro);
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
            console.warn('Aviso ao buscar doações:', erro);
          }

          // Buscar períodos
          try {
            const { data: periodosData, error: periodosError } = await supabase
              .from('periodos')
              .select('*')
              .order('data_inicio', { ascending: false });

            if (!periodosError && periodosData) {
              setPeriodos(periodosData as Periodo[]);
              localStorage.setItem(STORAGE_KEYS.PERIODOS, JSON.stringify(periodosData));
            }
          } catch (erro) {
            console.warn('Aviso ao buscar períodos:', erro);
          }
        };

        // Executar fetch em background sem bloquear o carregamento da app
        setLoading(false);
        fetchWithFallback().catch((err) => {
          console.warn('Erro na busca de dados:', err);
        });
      } catch (error) {
        console.error('Initialization error:', error);
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
      // Tentar Supabase primeiro
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
      } catch (supabaseError) {
        // Fallback: buscar do localStorage
        try {
          const usuariosLocal = localStorage.getItem(STORAGE_KEYS.USERS);
          if (!usuariosLocal) {
            return { success: false, error: 'Nenhum usuário cadastrado' };
          }

          const usuariosData = JSON.parse(usuariosLocal) as User[];
          const usuario = usuariosData.find((u) => u.matricula === matricula);

          if (!usuario) {
            return { success: false, error: 'Matrícula não encontrada' };
          }

          // Validar senha
          const cpfSemCaracteres = usuario.cpf.replace(/\D/g, '');
          if (senha !== cpfSemCaracteres) {
            return { success: false, error: 'Senha inválida' };
          }

          setCurrentUser(usuario);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(usuario));
          return { success: true, error: null };
        } catch (localError) {
          return { success: false, error: 'Erro ao fazer login. Verifique seus dados.' };
        }
      }
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
        createdAt: agora,
        updatedAt: agora,
      };

      if (dadosUsuario.emailPessoal) insertData.emailPessoal = dadosUsuario.emailPessoal;
      if (dadosUsuario.numeroCorporativo) insertData.numeroCorporativo = dadosUsuario.numeroCorporativo;
      if (dadosUsuario.ramal) insertData.ramal = dadosUsuario.ramal;
      if (dadosUsuario.foto) insertData.foto = dadosUsuario.foto;
      if (dadosUsuario.is_admin) insertData.is_admin = dadosUsuario.is_admin;

      // Tentar salvar no Supabase, mas não falhar se não conseguir
      try {
        await supabase
          .from('users')
          .insert([insertData]);
      } catch (supabaseError) {
        // Continuar mesmo se Supabase falhar - usar localStorage
      }

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
          updatedAt: new Date().toISOString(),
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
          updatedAt: new Date().toISOString(),
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
        userId: currentUser.id,
        productId: productId,
        quantidade,
        data: agora,
        createdAt: agora,
        updatedAt: agora,
      };

      // Only add optional fields if they are defined
      if (details?.local) insertData.local = details.local;
      if (details?.pagamento) insertData.pagamento = details.pagamento;
      if (details?.parcelas) insertData.parcelas = details.parcelas;
      if (details?.nomeComprador) insertData.nomeComprador = details.nomeComprador;
      if (details?.telefoneComprador) insertData.telefoneComprador = details.telefoneComprador;
      if (details?.emailComprador) insertData.emailComprador = details.emailComprador;

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
        userId: currentUser.id,
        tipo,
        valor,
        data: agora,
        createdAt: agora,
        updatedAt: agora,
      };

      // Only add optional fields if they are defined
      if (nomeDiador) insertData.nomeDiador = nomeDiador;
      if (telefoneDiador) insertData.telefoneDiador = telefoneDiador;
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

  // Criar novo período
  const createPeriodo = async (
    nome: string,
    data_inicio: string,
    data_fim: string,
    descricao?: string
  ): Promise<Periodo> => {
    try {
      const id = Date.now().toString();
      const agora = new Date().toISOString();

      const novoPeriodo: Periodo = {
        id,
        nome,
        data_inicio,
        data_fim,
        ativo: false,
        descricao,
        criado_em: agora,
        atualizado_em: agora,
      };

      const insertData: any = {
        id,
        nome,
        data_inicio,
        data_fim,
        ativo: false,
        createdAt: agora,
        updatedAt: agora,
      };

      if (descricao) insertData.descricao = descricao;

      const { error } = await supabase
        .from('periodos')
        .insert([insertData]);

      if (error) throw error;

      const novosPeriodos = [...periodos, novoPeriodo];
      setPeriodos(novosPeriodos);
      localStorage.setItem(STORAGE_KEYS.PERIODOS, JSON.stringify(novosPeriodos));
      return novoPeriodo;
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao criar período:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Deletar período
  const deletePeriodo = async (idPeriodo: string) => {
    try {
      const { error } = await supabase
        .from('periodos')
        .delete()
        .eq('id', idPeriodo);

      if (error) throw error;

      const novosPeriodos = periodos.filter((p) => p.id !== idPeriodo);
      setPeriodos(novosPeriodos);
      localStorage.setItem(STORAGE_KEYS.PERIODOS, JSON.stringify(novosPeriodos));
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao deletar período:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Marcar período como ativo
  const setPeriodoAtivo = async (idPeriodo: string) => {
    try {
      // Desativar todos os períodos
      const { error: desativarError } = await supabase
        .from('periodos')
        .update({ ativo: false, updatedAt: new Date().toISOString() })
        .eq('ativo', true);

      if (desativarError) throw desativarError;

      // Ativar o período selecionado
      const { error: ativarError } = await supabase
        .from('periodos')
        .update({ ativo: true, updatedAt: new Date().toISOString() })
        .eq('id', idPeriodo);

      if (ativarError) throw ativarError;

      // Atualizar estado local
      const novosPeriodos = periodos.map((p) => ({
        ...p,
        ativo: p.id === idPeriodo,
      }));
      setPeriodos(novosPeriodos);
      localStorage.setItem(STORAGE_KEYS.PERIODOS, JSON.stringify(novosPeriodos));
    } catch (erro: any) {
      const errorMessage = erro?.message || JSON.stringify(erro);
      console.error('Erro ao marcar período como ativo:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Obter período ativo
  const getPeriodoAtivo = (): Periodo | undefined => {
    return periodos.find((p) => p.ativo === true);
  };

  return {
    loading,
    currentUser,
    users,
    products,
    sales,
    donations,
    periodos,
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
    createPeriodo,
    deletePeriodo,
    setPeriodoAtivo,
    getPeriodoAtivo,
    getSalesByUser,
    getSalesByMonth,
    getSalesByDateRange,
    getTotalSalesByProduct,
    getTotalSalesByProductInRange,
    getDonationsByUser,
  };
}
