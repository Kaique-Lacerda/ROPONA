const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Produto = require('./models/Produto');

const app = express();

// Middleware
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Debug requests
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url, 'Origin:', req.headers.origin);
  next();
});

app.use(cors());

// Conexão com MongoDB
const uri = "mongodb+srv://kaiqueglacerda_db_user:zd8NBILO6tWBQS8J@cluster0.dga1hcd.mongodb.net/loja?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log("Erro ao conectar:", err));

// Rotas

// Rota raiz para teste
app.get('/', (req, res) => {
  res.json({ message: 'API OblivionWear funcionando!', status: 'ok' });
});

// Criar produto
app.post('/produtos', async (req, res) => {
  try {
    const produto = new Produto(req.body);
    const savedProduto = await produto.save();
    res.status(201).json(savedProduto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar produtos (com filtro opcional por categoria)
app.get('/produtos', async (req, res) => {
  try {
    const { categoria } = req.query;
    const filter = categoria ? { categoria } : {};
    const produtos = await Produto.find(filter);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar produto por ID
app.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});