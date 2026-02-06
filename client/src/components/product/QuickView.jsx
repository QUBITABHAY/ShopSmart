import { useState } from "react";
import { X, Minus, Plus, ShoppingCart, Star, Heart } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";
import Modal from "../common/Modal";

function QuickView({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  if (!product) return null;

  const images =
    product.images?.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" title="">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={images[selectedImage] || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          </div>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 line-clamp-3">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                product.stock > 0 ? "bg-green-500" : "bg-red-500",
              )}
            />
            <span
              className={cn(
                "text-sm",
                product.stock > 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="p-3 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QuickView;
