import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Container } from "../components/layout";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatters";
import { PageLoader } from "../components/common";
import { cn } from "../lib/utils";

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) return <PageLoader />;

  if (error || !product) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/products" className="btn-primary">
          Back to Products
        </Link>
      </Container>
    );
  }

  const images =
    product.images?.length > 0 ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors shrink-0",
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
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating !== undefined && (
                <div className="flex items-center gap-3 mb-4">
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
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full">
                        Save{" "}
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        %
                      </span>
                    </>
                  )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-3 h-3 rounded-full",
                  product.stock > 0 ? "bg-green-500" : "bg-red-500",
                )}
              />
              <span
                className={cn(
                  product.stock > 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border-2 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-14 text-center text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-4 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button className="p-4 border-2 rounded-lg text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>

              <button className="p-4 border-2 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-500">On orders over ₹500</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetail;
