import { describe, it, expect, vi, beforeEach } from "vitest";
import cartService from "./cart.service";
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

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCart should call api.get", async () => {
    const mockData = { items: [], total: 0 };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await cartService.getCart();

    expect(api.get).toHaveBeenCalledWith("/cart");
    expect(result).toEqual(mockData);
  });

  it("addItem should call api.post with productId and quantity", async () => {
    const mockData = { id: "item1", productId: "p1", quantity: 2 };
    api.post.mockResolvedValueOnce({ data: mockData });

    const result = await cartService.addItem("p1", 2);

    expect(api.post).toHaveBeenCalledWith("/cart", {
      productId: "p1",
      quantity: 2,
    });
    expect(result).toEqual(mockData);
  });

  it("updateQuantity should call api.put with quantity", async () => {
    const mockData = { id: "item1", quantity: 3 };
    api.put.mockResolvedValueOnce({ data: mockData });

    const result = await cartService.updateQuantity("item1", 3);

    expect(api.put).toHaveBeenCalledWith("/cart/item1", { quantity: 3 });
    expect(result).toEqual(mockData);
  });

  it("removeItem should call api.delete", async () => {
    api.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await cartService.removeItem("item1");

    expect(api.delete).toHaveBeenCalledWith("/cart/item1");
    expect(result.success).toBe(true);
  });

  it("clearCart should call api.delete with /cart", async () => {
    api.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await cartService.clearCart();

    expect(api.delete).toHaveBeenCalledWith("/cart");
    expect(result.success).toBe(true);
  });
});
