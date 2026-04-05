import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  CheckCircle,
  User as UserIcon,
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
    product.imageUrls?.length > 0 ? product.imageUrls : [product.image];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  // Calculate rating stats
  const ratingStats = product.ratingStars || {};
  const totalStarVotes = Object.values(ratingStats).reduce(
    (a, b) => a + Number(b),
    0,
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: Number(ratingStats[star]) || 0,
    percentage:
      totalStarVotes > 0
        ? ((Number(ratingStats[star]) || 0) / totalStarVotes) * 100
        : 0,
  }));

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
                {product.category?.name}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.seller && (
                <p className="text-sm text-gray-600 mb-4">
                  Sold and shipped by{" "}
                  <span className="font-bold text-gray-900">
                    {product.seller}
                  </span>
                </p>
              )}

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
          </div>
        </div>

        {/* Extended Walmart Data */}
        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          {/* Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900 font-heading">
                Specifications
              </h2>
            </div>
            <div className="bg-gray-50 rounded-2xl overflow-hidden border">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {product.specifications?.map((spec, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "border-b last:border-0",
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                      )}
                    >
                      <td className="px-6 py-4 font-bold text-gray-700 w-1/3">
                        {spec.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                  {!product.specifications?.length && (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500 italic">
                        No detailed specifications available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex flex-col md:flex-row gap-12 border-t pt-12">
              {/* Rating Summary Sidebar */}
              <div className="w-full md:w-80 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Customer Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.round(product.rating || 0)
                              ? "text-amber-400 fill-current"
                              : "text-gray-200",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {product.rating} out of 5
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalStarVotes} global ratings
                  </p>
                </div>

                {/* Star Bars */}
                <div className="space-y-3">
                  {ratingDistribution.map((row) => (
                    <div
                      key={row.star}
                      className="flex items-center gap-4 group cursor-help"
                    >
                      <span className="text-sm font-medium text-blue-600 whitespace-nowrap w-12 hover:underline">
                        {row.star} star
                      </span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-10 text-right">
                        {Math.round(row.percentage)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button className="w-full py-3 px-4 rounded-xl border-2 font-bold text-gray-900 hover:bg-gray-50 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Individual Reviews List */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Ratings
                  </h3>
                  <div className="text-sm text-gray-500">
                    Sorted by: Most Relevant
                  </div>
                </div>

                <div className="space-y-6">
                  {product.customerReviews?.map((review, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold">
                            {review.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || (
                              <UserIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {review.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                              <CheckCircle className="w-3 h-3 fill-current" />
                              Verified Purchase
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, starI) => (
                            <Star
                              key={starI}
                              className={cn(
                                "w-3 h-3",
                                starI < review.rating
                                  ? "text-amber-400 fill-current"
                                  : "text-gray-200",
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {review.title && (
                          <h4 className="font-bold text-gray-900 leading-tight">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {review.review}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <button className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg border hover:border-blue-200 hover:bg-blue-50">
                          Helpful
                        </button>
                        <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                          Report
                        </button>
                      </div>
                    </div>
                  ))}

                  {!product.customerReviews?.length && (
                    <div className="bg-gray-50 p-12 rounded-3xl border border-dashed text-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <UserIcon className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        No reviews yet
                      </h4>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Be the first to share your thoughts about this product!
                      </p>
                      <button className="mt-4 text-blue-600 font-bold hover:underline">
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetail;
