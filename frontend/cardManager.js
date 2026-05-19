export class CardManager {
  constructor(apiClient) {
    this.api = apiClient;
    this.currentCards = [];
    this.currentIndex = 0;
  }

  async loadCards(category = '') {
    this.currentCards = category
      ? await this.api.getCardsByCategory(category)
      : await this.api.getAllCards();
    this.currentIndex = 0;
  }

  getCurrentCard() {
    return this.currentCards[this.currentIndex] || null;
  }

  getCards() {
    return this.currentCards;
  }

  next() {
    if (!this.currentCards.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.currentCards.length;
  }

  prev() {
    if (!this.currentCards.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.currentCards.length) % this.currentCards.length;
  }

  findCardById(id) {
    return this.currentCards.find(card => card.id === id);
  }
}
