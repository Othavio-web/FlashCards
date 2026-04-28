// 🎮 LÓGICA DO FRONTEND

let currentCards = [];
let currentIndex = 0;

const cardElement = document.getElementById('card');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const categoryFilter = document.getElementById('categoryFilter');
const addCardForm = document.getElementById('addCardForm');
const cardsList = document.getElementById('cardsList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ===== CARREGAR CARDS =====

async function loadCards() {
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
  
  renderCardsList();
}

// ===== EXIBIR CARD =====

function showCard(index) {
  if (currentCards.length === 0) return;
  
  const card = currentCards[index];
  questionElement.textContent = card.front;
  answerElement.textContent = card.back;
  cardElement.classList.remove('flipped');
  
  // Mostrar posição atual
  console.log(`Card ${index + 1} de ${currentCards.length}`);
}

// ===== NAVEGAÇÃO =====

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

// ===== VIRAR CARD =====

cardElement.addEventListener('click', () => {
  cardElement.classList.toggle('flipped');
});

// ===== ADICIONAR NOVO CARD =====

addCardForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const category = document.getElementById('newCategory').value;
  const front = document.getElementById('newFront').value;
  const back = document.getElementById('newBack').value;
  
  const newCard = await addCard(category, front, back);
  
  if (newCard) {
    alert('✅ Card adicionado com sucesso!');
    addCardForm.reset();
    loadCards(); // Recarregar lista
  }
});

// ===== RENDERIZAR LISTA DE CARDS =====

async function renderCardsList() {
  const allCards = await getAllCards();
  
  if (allCards.length === 0) {
    cardsList.innerHTML = '<p>Nenhum card disponível</p>';
    return;
  }
  
  cardsList.innerHTML = '';
  
  allCards.forEach(card => {
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

// ===== DELETAR CARD =====

async function deleteCardHandler(id) {
  if (confirm('Tem certeza que deseja deletar este card?')) {
    await deleteCard(id);
    alert('✅ Card deletado!');
    loadCards();
  }
}

// ===== EDITAR CARD (Básico) =====

async function editCard(id) {
  const card = currentCards.find(c => c.id === id);
  if (!card) {
    const allCards = await getAllCards();
    card = allCards.find(c => c.id === id);
  }
  
  const newFront = prompt('Nova pergunta:', card.front);
  if (newFront === null) return;
  
  const newBack = prompt('Nova resposta:', card.back);
  if (newBack === null) return;
  
  await updateCard(id, card.category, newFront, newBack);
  alert('✅ Card atualizado!');
  loadCards();
}

// ===== EVENT LISTENERS =====

prevBtn.addEventListener('click', prevCard);
nextBtn.addEventListener('click', nextCard);
categoryFilter.addEventListener('change', loadCards);

// ===== INICIALIZAR =====

window.addEventListener('DOMContentLoaded', loadCards);