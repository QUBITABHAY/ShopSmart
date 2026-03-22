import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

function CartItem({ item, compact = false }) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={item.imageUrl || "/placeholder-product.jpg"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </h4>
          <p className="text-sm text-gray-500">
            {item.quantity} × {formatCurrency(item.price)}
          </p>
        </div>
        <button
          onClick={handleRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <img
          src={item.imageUrl || "/placeholder-product.jpg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
        <p className="text-lg font-bold text-gray-900 mb-3">
          {formatCurrency(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="font-bold text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}

export default CartItem;
