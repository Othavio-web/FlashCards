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

  addCard(category, question, answer) {
    return this.request('/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, front: question, back: answer })
    });
  }

  updateCard(id, category, question, answer) {
    return this.request(`/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, front: question, back: answer })
    });
  }

  deleteCard(id) {
    return this.request(`/cards/${id}`, {
      method: 'DELETE'
    });
  }
}
