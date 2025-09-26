const BACKEND_URL = 'http://localhost:5555';
const API_BASE = `${BACKEND_URL}/api`;

export const orderService = {
  async getOrders(userId = null) {
    const url = userId ? `${API_BASE}/orders/?user_id=${userId}` : `${API_BASE}/orders/`;
    const response = await fetch(url);
    return response.json();
  },

  async createOrder(orderData) {
    const response = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  async getCart(userId) {
    const response = await fetch(`${API_BASE}/orders/cart/${userId}`);
    return response.json();
  },

  async addToCart(cartData) {
    const response = await fetch(`${API_BASE}/orders/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartData)
    });
    return response.json();
  },

  async removeFromCart(cartId) {
    const response = await fetch(`${API_BASE}/orders/cart/${cartId}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};