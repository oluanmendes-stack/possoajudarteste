import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { db, User, Product, Sale, Donation } from "./database";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // ENDPOINTS EXISTENTES
  // ============================================================================

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ============================================================================
  // ENDPOINTS DE USUÁRIOS
  // ============================================================================

  // LOGIN - POST /api/usuarios/login
  app.post("/api/usuarios/login", async (req: Request, res: Response) => {
    try {
      const { matricula, senha } = req.body;

      if (!matricula || !senha) {
        return res.status(400).json({
          sucesso: false,
          erro: "Matrícula e senha são obrigatórias",
        });
      }

      const usuario = await db.getUserByMatricula(matricula);

      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          erro: "Colaboradora não encontrada",
        });
      }

      // Validar senha: deve ser 11 dígitos correspondendo ao CPF
      const cpfSemCaracteres = usuario.cpf.replace(/\D/g, "");
      if (senha !== cpfSemCaracteres) {
        return res.status(401).json({
          sucesso: false,
          erro: "Senha inválida",
        });
      }

      return res.status(200).json({ sucesso: true, usuario });
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao fazer login",
      });
    }
  });

  // REGISTRAR USUÁRIO - POST /api/usuarios/registrar
  app.post("/api/usuarios/registrar", async (req: Request, res: Response) => {
    try {
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
      } = req.body;

      if (
        !matricula ||
        !cpf ||
        !nomeCompleto ||
        !apelido ||
        !emailInstitucional
      ) {
        return res.status(400).json({
          sucesso: false,
          erro: "Campos obrigatórios não preenchidos",
        });
      }

      // Verificar se usuário já existe
      const existeMatricula = await db.getUserByMatricula(matricula);
      if (existeMatricula) {
        return res.status(409).json({
          sucesso: false,
          erro: "Colaboradora com essa matrícula já existe",
        });
      }

      const existeCpf = await db.getUserByCpf(cpf);
      if (existeCpf) {
        return res.status(409).json({
          sucesso: false,
          erro: "Colaboradora com esse CPF já existe",
        });
      }

      const usuario = await db.createUser({
        matricula,
        cpf,
        nomeCompleto,
        apelido,
        emailInstitucional,
        emailPessoal,
        numeroCorporativo,
        ramal,
        foto,
        meta: 100,
        metaAtingida: 0,
      });

      return res.status(201).json({ sucesso: true, usuario });
    } catch (erro) {
      console.error("Erro ao registrar:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao registrar colaboradora",
      });
    }
  });

  // LISTAR TODOS OS USUÁRIOS - GET /api/usuarios
  app.get("/api/usuarios", async (req: Request, res: Response) => {
    try {
      const usuarios = await db.getAllUsers();
      return res.status(200).json(usuarios);
    } catch (erro) {
      console.error("Erro ao listar usuários:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar colaboradoras",
      });
    }
  });

  // OBTER USUÁRIO POR ID - GET /api/usuarios/:id
  app.get("/api/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario = await db.getUserById(id);

      if (!usuario) {
        return res.status(404).json({
          sucesso: false,
          erro: "Colaboradora não encontrada",
        });
      }

      return res.status(200).json(usuario);
    } catch (erro) {
      console.error("Erro ao buscar usuário:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar colaboradora",
      });
    }
  });

  // ATUALIZAR USUÁRIO - PUT /api/usuarios/:id
  app.put("/api/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { meta, metaAtingida } = req.body;

      const usuario = await db.updateUser(id, { meta, metaAtingida });

      if (!usuario) {
        return res.status(404).json({
          sucesso: false,
          erro: "Colaboradora não encontrada",
        });
      }

      return res.status(200).json(usuario);
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao atualizar colaboradora",
      });
    }
  });

  // ============================================================================
  // ENDPOINTS DE PRODUTOS
  // ============================================================================

  // LISTAR PRODUTOS - GET /api/produtos
  app.get("/api/produtos", async (req: Request, res: Response) => {
    try {
      const produtos = await db.getAllProducts();
      return res.status(200).json(produtos);
    } catch (erro) {
      console.error("Erro ao listar produtos:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar produtos",
      });
    }
  });

  // CRIAR PRODUTO - POST /api/produtos
  app.post("/api/produtos", async (req: Request, res: Response) => {
    try {
      const { nome, preco, imagem } = req.body;

      if (!nome || preco === undefined) {
        return res.status(400).json({
          sucesso: false,
          erro: "Nome e preço são obrigatórios",
        });
      }

      const produto = await db.createProduct({ nome, preco, imagem });
      return res.status(201).json(produto);
    } catch (erro) {
      console.error("Erro ao criar produto:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao criar produto",
      });
    }
  });

  // ATUALIZAR PRODUTO - PUT /api/produtos/:id
  app.put("/api/produtos/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nome, preco, imagem } = req.body;

      const produto = await db.updateProduct(id, { nome, preco, imagem });

      if (!produto) {
        return res.status(404).json({
          sucesso: false,
          erro: "Produto não encontrado",
        });
      }

      return res.status(200).json(produto);
    } catch (erro) {
      console.error("Erro ao atualizar produto:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao atualizar produto",
      });
    }
  });

  // DELETAR PRODUTO - DELETE /api/produtos/:id
  app.delete("/api/produtos/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletado = await db.deleteProduct(id);

      if (!deletado) {
        return res.status(404).json({
          sucesso: false,
          erro: "Produto não encontrado",
        });
      }

      return res.status(200).json({ sucesso: true });
    } catch (erro) {
      console.error("Erro ao deletar produto:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao deletar produto",
      });
    }
  });

  // ============================================================================
  // ENDPOINTS DE VENDAS
  // ============================================================================

  // REGISTRAR VENDA - POST /api/vendas
  app.post("/api/vendas", async (req: Request, res: Response) => {
    try {
      const { userId, productId, quantidade, local, pagamento, parcelas } =
        req.body;

      if (!userId || !productId || !quantidade) {
        return res.status(400).json({
          sucesso: false,
          erro: "Campos obrigatórios não preenchidos",
        });
      }

      const venda = await db.createSale({
        userId,
        productId,
        quantidade,
        data: new Date().toISOString(),
        local,
        pagamento,
        parcelas,
      });

      return res.status(201).json(venda);
    } catch (erro) {
      console.error("Erro ao registrar venda:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao registrar venda",
      });
    }
  });

  // LISTAR VENDAS - GET /api/vendas
  app.get("/api/vendas", async (req: Request, res: Response) => {
    try {
      const vendas = await db.getAllSales();
      return res.status(200).json(vendas);
    } catch (erro) {
      console.error("Erro ao listar vendas:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar vendas",
      });
    }
  });

  // VENDAS POR USUÁRIO - GET /api/vendas/usuario/:userId
  app.get("/api/vendas/usuario/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const vendas = await db.getSalesByUserId(userId);
      return res.status(200).json(vendas);
    } catch (erro) {
      console.error("Erro ao listar vendas:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar vendas",
      });
    }
  });

  // ============================================================================
  // ENDPOINTS DE DOAÇÕES
  // ============================================================================

  // REGISTRAR DOAÇÃO - POST /api/doacoes
  app.post("/api/doacoes", async (req: Request, res: Response) => {
    try {
      const { userId, tipo, valor, nomeDiador, telefoneDiador } = req.body;

      if (!userId || !tipo || valor === undefined) {
        return res.status(400).json({
          sucesso: false,
          erro: "Campos obrigatórios não preenchidos",
        });
      }

      const doacao = await db.createDonation({
        userId,
        tipo,
        valor,
        data: new Date().toISOString(),
        nomeDiador,
        telefoneDiador,
      });

      return res.status(201).json(doacao);
    } catch (erro) {
      console.error("Erro ao registrar doação:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao registrar doação",
      });
    }
  });

  // LISTAR DOAÇÕES - GET /api/doacoes
  app.get("/api/doacoes", async (req: Request, res: Response) => {
    try {
      const doacoes = await db.getAllDonations();
      return res.status(200).json(doacoes);
    } catch (erro) {
      console.error("Erro ao listar doações:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar doações",
      });
    }
  });

  // DOAÇÕES POR USUÁRIO - GET /api/doacoes/usuario/:userId
  app.get("/api/doacoes/usuario/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const doacoes = await db.getDonationsByUserId(userId);
      return res.status(200).json(doacoes);
    } catch (erro) {
      console.error("Erro ao listar doações:", erro);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao buscar doações",
      });
    }
  });

  return app;
}
