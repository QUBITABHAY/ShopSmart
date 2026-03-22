import api from "./api";

export const productService = {
  async getAll(params = {}) {
    const response = await api.get("/products", { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },

  async search(query) {
    const response = await api.get("/products", {
      params: { search: query },
    });
    return response.data;
  },

  async getByCategory(category) {
    const response = await api.get("/products", { params: { category } });
    return response.data;
  },

  // Admin methods
  async create(data) {
    const response = await api.post("/products", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
