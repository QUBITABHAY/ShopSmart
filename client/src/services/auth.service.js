import api from "./api";

export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(name, email, password, isAdmin) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      isAdmin,
    });
    return response.data;
  },

  async logout() {
    localStorage.removeItem("token");
    return { success: true, message: "Logged out successfully" };
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};

export default authService;
