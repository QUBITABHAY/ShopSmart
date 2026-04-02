import api from "./api";

export const userService = {
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = "" } = params;
    return await api.get(`/users`, {
      params: { page, limit, search },
    });
  },

  updateRole: async (userId, role) => {
    return await api.patch(`/users/${userId}/role`, { role });
  },
};

export default userService;
