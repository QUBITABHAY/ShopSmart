import api from "./api";

export const userService = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    const response = await api.get(`/users`, {
      params: { page, limit, search },
    });
    return response.data;
  },

  updateRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
};

export default userService;
