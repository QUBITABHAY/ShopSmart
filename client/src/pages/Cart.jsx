import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Container } from "../components/layout";
import { CartItem, CartSummary } from "../components/cart";
import { useCart } from "../hooks/useCart";

function Cart() {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container className="py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">
              {items.length} items in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Cart;
