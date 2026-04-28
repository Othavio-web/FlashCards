// 🔌 API CLIENT - Funções para comunicar com o backend

const API_URL = 'http://localhost:3000/api';

// ✅ GET: Listar todos os cards
async function getAllCards() {
  try {
    const response = await fetch(`${API_URL}/cards`);
    if (!response.ok) throw new Error('Erro ao buscar cards');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

// ✅ GET: Listar cards por categoria
async function getCardsByCategory(category) {
  try {
    const response = await fetch(`${API_URL}/cards/category/${category}`);
    if (!response.ok) throw new Error('Erro ao buscar cards');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

// ➕ POST: Adicionar novo card
async function addCard(category, front, back) {
  try {
    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, front, back })
    });
    if (!response.ok) throw new Error('Erro ao adicionar card');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao adicionar card');
    return null;
  }
}

// 📝 PUT: Editar um card
async function updateCard(id, category, front, back) {
  try {
    const response = await fetch(`${API_URL}/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, front, back })
    });
    if (!response.ok) throw new Error('Erro ao editar card');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao editar card');
    return null;
  }
}

// 🗑️ DELETE: Deletar um card
async function deleteCard(id) {
  try {
    const response = await fetch(`${API_URL}/cards/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao deletar card');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao deletar card');
    return null;
  }
}
