import api from "./api";

export const cartService = {
  async getCart() {
    const response = await api.get("/cart");
    return response.data;
  },

  async addItem(productId, quantity = 1) {
    const response = await api.post("/cart/items", { productId, quantity });
    return response.data;
  },

  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeItem(itemId) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete("/cart");
    return response.data;
  },
};

export default cartService;
