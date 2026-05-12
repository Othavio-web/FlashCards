import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import Card from './Card';
import { z } from 'zod';
import { testarConexao, sincronizarBanco } from './banco';

dotenv.config();

const ALLOWED_CATEGORIES = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'TypeScript', 'Python'] as const;
const categoryEnum = z.enum(ALLOWED_CATEGORIES);

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT deve ser um número').default('3000')
});

const cardCreateSchema = z.object({
  category: categoryEnum,
  question: z.string().min(1, 'Question é obrigatório'),
  answer: z.string().min(1, 'Answer é obrigatório')
});

const cardUpdateSchema = cardCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Ao menos um campo deve ser informado' }
);

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número').transform(Number)
});

const categoryParamSchema = z.object({
  category: categoryEnum
});

const FRONTEND_DIR = path.join(__dirname, '../../frontend');
const app: Express = express();
const { PORT } = envSchema.parse(process.env);

function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }
    req.body = result.data;
    next();
  };
}

function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues });
      return;
    }
    req.params = result.data as any;
    next();
  };
}

function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// 🔌 INICIALIZAR BANCO DE DADOS
async function seedDatabase(): Promise<void> {
  const count = await Card.count();
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
    await Card.bulkCreate(seedCards);
    console.log(`✅ Seed criado com ${seedCards.length} cards.`);
  }
}

async function inicializarBanco(): Promise<void> {
  await testarConexao();
  await sincronizarBanco();
  await seedDatabase();
}

// ===== ROTAS DO CRUD =====

// 📖 GET: Listar todos os cards
app.get('/api/cards', async (_req: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar cards: ${(error as Error).message}` });
  }
});

// 📖 GET: Listar cards por categoria
app.get(
  '/api/cards/category/:category',
  validateParams(categoryParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cards = await Card.findAll({
        where: { category: req.params.category },
        order: [['createdAt', 'DESC']]
      });
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar cards: ${(error as Error).message}` });
    }
  }
);

// ➕ POST: Adicionar novo card
app.post('/api/cards', validateBody(cardCreateSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, question, answer } = req.body;

    const newCard = await Card.create({
      category,
      question,
      answer
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: `Erro ao adicionar card: ${(error as Error).message}` });
  }
});

// 📝 PUT: Editar um card
app.put(
  '/api/cards/:id',
  validateParams(idParamSchema),
  validateBody(cardUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, question, answer } = req.body;
      const cardId = (req.params as any).id as number;

      const card = await Card.findByPk(cardId);
      if (!card) {
        res.status(404).json({ error: 'Card não encontrado' });
        return;
      }

      if (category) card.category = category;
      if (question) card.question = question;
      if (answer) card.answer = answer;

      await card.save();
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: `Erro ao editar card: ${(error as Error).message}` });
    }
  }
);

// 🗑️ DELETE: Deletar um card
app.delete(
  '/api/cards/:id',
  validateParams(idParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cardId = (req.params as any).id as number;

      const card = await Card.findByPk(cardId);
      if (!card) {
        res.status(404).json({ error: 'Card não encontrado' });
        return;
      }

      await card.destroy();
      res.json({ message: 'Card deletado com sucesso', card });
    } catch (error) {
      res.status(500).json({ error: `Erro ao deletar card: ${(error as Error).message}` });
    }
  }
);

// 🏠 Servir frontend para todas as rotas não-API
app.get('*', (req: Request, res: Response): void => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Rota de API não encontrada' });
    return;
  }
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.use(errorHandler);

// Iniciar servidor
async function iniciar(): Promise<void> {
  await inicializarBanco();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Acesse: http://localhost:${PORT}/api/cards`);
    console.log('⏳ Aguardando requisições...');
  });
}

iniciar();
