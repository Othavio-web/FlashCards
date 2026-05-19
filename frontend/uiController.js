export class UIController {
  constructor(cardManager, apiClient) {
    this.cardManager = cardManager;
    this.api = apiClient;

    this.cardElement = document.getElementById('card');
    this.questionElement = document.getElementById('question');
    this.answerElement = document.getElementById('answer');
    this.cardsList = document.getElementById('cardsList');
    this.cardsGrid = document.getElementById('cardsGrid');
    this.feedbackElement = document.getElementById('feedback');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.addCardForm = document.getElementById('addCardForm');
    this.newCategory = document.getElementById('newCategory');
    this.newFront = document.getElementById('newFront');
    this.newBack = document.getElementById('newBack');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.editModal = document.getElementById('editModal');
    this.editCardForm = document.getElementById('editCardForm');
    this.editCategoryInput = document.getElementById('editCategory');
    this.editFrontInput = document.getElementById('editFront');
    this.editBackInput = document.getElementById('editBack');
    this.closeEditModalBtn = document.getElementById('closeEditModal');
    this.editingCardId = null;
  }

  validateCardForm(category, front, back) {
    if (!category.trim() || !front.trim() || !back.trim()) {
      this.showFeedback('Preencha todos os campos antes de enviar.', 'error');
      return false;
    }
    return true;
  }

  showFeedback(message, type = 'success') {
    this.feedbackElement.textContent = message;
    this.feedbackElement.className = `feedback ${type}`;
    this.feedbackElement.classList.remove('hidden');

    if (type !== 'loading') {
      setTimeout(() => {
        this.feedbackElement.classList.add('hidden');
      }, 3500);
    }
  }

  clearFeedback() {
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'feedback hidden';
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.showFeedback('Carregando...', 'loading');
    } else {
      this.clearFeedback();
    }

    const controls = document.querySelectorAll('button, input, textarea, select');
    controls.forEach((control) => {
      control.disabled = isLoading;
    });
  }

  showCard() {
    const card = this.cardManager.getCurrentCard();
    if (!card) {
      this.questionElement.textContent = 'Nenhum card encontrado';
      this.answerElement.textContent = '';
      return;
    }

    this.questionElement.textContent = card.front;
    this.answerElement.textContent = card.back;
    this.cardElement.classList.remove('flipped');
  }

  renderCardsList() {
    const cards = this.cardManager.getCards();
    if (!cards.length) {
      this.cardsList.innerHTML = '<p>Nenhum card disponível</p>';
      return;
    }

    this.cardsList.innerHTML = cards
      .map((card) => `
        <div class="card-item">
          <div class="card-info">
            <strong>${card.category}</strong>
            <p>${card.front}</p>
          </div>
          <div class="card-actions">
            <button class="btn-edit" data-edit="${card.id}">✏️ Editar</button>
            <button class="btn-delete" data-delete="${card.id}">🗑️ Deletar</button>
          </div>
        </div>
      `)
      .join('');
  }

  renderCardsGrid() {
    const cards = this.cardManager.getCards();
    if (!cards.length) {
      this.cardsGrid.innerHTML = '<p>Nenhum card disponível</p>';
      return;
    }

    this.cardsGrid.innerHTML = cards
      .map((card) => `
        <div class="card-mini">
          <div class="inner">
            <div class="face front"><div>${card.front}</div></div>
            <div class="face back"><div>${card.back}</div></div>
          </div>
        </div>
      `)
      .join('');

    this.cardsGrid.querySelectorAll('.card-mini').forEach((cardMini) => {
      cardMini.addEventListener('click', () => {
        cardMini.classList.toggle('flipped');
      });
    });
  }

  fillEditForm(card) {
    this.editingCardId = card.id;
    this.editCategoryInput.value = card.category;
    this.editFrontInput.value = card.front;
    this.editBackInput.value = card.back;
    this.openEditModal();
  }

  openEditModal() {
    this.editModal.classList.remove('hidden');
  }

  closeEditModal() {
    this.editingCardId = null;
    this.editCardForm.reset();
    this.editModal.classList.add('hidden');
  }

  bindEvents(actions) {
    this.cardElement.addEventListener('click', () => {
      this.cardElement.classList.toggle('flipped');
    });

    this.prevBtn.addEventListener('click', actions.onPrev);
    this.nextBtn.addEventListener('click', actions.onNext);
    this.categoryFilter.addEventListener('change', actions.onCategoryChange);

    this.addCardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      actions.onAddCard({
        category: this.newCategory.value,
        front: this.newFront.value,
        back: this.newBack.value
      });
    });

    this.cardsList.addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit]');
      const deleteButton = event.target.closest('[data-delete]');

      if (editButton) {
        actions.onEditCard(Number(editButton.dataset.edit));
      }

      if (deleteButton) {
        actions.onDeleteCard(Number(deleteButton.dataset.delete));
      }
    });

    this.editCardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.editingCardId) {
        this.showFeedback('Erro ao identificar card para edição.', 'error');
        return;
      }

      actions.onUpdateCard({
        id: this.editingCardId,
        category: this.editCategoryInput.value,
        front: this.editFrontInput.value,
        back: this.editBackInput.value
      });
    });

    this.closeEditModalBtn.addEventListener('click', actions.onCloseModal);
    this.editModal.addEventListener('click', (event) => {
      if (event.target === this.editModal) {
        actions.onCloseModal();
      }
    });
  }
}
