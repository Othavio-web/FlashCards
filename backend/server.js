const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Card = require('./Card');
const { sequelize, testarConexao, sincronizarBanco } = require('./banco');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔌 INICIALIZAR BANCO DE DADOS
async function inicializarBanco() {
  await testarConexao();
  await sincronizarBanco();
}

// ===== ROTAS DO CRUD =====

// 📖 GET: Listar todos os cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cards: ' + error.message });
  }
});

// 📖 GET: Listar cards por categoria
app.get('/api/cards/category/:category', async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: { category: req.params.category },
      order: [['createdAt', 'DESC']]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cards: ' + error.message });
  }
});

// ➕ POST: Adicionar novo card
app.post('/api/cards', async (req, res) => {
  try {
    const { category, front, back } = req.body;

    // Validação
    if (!category || !front || !back) {
      return res.status(400).json({ error: 'Category, front e back são obrigatórios' });
    }

    const newCard = await Card.create({
      category,
      front,
      back
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar card: ' + error.message });
  }
});

// 📝 PUT: Editar um card
app.put('/api/cards/:id', async (req, res) => {
  try {
    const { category, front, back } = req.body;
    const cardId = req.params.id;

    const card = await Card.findByPk(cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }

    // Atualizar campos
    if (category) card.category = category;
    if (front) card.front = front;
    if (back) card.back = back;

    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar card: ' + error.message });
  }
});

// 🗑️ DELETE: Deletar um card
app.delete('/api/cards/:id', async (req, res) => {
  try {
    const cardId = req.params.id;

    const card = await Card.findByPk(cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }

    await card.destroy();
    res.json({ message: 'Card deletado com sucesso', card });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar card: ' + error.message });
  }
});

// 🏠 GET: Rota raiz (teste se está funcionando)
app.get('/', (req, res) => {
  res.json({
    message: '✅ API de Flashcards está rodando com SQLite!',
    documentation: 'Acesse http://localhost:3000/api/cards'
  });
});

// Iniciar servidor
async function iniciar() {
  await inicializarBanco();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Acesse: http://localhost:${PORT}/api/cards`);
    console.log('⏳ Aguardando requisições...');
  });
}

iniciar();
