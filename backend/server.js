const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Card = require('./Card');
const { sequelize, testarConexao, sincronizarBanco } = require('./banco');

const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'TypeScript', 'Python'];
const FRONTEND_DIR = path.join(__dirname, '../frontend');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// 🔌 INICIALIZAR BANCO DE DADOS
async function seedDatabase() {
  const count = await Card.count();
  if (count === 0) {
    const seedCards = [
      {
        category: 'JavaScript',
        front: 'O que é hoisting em JavaScript?',
        back: 'Hoisting é o comportamento de mover declarações para o topo do escopo durante a fase de compilação.'
      },
      {
        category: 'React',
        front: 'O que é um hook useState?',
        back: 'useState permite adicionar estado local ao componente funcional.'
      },
      {
        category: 'Node.js',
        front: 'Para que serve o Express?',
        back: 'Express é um framework web para criar rotas e APIs em Node.js de forma simples.'
      }
    ];
    await Card.bulkCreate(seedCards);
    console.log(`✅ Seed criado com ${seedCards.length} cards.`);
  }
}

async function inicializarBanco() {
  await testarConexao();
  await sincronizarBanco();
  await seedDatabase();
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

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Categoria inválida. Use uma categoria de programação fixa.' });
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

    // Validação de categoria fixa
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Categoria inválida. Use uma categoria de programação fixa.' });
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

// 🏠 Servir frontend para todas as rotas não-API
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Rota de API não encontrada' });
  }
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
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
