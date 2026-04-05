import { describe, it, expect, vi, beforeEach } from "vitest";
import useAuthStore from "./authStore";
import { authService } from "../services/auth.service";

// Mock the auth service
vi.mock("../services/auth.service", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("login success should update state", async () => {
    const mockUser = { id: "1", name: "Test User" };
    const mockResponse = { data: { user: mockUser, token: "fake-token" } };
    authService.login.mockResolvedValueOnce(mockResponse);

    await useAuthStore.getState().login("test@example.com", "password");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("fake-token");
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  it("login failure should update error state", async () => {
    const errorMessage = "Invalid credentials";
    authService.login.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    await useAuthStore.getState().login("test@example.com", "wrong");

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
  });

  it("logout should clear state", async () => {
    // Set initial logged in state
    useAuthStore.setState({
      user: { id: "1" },
      token: "token",
      isAuthenticated: true,
    });
    localStorage.setItem("token", "token");

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("checkAuth should restore session if token exists", async () => {
    localStorage.setItem("token", "valid-token");
    const mockUser = { id: "1", name: "Restored" };
    authService.getProfile.mockResolvedValueOnce({ data: { user: mockUser } });

    await useAuthStore.getState().checkAuth();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("checkAuth should handle expired token", async () => {
    localStorage.setItem("token", "expired-token");
    authService.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));

    await useAuthStore.getState().checkAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });
});
