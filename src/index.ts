/**
 * API do Posso Ajudar
 * Cloudflare Worker que gerencia todas as operações via Supabase
 * Endpoints para usuários, produtos, vendas e doações
 */

import { Router } from 'itty-router';

// Criar instância do roteador
const router = Router();

// Interface para variáveis de ambiente com Supabase
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

// Configuração do Supabase
const SUPABASE_URL = 'https://qhtzxqlnuubuvxnmwhax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodHp4cWxudXVidXZ4bm13aGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODc5NzUsImV4cCI6MjA4NTU2Mzk3NX0.y8n4kjhup_q3oxd7S-UV3opGHTprMHzj2M9ey32MK1o';

// Função auxiliar para fazer requisições ao Supabase
async function supabaseRequest(
  table: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    query?: string;
  } = {}
) {
  const { method = 'GET', body, query = '' } = options;
  
  const url = new URL(
    `${SUPABASE_URL}/rest/v1/${table}${query}`
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    ...options.headers,
  };

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Gerar ID único usando timestamp
function gerarId(): string {
  return Date.now().toString();
}

// Obter timestamp ISO atual
function obterDataAtual(): string {
  return new Date().toISOString();
}

// Função auxiliar para enviar resposta JSON
function respostaPorJSON(dados: any, status: number = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...headers,
    },
  });
}

// ============================================================================
// ENDPOINTS DE USUÁRIOS
// ============================================================================

// LOGIN - POST /api/usuarios/login
router.post('/api/usuarios/login', async (req: Request) => {
  try {
    const { matricula, senha } = await req.json() as {
      matricula: string;
      senha: string;
    };

    if (!matricula || !senha) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Matrícula e senha são obrigatórias' },
        400
      );
    }

    const usuarios = await supabaseRequest('users', {
      query: `?matricula=eq.${encodeURIComponent(matricula)}&select=*`,
    });

    if (!usuarios || usuarios.length === 0) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Colaboradora não encontrada' },
        401
      );
    }

    const usuario = usuarios[0];

    // Validar senha: deve ser 11 dígitos correspondendo ao CPF
    const cpfSemCaracteres = usuario.cpf.replace(/\D/g, '');
    if (senha !== cpfSemCaracteres) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Senha inválida' },
        401
      );
    }

    return respostaPorJSON({ sucesso: true, usuario }, 200);
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao fazer login' },
      500
    );
  }
});

// REGISTRAR USUÁRIO - POST /api/usuarios/registrar
router.post('/api/usuarios/registrar', async (req: Request) => {
  try {
    const dados = await req.json() as any;
    const {
      matricula,
      cpf,
      nomeCompleto,
      apelido,
      emailInstitucional,
      emailPessoal,
      numeroCorporativo,
      ramal,
      foto,
    } = dados;

    if (!matricula || !cpf || !nomeCompleto || !apelido || !emailInstitucional) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Campos obrigatórios não preenchidos' },
        400
      );
    }

    // Verificar se usuário já existe
    const existentes = await supabaseRequest('users', {
      query: `?or=(matricula.eq.${encodeURIComponent(matricula)},cpf.eq.${encodeURIComponent(cpf)})&select=id`,
    });

    if (existentes && existentes.length > 0) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Colaboradora com essa matrícula ou CPF já existe' },
        409
      );
    }

    const id = gerarId();
    const agora = obterDataAtual();

    const novoUsuario = {
      id,
      matricula,
      cpf,
      nomeCompleto,
      apelido,
      emailInstitucional,
      emailPessoal: emailPessoal || null,
      numeroCorporativo: numeroCorporativo || null,
      ramal: ramal || null,
      foto: foto || null,
      meta: 100,
      metaAtingida: 0,
      createdAt: agora,
      updatedAt: agora,
    };

    await supabaseRequest('users', {
      method: 'POST',
      body: novoUsuario,
    });

    return respostaPorJSON({ sucesso: true, usuario: novoUsuario }, 201);
  } catch (erro) {
    console.error('Erro ao registrar:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao registrar colaboradora' },
      500
    );
  }
});

