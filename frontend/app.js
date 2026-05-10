const { useState, useEffect } = React;

function FlashcardsApp() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ category: '', question: '', answer: '' });

  const API_URL = '/api';
  const CATEGORIES = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'TypeScript', 'Python'];

  // Carregar cards
  const loadCards = async (selectedCategory = '') => {
    setLoading(true);
    try {
      const url = selectedCategory 
        ? `${API_URL}/cards/category/${selectedCategory}`
        : `${API_URL}/cards`;
      const response = await fetch(url);
      const data = await response.json();
      setCards(data);
      filterCards(data, selectedCategory);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (error) {
      showFeedback('Erro ao carregar cards', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterCards = (allCards, cat) => {
    if (cat) {
      setFilteredCards(allCards.filter(c => c.category === cat));
    } else {
      setFilteredCards(allCards);
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    loadCards(newCategory);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.question || !formData.answer) {
      showFeedback('Preencha todos os campos', 'error');
      return;
    }

    setLoading(true);
    try {
      const method = editingCard ? 'PUT' : 'POST';
      const url = editingCard 
        ? `${API_URL}/cards/${editingCard.id}`
        : `${API_URL}/cards`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showFeedback(editingCard ? '✅ Card atualizado!' : '✅ Card adicionado!', 'success');
        setFormData({ category: '', question: '', answer: '' });
        setEditingCard(null);
        setShowForm(false);
        await loadCards(category);
      }
    } catch (error) {
      showFeedback('Erro ao salvar card', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este card?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cards/${id}`, { method: 'DELETE' });
      if (response.ok) {
        showFeedback('✅ Card deletado!', 'success');
        await loadCards(category);
      }
    } catch (error) {
      showFeedback('Erro ao deletar card', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({ category: card.category, question: card.question, answer: card.answer });
    setShowForm(true);
  };

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    loadCards();
  }, []);

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">📚 Flashcards</h1>
          <p className="text-indigo-100">Aprenda enquanto estuda</p>
        </div>

        {/* Feedback */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-semibold transition ${
            feedback.type === 'success' ? 'bg-green-100 text-green-700' :
            feedback.type === 'error' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {feedback.message}
          </div>
        )}

        {/* Container Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Seletor de Categoria */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔖 Categoria
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">Todas</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Card Flipper */}
          {filteredCards.length > 0 ? (
            <>
              <div 
                className={`flip-card cursor-pointer mb-8 ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped(!flipped)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    {currentCard?.question}
                  </div>
                  <div className="flip-card-back">
                    {currentCard?.answer}
                  </div>
                </div>
              </div>

              {/* Info e Controles */}
              <div className="text-center mb-6">
                <p className="text-gray-600 font-semibold mb-4">
                  {currentIndex + 1} de {filteredCards.length}
                </p>
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0 || loading}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition font-semibold"
                  >
                    ⬅️ Anterior
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredCards.length - 1 || loading}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition font-semibold"
                  >
                    Próximo ➡️
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleEditCard(currentCard)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDeleteCard(currentCard.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  🗑️ Deletar
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum card encontrado</p>
            </div>
          )}
        </div>

        {/* Grid de Cards da Categoria */}
        {filteredCards.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">🎴 Cards da Categoria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map(card => (
                <div key={card.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition">
                  <p className="font-semibold text-gray-700 mb-2">{card.question}</p>
                  <p className="text-sm text-gray-600 mb-3">{card.answer}</p>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {card.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ category: '', question: '', answer: '' });
              setEditingCard(null);
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition font-bold text-lg mb-6"
          >
            {showForm ? '❌ Cancelar' : '➕ Adicionar Novo Card'}
          </button>

          {showForm && (
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pergunta</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  rows="3"
                  placeholder="Digite a pergunta..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resposta</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  rows="3"
                  placeholder="Digite a resposta..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-bold"
              >
                {editingCard ? '✏️ Atualizar Card' : '💾 Salvar Card'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FlashcardsApp />);