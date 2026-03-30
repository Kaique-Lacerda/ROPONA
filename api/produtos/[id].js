// api/produtos/[id].js
// Handler para GET /api/produtos/:id (buscar produto por ID)

import { MongoClient, ObjectId } from "mongodb";

// URI do MongoDB via variável de ambiente (boa prática para segurança)
const uri = process.env.MONGODB_URI;
let client;

// Função para conectar ao banco (reutiliza conexão se já aberta - prática serverless)
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("loja"); // Banco "loja"
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();

    if (req.method === "GET") {
      // GET /api/produtos/:id - Busca produto pelo ID
      const { id } = req.query;

      // Validação: ID deve ser válido
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const produto = await db.collection("produtos").findOne({ _id: new ObjectId(id) });

      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.status(200).json(produto); // Retorna o produto

    } else {
      // Método não permitido
      res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    // Erro interno (ex.: conexão com DB falhou)
    console.error("Erro na API:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}