// LISTAR TODOS OS USUÁRIOS - GET /api/usuarios
router.get('/api/usuarios', async () => {
  try {
    const usuarios = await supabaseRequest('users', {
      query: '?order=nomeCompleto.asc',
    });
    return respostaPorJSON(usuarios);
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar colaboradoras' },
      500
    );
  }
});

// OBTER USUÁRIO POR ID - GET /api/usuarios/:id
router.get('/api/usuarios/:id', async (req: Request) => {
  try {
    const { id } = req.params as { id: string };
    const usuarios = await supabaseRequest('users', {
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    if (!usuarios || usuarios.length === 0) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Colaboradora não encontrada' },
        404
      );
    }

    return respostaPorJSON(usuarios[0]);
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar colaboradora' },
      500
    );
  }
});

// ATUALIZAR USUÁRIO - PUT /api/usuarios/:id
router.put('/api/usuarios/:id', async (req: Request) => {
  try {
    const { id } = req.params as { id: string };
    const dados = await req.json() as any;

    const usuarioAtualizado = {
      ...dados,
      updatedAt: obterDataAtual(),
    };

    await supabaseRequest('users', {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: usuarioAtualizado,
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    const usuarios = await supabaseRequest('users', {
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    return respostaPorJSON(usuarios[0]);
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao atualizar colaboradora' },
      500
    );
  }
});

// ============================================================================
// ENDPOINTS DE PRODUTOS
// ============================================================================

// LISTAR TODOS OS PRODUTOS - GET /api/produtos
router.get('/api/produtos', async () => {
  try {
    const produtos = await supabaseRequest('products', {
      query: '?order=nome.asc',
    });
    return respostaPorJSON(produtos);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar produtos' },
      500
    );
  }
});

// CRIAR PRODUTO - POST /api/produtos
router.post('/api/produtos', async (req: Request) => {
  try {
    const { nome, preco, imagem } = await req.json() as any;

    if (!nome || !preco) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Nome e preço são obrigatórios' },
        400
      );
    }

    const id = gerarId();
    const agora = obterDataAtual();

    const novoProduto = {
      id,
      nome,
      preco,
      imagem: imagem || null,
      createdAt: agora,
      updatedAt: agora,
    };

    await supabaseRequest('products', {
      method: 'POST',
      body: novoProduto,
    });

    return respostaPorJSON(novoProduto, 201);
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao criar produto' },
      500
    );
  }
});

// ATUALIZAR PRODUTO - PUT /api/produtos/:id
router.put('/api/produtos/:id', async (req: Request) => {
  try {
    const { id } = req.params as { id: string };
    const dados = await req.json() as any;

    const produtoAtualizado = {
      ...dados,
      updatedAt: obterDataAtual(),
    };

    await supabaseRequest('products', {
      method: 'PATCH',
      body: produtoAtualizado,
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    const produtos = await supabaseRequest('products', {
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    return respostaPorJSON(produtos[0]);
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao atualizar produto' },
      500
    );
  }
});

// DELETAR PRODUTO - DELETE /api/produtos/:id
router.delete('/api/produtos/:id', async (req: Request) => {
  try {
    const { id } = req.params as { id: string };

    await supabaseRequest('products', {
      method: 'DELETE',
      query: `?id=eq.${encodeURIComponent(id)}`,
    });

    return respostaPorJSON({ sucesso: true });
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao deletar produto' },
      500
    );
  }
});

// ============================================================================
// ENDPOINTS DE VENDAS
// ============================================================================

// REGISTRAR VENDA - POST /api/sales
router.post('/api/sales', async (req: Request) => {
  try {
    const { userId, productId, quantidade, local, pagamento, parcelas } = await req.json() as any;

    if (!userId || !productId || !quantidade) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Campos obrigatórios não preenchidos' },
        400
      );
    }

    const id = gerarId();
    const agora = obterDataAtual();

    const novaVenda = {
      id,
      userId,
      productId,
      quantidade,
      data: agora,
      local: local || null,
      pagamento: pagamento || null,
      parcelas: parcelas || null,
      createdAt: agora,
      updatedAt: agora,
    };

    await supabaseRequest('sales', {
      method: 'POST',
      body: novaVenda,
    });

    return respostaPorJSON(novaVenda, 201);
  } catch (erro) {
    console.error('Erro ao registrar venda:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao registrar venda' },
      500
    );
  }
});

