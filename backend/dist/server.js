"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const Card_1 = __importDefault(require("./Card"));
const banco_1 = require("./banco");
dotenv_1.default.config();
const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'TypeScript', 'Python'];
const FRONTEND_DIR = path_1.default.join(__dirname, '../../frontend');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(FRONTEND_DIR));
// 🔌 INICIALIZAR BANCO DE DADOS
async function seedDatabase() {
    const count = await Card_1.default.count();
    if (count === 0) {
        const seedCards = [
            {
                category: 'JavaScript',
                question: 'O que é hoisting em JavaScript?',
                answer: 'Hoisting é o comportamento de mover declarações para o topo do escopo durante a fase de compilação.'
            },
            {
                category: 'React',
                question: 'O que é um hook useState?',
                answer: 'useState permite adicionar estado local ao componente funcional.'
            },
            {
                category: 'Node.js',
                question: 'Para que serve o Express?',
                answer: 'Express é um framework web para criar rotas e APIs em Node.js de forma simples.'
            }
        ];
        await Card_1.default.bulkCreate(seedCards);
        console.log(`✅ Seed criado com ${seedCards.length} cards.`);
    }
}
async function inicializarBanco() {
    await (0, banco_1.testarConexao)();
    await (0, banco_1.sincronizarBanco)();
    await seedDatabase();
}
// ===== ROTAS DO CRUD =====
// 📖 GET: Listar todos os cards
app.get('/api/cards', async (_req, res) => {
    try {
        const cards = await Card_1.default.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(cards);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao buscar cards: ${error.message}` });
    }
});
// 📖 GET: Listar cards por categoria
app.get('/api/cards/category/:category', async (req, res) => {
    try {
        const cards = await Card_1.default.findAll({
            where: { category: req.params.category },
            order: [['createdAt', 'DESC']]
        });
        res.json(cards);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao buscar cards: ${error.message}` });
    }
});
// ➕ POST: Adicionar novo card
app.post('/api/cards', async (req, res) => {
    try {
        const { category, question, answer } = req.body;
        // Validação
        if (!category || !question || !answer) {
            res.status(400).json({ error: 'Category, question e answer são obrigatórios' });
            return;
        }
        if (!ALLOWED_CATEGORIES.includes(category)) {
            res.status(400).json({ error: 'Categoria inválida. Use uma categoria de programação fixa.' });
            return;
        }
        const newCard = await Card_1.default.create({
            category,
            question,
            answer
        });
        res.status(201).json(newCard);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao adicionar card: ${error.message}` });
    }
});
// 📝 PUT: Editar um card
app.put('/api/cards/:id', async (req, res) => {
    try {
        const { category, question, answer } = req.body;
        const cardId = parseInt(req.params.id, 10);
        const card = await Card_1.default.findByPk(cardId);
        if (!card) {
            res.status(404).json({ error: 'Card não encontrado' });
            return;
        }
        // Validação de categoria fixa
        if (category && !ALLOWED_CATEGORIES.includes(category)) {
            res.status(400).json({ error: 'Categoria inválida. Use uma categoria de programação fixa.' });
            return;
        }
        // Atualizar campos
        if (category)
            card.category = category;
        if (question)
            card.question = question;
        if (answer)
            card.answer = answer;
        await card.save();
        res.json(card);
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao editar card: ${error.message}` });
    }
});
// 🗑️ DELETE: Deletar um card
app.delete('/api/cards/:id', async (req, res) => {
    try {
        const cardId = parseInt(req.params.id, 10);
        const card = await Card_1.default.findByPk(cardId);
        if (!card) {
            res.status(404).json({ error: 'Card não encontrado' });
            return;
        }
        await card.destroy();
        res.json({ message: 'Card deletado com sucesso', card });
    }
    catch (error) {
        res.status(500).json({ error: `Erro ao deletar card: ${error.message}` });
    }
});
// 🏠 Servir frontend para todas as rotas não-API
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Rota de API não encontrada' });
        return;
    }
    res.sendFile(path_1.default.join(FRONTEND_DIR, 'index.html'));
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
//# sourceMappingURL=server.js.map