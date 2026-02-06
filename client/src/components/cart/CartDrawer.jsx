import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";
import CartItem from "./CartItem";

function CartDrawer() {
  const { items, isOpen, closeCart, total, itemCount } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Your Cart ({itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Add some items to get started!
              </p>
              <Link to="/products" onClick={closeCart} className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full btn-primary justify-center"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full btn-outline justify-center"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
