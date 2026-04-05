import { describe, it, expect, vi } from "vitest";
import productService from "./product.service";
import api from "./api";

// Mock the api module
vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("productService", () => {
  it("getAll should call api.get with correct path and params", async () => {
    const mockData = { products: [], total: 0 };
    api.get.mockResolvedValueOnce({ data: mockData });

    const params = { page: 1, limit: 10 };
    const result = await productService.getAll(params);

    expect(api.get).toHaveBeenCalledWith("/products", { params });
    expect(result).toEqual(mockData);
  });

  it("getById should call api.get with correct path", async () => {
    const mockData = { id: "123", name: "Product" };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await productService.getById("123");

    expect(api.get).toHaveBeenCalledWith("/products/123");
    expect(result).toEqual(mockData);
  });

  it("getCategories should call api.get with correct path", async () => {
    const mockData = ["Electronics", "Books"];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await productService.getCategories();

    expect(api.get).toHaveBeenCalledWith("/categories");
    expect(result).toEqual(mockData);
  });

  it("create should call api.post with correct path and data", async () => {
    const mockData = { id: "123", name: "Product" };
    api.post.mockResolvedValueOnce({ data: mockData });

    const productData = { name: "Product" };
    const result = await productService.create(productData);

    expect(api.post).toHaveBeenCalledWith("/products", productData);
    expect(result).toEqual(mockData);
  });

  it("update should call api.put with correct path and data", async () => {
    const mockData = { id: "123", name: "Updated Product" };
    api.put.mockResolvedValueOnce({ data: mockData });

    const productData = { name: "Updated Product" };
    const result = await productService.update("123", productData);

    expect(api.put).toHaveBeenCalledWith("/products/123", productData);
    expect(result).toEqual(mockData);
  });

  it("delete should call api.delete with correct path", async () => {
    api.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await productService.delete("123");

    expect(api.delete).toHaveBeenCalledWith("/products/123");
    expect(result.success).toBe(true);
  });
});
