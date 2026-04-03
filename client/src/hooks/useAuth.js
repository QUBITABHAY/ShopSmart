import { useCallback } from "react";
import useAuthStore from "../store/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  const handleLogin = useCallback(
    async (email, password) => {
      return await login(email, password);
    },
    [login],
  );

  const handleRegister = useCallback(
    async (name, email, password, isAdmin) => {
      return await register(name, email, password, isAdmin);
    },
    [register],
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth,
    clearError,
  };
}

export default useAuth;
