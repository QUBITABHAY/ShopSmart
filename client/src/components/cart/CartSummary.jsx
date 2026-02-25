import { Link } from "react-router-dom";
import { ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

function CartSummary({ showCheckoutButton = true }) {
  const { subtotal, tax, total, itemCount } = useCart();

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="w-full btn-primary justify-center text-center block"
        >
          Proceed to Checkout
        </Link>
      )}

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Truck className="w-5 h-5 text-primary" />
          <span>Free shipping on orders over ₹500</span>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
