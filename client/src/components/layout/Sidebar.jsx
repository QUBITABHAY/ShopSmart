import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../lib/utils";

function Sidebar({ categories = [], filters = {}, onFilterChange, className }) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
  });
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      category: filters.category === category ? null : category,
    });
  };

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: priceRange.min ? Number(priceRange.min) : null,
      maxPrice: priceRange.max ? Number(priceRange.max) : null,
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({
      category: null,
      minPrice: null,
      maxPrice: null,
      rating: null,
    });
  };

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice;

  return (
    <aside className={cn("w-64 shrink-0", className)}>
      <div className="bg-white rounded-xl shadow-sm p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-900">Categories</span>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id || category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    filters.category === category.name
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="border-t pt-4 mt-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-900">Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="input text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="input text-sm"
                />
              </div>
              <button
                onClick={handlePriceChange}
                className="w-full btn-outline text-sm"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
