import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "../services/cart.service";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      fetchCart: async () => {
        if (!localStorage.getItem("token")) return;
        set({ isLoading: true });
        try {
          const data = await cartService.getCart();
          set({ items: data.items || data.data?.items || [], isLoading: false });
        } catch (error) {
          console.error("Fetch cart error:", error);
          set({ isLoading: false });
        }
      },

      addItem: async (product, quantity = 1) => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const data = await cartService.addItem(product.id, quantity);
            set({ items: data.items || data.data?.items || [] });
          } catch (error) {
            console.error("Add item error:", error);
          }
        } else {
          // Local fallback
          const items = get().items;
          const existingItem = items.find((item) => item.productId === product.id);
          if (existingItem) {
            set({
              items: items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            });
          } else {
            set({
              items: [
                ...items,
                {
                  id: `cart-${product.id}-${Date.now()}`,
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  quantity,
                },
              ],
            });
          }
        }
      },

      removeItem: async (itemId) => {
        const token = localStorage.getItem("token");
        if (token && !itemId.toString().startsWith("cart-")) {
          try {
            const data = await cartService.removeItem(itemId);
            set({ items: data.items || data.data?.items || [] });
          } catch (error) {
            console.error("Remove item error:", error);
          }
        } else {
          set({
            items: get().items.filter((item) => item.id !== itemId),
          });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const token = localStorage.getItem("token");
        if (token && !itemId.toString().startsWith("cart-")) {
          try {
            const data = await cartService.updateQuantity(itemId, quantity);
            set({ items: data.items || data.data?.items || [] });
          } catch (error) {
            console.error("Update quantity error:", error);
          }
        } else {
          set({
            items: get().items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: async () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error("Clear cart error:", error);
          }
        }
        set({ items: [] });
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Computed values
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + (item.price || item.product?.price || 0) * item.quantity, 0),
      getTax: () => get().getSubtotal() * 0.1,
      getTotal: () => get().getSubtotal() + get().getTax(),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
