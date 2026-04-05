import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";
import { getRatingStats } from "../../utils/product";

function ProductCard({ product, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { rating, reviewCount } = getRatingStats(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div
      className="card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Quick Actions Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <button
              onClick={handleQuickView}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-primary rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-110"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500",
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {rating !== undefined && reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.discount > 0 ? (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {Math.round(product.discount)}% OFF
              </span>
            ) : product.originalPrice > product.price ? (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
