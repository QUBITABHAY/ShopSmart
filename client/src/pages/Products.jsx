import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, List, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Container } from "../components/layout";
import { QuickView, ProductCard } from "../components/product";
import { useProducts } from "../hooks/useProducts";
import { cn } from "../lib/utils";
import { ProductCardSkeleton } from "../components/common";

function Products() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const initialFilters = {
    category: searchParams.get("category"),
    search: searchParams.get("search"),
  };

  const {
    products,
    categories,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
  } = useProducts(initialFilters);

  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category"),
      search: searchParams.get("search"),
    };
    updateFilters(newFilters);
  }, [searchParams, updateFilters]);

  // Scroll to top when page or filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page, filters.category]);

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 when filter changes
    updateFilters({ ...newFilters, page: 1 });
  };

  const handlePriceRangeChange = (min, max) => {
    handleFilterChange({ minPrice: min, maxPrice: max });
  };

  const clearAllFilters = () => {
    updateFilters({
      category: null,
      search: null,
      minPrice: null,
      maxPrice: null,
      sortBy: null,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Page Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
                {filters.category
                  ? categories.find((c) => c.id === filters.category)?.name ||
                    "Category Products"
                  : "Discover Products"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-blue-600">
                  {pagination.total}
                </span>
                <span>products available</span>
                {filters.search && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Results for &quot;{filters.search}&quot;</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <select
                  className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-blue-300 transition-colors"
                  value={filters.sortBy || ""}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="createdAt_desc">Newest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="flex gap-8 relative">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-lg font-bold text-gray-900 font-heading">
                  Filters
                </h2>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-blue-200 underline-offset-4"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <div className="space-y-1.5 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                  <button
                    onClick={() => handleFilterChange({ category: null })}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                      !filters.category
                        ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterChange({ category: cat.id })}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                        filters.category === cat.id
                          ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4">
                  Price Range
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "All Prices", min: null, max: null },
                    { label: "Under ₹1,000", min: 0, max: 1000 },
                    { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                    { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                    { label: "Over ₹10,000", min: 10000, max: 1000000 },
                  ].map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={
                          filters.minPrice === range.min &&
                          filters.maxPrice === range.max
                        }
                        onChange={() =>
                          handlePriceRangeChange(range.min, range.max)
                        }
                        className="w-4 h-4 text-blue-600 rounded-full border-gray-300 focus:ring-blue-500 checked:bg-blue-600 bg-gray-50"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay (Minimalist implementation) */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
                  <h2 className="font-bold text-xl text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 p-5 overflow-y-auto space-y-8">
                  {/* Same Category and Price filters replicated or componentized */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                      Categories
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            handleFilterChange({ category: cat.id });
                            setShowMobileFilters(false);
                          }}
                          className={cn(
                            "px-4 py-3 rounded-xl text-left text-sm",
                            filters.category === cat.id
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-50 text-gray-700",
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowMobileFilters(false);
                    }}
                    className="w-full py-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-[600px]">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={cn(
                  "grid gap-4 md:gap-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                  viewMode === "grid"
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="pt-20 text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No products found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Try adjusting your filters or search criteria to find what
                  you&apos;re looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary-outline mt-4 px-8"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Premium Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-8">
                <p className="text-sm text-gray-500 font-medium">
                  Showing page{" "}
                  <span className="text-gray-900 font-bold">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-900 font-bold">
                    {pagination.totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <button
                    onClick={() => updateFilters({ page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="h-10 px-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    Prev
                  </button>

                  {/* Strategic Page Numbers */}
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Logic to show current, adjacent, and first/last pages
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= pagination.page - 1 &&
                        pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => updateFilters({ page: pageNum })}
                          className={cn(
                            "w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200",
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === 2 && pagination.page > 3)
                      return (
                        <span key="dots1" className="px-2 text-gray-300">
                          ...
                        </span>
                      );
                    if (
                      pageNum === pagination.totalPages - 1 &&
                      pagination.page < pagination.totalPages - 2
                    )
                      return (
                        <span key="dots2" className="px-2 text-gray-300">
                          ...
                        </span>
                      );
                    return null;
                  })}

                  <button
                    onClick={() => updateFilters({ page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="h-10 px-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
