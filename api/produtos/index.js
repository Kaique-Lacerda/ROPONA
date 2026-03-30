// api/produtos/index.js
// Handler para GET /api/produtos (listar produtos) e POST /api/produtos (criar produto)

import { MongoClient } from "mongodb";

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
      // GET /api/produtos - Lista produtos, com filtro opcional por categoria
      const { categoria } = req.query;
      const filter = categoria ? { categoria } : {}; // Filtro vazio se não houver categoria
      const produtos = await db.collection("produtos").find(filter).toArray();

      res.status(200).json(produtos); // Retorna array de produtos

    } else if (req.method === "POST") {
      // POST /api/produtos - Cria novo produto
      const { nome, descricao, preco, categoria, imagem } = req.body;

      // Validação: campos obrigatórios
      if (!nome || !descricao || !preco || !categoria || !imagem) {
        return res.status(400).json({ error: "Campos obrigatórios: nome, descricao, preco, categoria, imagem" });
      }

      // Validação adicional: preco deve ser número
      if (typeof preco !== "number" || preco <= 0) {
        return res.status(400).json({ error: "Preco deve ser um número positivo" });
      }

      // Cria o produto
      const produto = { nome, descricao, preco, categoria, imagem };
      const result = await db.collection("produtos").insertOne(produto);

      // Retorna o produto criado com _id
      res.status(201).json({ ...produto, _id: result.insertedId });

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