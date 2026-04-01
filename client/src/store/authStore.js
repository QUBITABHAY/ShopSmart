import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.service";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          if (token) {
            localStorage.setItem("token", token);
          }
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      register: async (name, email, password, isAdmin) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(name, email, password, isAdmin);
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          if (token) {
            localStorage.setItem("token", token);
          }
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authService.getProfile();
          const { user } = response.data;
          set({
            user: user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
