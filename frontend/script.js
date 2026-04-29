// 🎮 LÓGICA DO FRONTEND

let currentCards = [];
let currentIndex = 0;
let editingCardId = null;

const cardElement = document.getElementById('card');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const categoryFilter = document.getElementById('categoryFilter');
const addCardForm = document.getElementById('addCardForm');
const cardsList = document.getElementById('cardsList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const feedbackElement = document.getElementById('feedback');
const editModal = document.getElementById('editModal');
const editCardForm = document.getElementById('editCardForm');
const editCategoryInput = document.getElementById('editCategory');
const editFrontInput = document.getElementById('editFront');
const editBackInput = document.getElementById('editBack');
const closeEditModalBtn = document.getElementById('closeEditModal');

function showFeedback(message, type = 'success') {
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback ${type}`;
  feedbackElement.classList.remove('hidden');
  if (type !== 'loading') {
    setTimeout(() => {
      feedbackElement.classList.add('hidden');
    }, 3500);
  }
}

function clearFeedback() {
  feedbackElement.className = 'feedback hidden';
  feedbackElement.textContent = '';
}

function setLoading(isLoading) {
  if (isLoading) {
    showFeedback('Carregando...', 'loading');
  } else {
    clearFeedback();
  }

  const allControls = document.querySelectorAll('button, input, textarea, select');
  allControls.forEach((control) => {
    control.disabled = isLoading;
  });
}

function validateCardForm(category, front, back) {
  if (!category.trim() || !front.trim() || !back.trim()) {
    showFeedback('Preencha todos os campos antes de enviar.', 'error');
    return false;
  }
  return true;
}

async function loadCards() {
  setLoading(true);
  const selectedCategory = categoryFilter.value;

  if (selectedCategory) {
    currentCards = await getCardsByCategory(selectedCategory);
  } else {
    currentCards = await getAllCards();
  }

  currentIndex = 0;

  if (currentCards.length > 0) {
    showCard(currentIndex);
  } else {
    questionElement.textContent = 'Nenhum card encontrado';
    answerElement.textContent = '';
  }

  await renderCardsList();
  setLoading(false);
}

function showCard(index) {
  if (currentCards.length === 0) return;

  const card = currentCards[index];
  questionElement.textContent = card.front;
  answerElement.textContent = card.back;
  cardElement.classList.remove('flipped');
}

function nextCard() {
  if (currentCards.length === 0) return;
  currentIndex = (currentIndex + 1) % currentCards.length;
  showCard(currentIndex);
}

function prevCard() {
  if (currentCards.length === 0) return;
  currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
  showCard(currentIndex);
}

cardElement.addEventListener('click', () => {
  cardElement.classList.toggle('flipped');
});

addCardForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('newCategory').value;
  const front = document.getElementById('newFront').value;
  const back = document.getElementById('newBack').value;

  if (!validateCardForm(category, front, back)) return;

  setLoading(true);
  const newCard = await addCard(category, front, back);
  setLoading(false);

  if (newCard) {
    showFeedback('✅ Card adicionado com sucesso!', 'success');
    addCardForm.reset();
    await loadCards();
  }
});

async function renderCardsList() {
  const allCards = currentCards;

  if (allCards.length === 0) {
    cardsList.innerHTML = '<p>Nenhum card disponível</p>';
    return;
  }

  cardsList.innerHTML = '';

  allCards.forEach((card) => {
    const cardItem = document.createElement('div');
    cardItem.className = 'card-item';
    cardItem.innerHTML = `
      <div class="card-info">
        <strong>${card.category}</strong>
        <p>${card.front}</p>
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick="editCard(${card.id})">✏️ Editar</button>
        <button class="btn-delete" onclick="deleteCardHandler(${card.id})">🗑️ Deletar</button>
      </div>
    `;
    cardsList.appendChild(cardItem);
  });
}

async function deleteCardHandler(id) {
  if (confirm('Tem certeza que deseja deletar este card?')) {
    setLoading(true);
    const response = await deleteCard(id);
    setLoading(false);
    if (response) {
      showFeedback('✅ Card deletado com sucesso!', 'success');
      await loadCards();
    }
  }
}

async function editCard(id) {
  let card = currentCards.find((c) => c.id === id);
  if (!card) {
    const allCards = await getAllCards();
    card = allCards.find((c) => c.id === id);
  }

  if (!card) {
    showFeedback('Card não encontrado.', 'error');
    return;
  }

  editingCardId = id;
  editCategoryInput.value = card.category;
  editFrontInput.value = card.front;
  editBackInput.value = card.back;
  openEditModal();
}

function openEditModal() {
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingCardId = null;
  editCardForm.reset();
}

editCardForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = editCategoryInput.value;
  const front = editFrontInput.value;
  const back = editBackInput.value;

  if (!validateCardForm(category, front, back)) return;

  if (!editingCardId) {
    showFeedback('Erro ao identificar card para edição.', 'error');
    return;
  }

  setLoading(true);
  const updatedCard = await updateCard(editingCardId, category, front, back);
  setLoading(false);

  if (updatedCard) {
    showFeedback('✅ Card atualizado com sucesso!', 'success');
    closeEditModal();
    await loadCards();
  }
});

closeEditModalBtn.addEventListener('click', closeEditModal);
editModal.addEventListener('click', (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

prevBtn.addEventListener('click', prevCard);
nextBtn.addEventListener('click', nextCard);
categoryFilter.addEventListener('change', loadCards);

window.addEventListener('DOMContentLoaded', loadCards);
