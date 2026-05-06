import { ApiClient } from './api.js';
import { CardManager } from './cardManager.js';
import { UIController } from './uiController.js';

const api = new ApiClient('/api');
const cardManager = new CardManager(api);
const ui = new UIController(cardManager, api);

async function init() {
  ui.bindEvents({
    onPrev: handlePrevCard,
    onNext: handleNextCard,
    onCategoryChange: handleCategoryChange,
    onAddCard: handleAddCard,
    onDeleteCard: handleDeleteCard,
    onEditCard: handleEditCard,
    onUpdateCard: handleUpdateCard,
    onCloseModal: () => ui.closeEditModal()
  });

  await loadCards();
}

async function loadCards() {
  ui.setLoading(true);
  try {
    await cardManager.loadCards(ui.categoryFilter.value);
    ui.renderCardsList();
    ui.renderCardsGrid();
    ui.showCard();
  } catch (error) {
    console.error(error);
    ui.showFeedback('Erro ao carregar cards.', 'error');
  } finally {
    ui.setLoading(false);
  }
}

function handlePrevCard() {
  cardManager.prev();
  ui.showCard();
}

function handleNextCard() {
  cardManager.next();
  ui.showCard();
}

async function handleCategoryChange() {
  await loadCards();
}

async function handleAddCard({ category, front, back }) {
  if (!ui.validateCardForm(category, front, back)) return;

  ui.setLoading(true);
  try {
    await api.addCard(category, front, back);
    ui.showFeedback('✅ Card adicionado com sucesso!', 'success');
    ui.addCardForm.reset();
    await loadCards();
  } catch (error) {
    console.error(error);
    ui.showFeedback('Erro ao adicionar card.', 'error');
  } finally {
    ui.setLoading(false);
  }
}

async function handleDeleteCard(id) {
  if (!confirm('Tem certeza que deseja deletar este card?')) return;

  ui.setLoading(true);
  try {
    await api.deleteCard(id);
    ui.showFeedback('✅ Card deletado com sucesso!', 'success');
    await loadCards();
  } catch (error) {
    console.error(error);
    ui.showFeedback('Erro ao deletar card.', 'error');
  } finally {
    ui.setLoading(false);
  }
}

async function handleEditCard(id) {
  let card = cardManager.findCardById(id);
  if (!card) {
    const allCards = await api.getAllCards();
    card = allCards.find((c) => c.id === id);
  }

  if (!card) {
    ui.showFeedback('Card não encontrado.', 'error');
    return;
  }

  ui.fillEditForm(card);
}

async function handleUpdateCard({ id, category, front, back }) {
  if (!ui.validateCardForm(category, front, back)) return;

  ui.setLoading(true);
  try {
    await api.updateCard(id, category, front, back);
    ui.showFeedback('✅ Card atualizado com sucesso!', 'success');
    ui.closeEditModal();
    await loadCards();
  } catch (error) {
    console.error(error);
    ui.showFeedback('Erro ao atualizar card.', 'error');
  } finally {
    ui.setLoading(false);
  }
}

window.addEventListener('DOMContentLoaded', init);
