import { describe, it, expect, vi, beforeEach } from "vitest";
import authService from "./auth.service";
import api from "./api";

// Mock the api module
vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("login should call api.post and return data", async () => {
    const mockData = { token: "fake-token", user: { name: "Test User" } };
    api.post.mockResolvedValueOnce({ data: mockData });

    const result = await authService.login("test@example.com", "password123");

    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
    expect(result).toEqual(mockData);
  });

  it("register should call api.post with correct data", async () => {
    const mockData = { success: true };
    api.post.mockResolvedValueOnce({ data: mockData });

    const result = await authService.register("Test User", "test@example.com", "password123", false);

    expect(api.post).toHaveBeenCalledWith("/auth/register", {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      isAdmin: false,
    });
    expect(result).toEqual(mockData);
  });

  it("logout should remove token from localStorage", async () => {
    localStorage.setItem("token", "some-token");
    
    const result = await authService.logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(result.success).toBe(true);
  });

  it("getProfile should call api.get", async () => {
    const mockData = { name: "Test User", email: "test@example.com" };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await authService.getProfile();

    expect(api.get).toHaveBeenCalledWith("/auth/profile");
    expect(result).toEqual(mockData);
  });

  it("updateProfile should call api.put with data", async () => {
    const mockData = { name: "Updated Name" };
    api.put.mockResolvedValueOnce({ data: mockData });

    const result = await authService.updateProfile({ name: "Updated Name" });

    expect(api.put).toHaveBeenCalledWith("/auth/profile", { name: "Updated Name" });
    expect(result).toEqual(mockData);
  });
});
