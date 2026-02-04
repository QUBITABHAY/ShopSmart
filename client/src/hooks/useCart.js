import { useCallback } from "react";
import useCartStore from "../store/cartStore";

export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal,
  } = useCartStore();

  const handleAddItem = useCallback(
    (product, quantity = 1) => {
      addItem(product, quantity);
    },
    [addItem],
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      removeItem(itemId);
    },
    [removeItem],
  );

  const handleUpdateQuantity = useCallback(
    (itemId, quantity) => {
      updateQuantity(itemId, quantity);
    },
    [updateQuantity],
  );

  return {
    items,
    isOpen,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    tax: getTax(),
    total: getTotal(),
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
}

export default useCart;
