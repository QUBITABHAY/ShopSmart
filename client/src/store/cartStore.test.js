import { describe, it, expect, vi, beforeEach } from "vitest";
import useCartStore from "./cartStore";
import { cartService } from "../services/cart.service";

// Mock the cart service
vi.mock("../services/cart.service", () => ({
  cartService: {
    getCart: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
  },
}));

describe("cartStore", () => {
  const mockProduct = {
    id: "p1",
    name: "Product 1",
    price: 100,
    imageUrl: "test.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset store state
    useCartStore.setState({
      items: [],
      isLoading: false,
      isOpen: false,
    });
  });

  it("should have initial state", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.isOpen).toBe(false);
  });

  describe("addItem", () => {
    it("should add item locally if not logged in", async () => {
      await useCartStore.getState().addItem(mockProduct, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toMatchObject({
        productId: "p1",
        quantity: 2,
        price: 100,
      });
      expect(cartService.addItem).not.toHaveBeenCalled();
    });

    it("should call cartService if logged in", async () => {
      localStorage.setItem("token", "fake-token");
      const mockCartResponse = { items: [{ id: "c1", productId: "p1", quantity: 2 }] };
      cartService.addItem.mockResolvedValueOnce(mockCartResponse);

      await useCartStore.getState().addItem(mockProduct, 2);

      expect(cartService.addItem).toHaveBeenCalledWith("p1", 2);
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("c1");
    });

    it("should increment quantity locally if item already exists", async () => {
      await useCartStore.getState().addItem(mockProduct, 1);
      await useCartStore.getState().addItem(mockProduct, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });
  });

  describe("removeItem", () => {
    it("should remove item locally", async () => {
      useCartStore.setState({ items: [{ id: "cart-p1", productId: "p1", quantity: 1 }] });
      
      await useCartStore.getState().removeItem("cart-p1");

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("should call cartService for server items when logged in", async () => {
      localStorage.setItem("token", "fake-token");
      useCartStore.setState({ items: [{ id: "server-id", productId: "p1", quantity: 1 }] });
      cartService.removeItem.mockResolvedValueOnce({ items: [] });

      await useCartStore.getState().removeItem("server-id");

      expect(cartService.removeItem).toHaveBeenCalledWith("server-id");
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("computed values", () => {
    it("getItemCount should calculate correctly", () => {
      useCartStore.setState({
        items: [
          { id: "1", quantity: 2, price: 10 },
          { id: "2", quantity: 3, price: 20 },
        ],
      });

      expect(useCartStore.getState().getItemCount()).toBe(5);
    });

    it("getSubtotal, getTax, and getTotal should calculate correctly", () => {
      useCartStore.setState({
        items: [
          { id: "1", quantity: 2, price: 100 },
          { id: "2", quantity: 1, price: 50 },
        ],
      });

      const subtotal = useCartStore.getState().getSubtotal();
      const tax = useCartStore.getState().getTax();
      const total = useCartStore.getState().getTotal();

      expect(subtotal).toBe(250);
      expect(tax).toBe(25); // 10% of 250
      expect(total).toBe(275);
    });
  });

  it("clearCart should empty items", async () => {
    useCartStore.setState({ items: [{ id: "1", quantity: 1 }] });
    
    await useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