// LISTAR VENDAS - GET /api/vendas
router.get('/api/vendas', async () => {
  try {
    const vendas = await supabaseRequest('sales', {
      query: '?order=data.desc',
    });
    return respostaPorJSON(vendas);
  } catch (erro) {
    console.error('Erro ao listar vendas:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar vendas' },
      500
    );
  }
});

// LISTAR VENDAS DE USUÁRIO - GET /api/vendas/usuario/:userId
router.get('/api/vendas/usuario/:userId', async (req: Request) => {
  try {
    const { userId } = req.params as { userId: string };
    const vendas = await supabaseRequest('sales', {
      query: `?userId=eq.${encodeURIComponent(userId)}&order=data.desc`,
    });
    return respostaPorJSON(vendas);
  } catch (erro) {
    console.error('Erro ao listar vendas de usuário:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar vendas' },
      500
    );
  }
});

// ============================================================================
// ENDPOINTS DE DOAÇÕES
// ============================================================================

// REGISTRAR DOAÇÃO - POST /api/donations
router.post('/api/donations', async (req: Request) => {
  try {
    const { userId, tipo, valor, nomeDiador, telefoneDiador } = await req.json() as any;

    if (!userId || !tipo || !valor) {
      return respostaPorJSON(
        { sucesso: false, erro: 'Campos obrigatórios não preenchidos' },
        400
      );
    }

    const id = gerarId();
    const agora = obterDataAtual();

    const novaDoacao = {
      id,
      userId,
      tipo,
      valor,
      data: agora,
      nomeDiador: nomeDiador || null,
      telefoneDiador: telefoneDiador || null,
      createdAt: agora,
      updatedAt: agora,
    };

    await supabaseRequest('donations', {
      method: 'POST',
      body: novaDoacao,
    });

    return respostaPorJSON(novaDoacao, 201);
  } catch (erro) {
    console.error('Erro ao registrar doação:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao registrar doação' },
      500
    );
  }
});

// LISTAR DOAÇÕES - GET /api/donations
router.get('/api/donations', async () => {
  try {
    const doacoes = await supabaseRequest('donations', {
      query: '?order=data.desc',
    });
    return respostaPorJSON(doacoes);
  } catch (erro) {
    console.error('Erro ao listar doações:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar doações' },
      500
    );
  }
});

// LISTAR DOAÇÕES DE USUÁRIO - GET /api/donations/usuario/:userId
router.get('/api/donations/usuario/:userId', async (req: Request) => {
  try {
    const { userId } = req.params as { userId: string };
    const doacoes = await supabaseRequest('donations', {
      query: `?userId=eq.${encodeURIComponent(userId)}&order=data.desc`,
    });
    return respostaPorJSON(doacoes);
  } catch (erro) {
    console.error('Erro ao listar doações de usuário:', erro);
    return respostaPorJSON(
      { sucesso: false, erro: 'Erro ao buscar doações' },
      500
    );
  }
});

// ============================================================================
// CORS & 404
// ============================================================================

router.options('*', () => {
  return respostaPorJSON({}, 204);
});

router.all('*', () => {
  return respostaPorJSON({ error: 'Not Found' }, 404);
});

export default {
  fetch: router.handle,
};
