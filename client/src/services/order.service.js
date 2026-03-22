import api from "./api";

export const orderService = {
  async getAll() {
    const response = await api.get("/orders");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async create(orderData) {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  async cancel(id) {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin methods
  async updateStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default orderService;
