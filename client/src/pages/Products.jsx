import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import { Container, Sidebar } from "../components/layout";
import { ProductGrid, QuickView } from "../components/product";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatters";
import { cn } from "../lib/utils";

function Products() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addItem } = useCart();

  const initialFilters = {
    category: searchParams.get("category"),
    search: searchParams.get("search"),
  };

  const { products, categories, loading, filters, updateFilters } =
    useProducts(initialFilters);

  // Mock products for demo
  const mockProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 24999,
      originalPrice: 32999,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      category: "Electronics",
      rating: 4.8,
      reviewCount: 234,
      stock: 5,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 15999,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      category: "Electronics",
      rating: 4.6,
      reviewCount: 189,
      stock: 12,
    },
    {
      id: 3,
      name: "Leather Messenger Bag",
      price: 4499,
      imageUrl:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      category: "Accessories",
      rating: 4.9,
      reviewCount: 156,
      stock: 8,
    },
    {
      id: 4,
      name: "Minimalist Desk Lamp",
      price: 2999,
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
      category: "Home",
      rating: 4.7,
      reviewCount: 98,
      stock: 15,
    },
    {
      id: 5,
      name: "Organic Cotton T-Shirt",
      price: 999,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      category: "Clothing",
      rating: 4.5,
      reviewCount: 312,
      stock: 25,
    },
    {
      id: 6,
      name: "Ceramic Pour-Over Set",
      price: 2499,
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      category: "Kitchen",
      rating: 4.8,
      reviewCount: 87,
      stock: 10,
    },
    {
      id: 7,
      name: "Wireless Charging Pad",
      price: 1499,
      imageUrl:
        "https://images.unsplash.com/photo-1586816879360-004f5b0c1e1c?w=400",
      category: "Electronics",
      rating: 4.4,
      reviewCount: 145,
      stock: 30,
    },
    {
      id: 8,
      name: "Bamboo Sunglasses",
      price: 1999,
      imageUrl:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      category: "Accessories",
      rating: 4.6,
      reviewCount: 76,
      stock: 18,
    },
    {
      id: 9,
      name: "Portable Bluetooth Speaker",
      price: 7999,
      imageUrl:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
      category: "Electronics",
      rating: 4.7,
      reviewCount: 203,
      stock: 22,
    },
    {
      id: 10,
      name: "Yoga Mat Premium",
      price: 2999,
      imageUrl:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
      category: "Sports",
      rating: 4.5,
      reviewCount: 167,
      stock: 40,
    },
    {
      id: 11,
      name: "Stainless Steel Water Bottle",
      price: 1499,
      imageUrl:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      category: "Sports",
      rating: 4.8,
      reviewCount: 289,
      stock: 50,
    },
    {
      id: 12,
      name: "Canvas Backpack",
      price: 3499,
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      category: "Accessories",
      rating: 4.6,
      reviewCount: 134,
      stock: 15,
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;
  const mockCategories = [
    "All",
    "Electronics",
    "Accessories",
    "Clothing",
    "Home",
    "Kitchen",
    "Sports",
  ];

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category"),
      search: searchParams.get("search"),
    };
    updateFilters(newFilters);
  }, [searchParams, updateFilters]);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <Container className="py-6">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-4">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Products</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {filters.category || "All Products"}
              </h1>
              <p className="text-gray-500 mt-1">
                {displayProducts.length} products found
                {filters.search && ` for "${filters.search}"`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={filters.sortBy || ""}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {mockCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        handleFilterChange({
                          category: cat === "All" ? null : cat,
                        })
                      }
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        filters.category === cat ||
                          (cat === "All" && !filters.category)
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Under ₹1,000", value: "0-1000" },
                    { label: "₹1,000 - ₹5,000", value: "1000-5000" },
                    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
                    { label: "Over ₹10,000", value: "10000-" },
                  ].map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Customer Rating
                </h3>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < rating
                                ? "text-amber-400 fill-current"
                                : "text-gray-200",
                            )}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <Sidebar
                    categories={categories}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        %
                      </span>
                    )}
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3.5 h-3.5",
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-200",
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span className="sr-only">Add to cart</span>+
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              {[1, 2, 3, "...", 12].map((page, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default Products;
