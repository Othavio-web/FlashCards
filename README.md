## 🗄️ Banco de Dados

A aplicação usa **SQLite** com **Sequelize** (ORM):

- **SQLite**: Banco de dados local (arquivo `database.sqlite`)
- **Sequelize**: ORM para interagir com o banco
- **Sem necessidade de servidor externo** - funciona localmente!

## 📁 Estrutura do Projeto

```
FlashCards/
├── backend/
│   ├── server.js          (Servidor Express)
│   ├── package.json       (Dependências)
│   └── data/
│       └── cards.json     (Banco de dados)
├── frontend/
│   ├── index.html         (Interface)
│   ├── script.js          (Lógica principal)
│   ├── api.js             (Cliente HTTP)
│   └── styles.css         (Estilos)
└── README.md
```

---

## 🚀 Como Começar

### **1️⃣ Instalar dependências do Backend**

```bash
cd backend
npm install
```

Isso vai instalar:
- ✅ **Express** - framework web
- ✅ **CORS** - comunicação entre front-back
- ✅ **Sequelize** - ORM para SQLite
- ✅ **SQLite3** - banco de dados local

### **2️⃣ Iniciar o Servidor Backend**

```bash
npm start
```

Você verá:
```
✅ Conexão com SQLite estabelecida com sucesso!
✅ Banco de dados sincronizado!
🚀 Servidor rodando em http://localhost:3000
📚 Acesse: http://localhost:3000/api/cards
```

O arquivo `database.sqlite` será criado automaticamente! 🎉

### **3️⃣ Abrir o Frontend**

Abra o arquivo `frontend/index.html` no navegador ou use um servidor local:

```bash
# Alternativa: usar Python
cd frontend
python -m http.server 8000

# Ou usar Node.js
npx http-server frontend -p 8000
```

Acesse: `http://localhost:8000`

---

## 📖 Como Funciona

### **Backend (server.js)**

O backend é uma **API REST** que gerencia os flashcards:

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/cards` | Listar todos os cards |
| `GET` | `/api/cards/category/:category` | Listar por categoria |
| `POST` | `/api/cards` | Adicionar novo card |
| `PUT` | `/api/cards/:id` | Editar um card |
| `DELETE` | `/api/cards/:id` | Deletar um card |

### **Frontend (script.js + api.js)**

- **api.js**: Funções que fazem requisições HTTP para o backend
- **script.js**: Lógica da interface (navegação, CRUD, etc)
- **index.html**: Interface do usuário

---

## ✨ Funcionalidades

✅ **Visualizar flashcards** - Clique no card para virar  
✅ **Filtrar por categoria** - Selecione a categoria no dropdown  
✅ **Navegar** - Use os botões Anterior/Próximo  
✅ **Adicionar card** - Preencha o formulário e clique "Adicionar"  
✅ **Editar card** - Clique em ✏️ na lista  
✅ **Deletar card** - Clique em 🗑️ na lista  

---

## 📚 Exemplo de Card no JSON

```json
{
  "id": 1,
  "category": "JavaScript",
  "front": "O que é o this em JavaScript?",
  "back": "this se refere ao contexto de execução atual..."
}
```

---

## 🔧 Próximos Passos (Melhorias)

1. **Banco de Dados** - Substituir JSON por MySQL/MongoDB
2. **Autenticação** - Login de usuários
3. **Temas** - Modo claro/escuro
4. **Deploy** - Publicar online (Vercel, Heroku)
5. **Mobile** - Criar versão mobile

---

## 📝 Licença

Projeto educacional - Rocketseat
