// 🔌 API CLIENT - Funções para comunicar com o backend

const API_URL = '/api';

export class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, options);
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json();
  }

  getAllCards() {
    return this.request('/cards');
  }

  getCardsByCategory(category) {
    return this.request(`/cards/category/${category}`);
  }

  addCard(category, front, back) {
    return this.request('/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, front, back })
    });
  }

  updateCard(id, category, front, back) {
    return this.request(`/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, front, back })
    });
  }

  deleteCard(id) {
    return this.request(`/cards/${id}`, {
      method: 'DELETE'
    });
  }
}
