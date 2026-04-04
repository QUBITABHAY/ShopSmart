import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/product.service";

export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);

  const fetchProducts = useCallback(
    async (filterParams = filters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAll(filterParams);
        if (data.success) {
          setProducts(data.data.products);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const data = await productService.getCategories();
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.search(query);
      setProducts(data.products || data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchProducts(filters);
    }
  }, [filters, fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    filters,
    fetchProducts,
    searchProducts,
    updateFilters,
    refetch: fetchProducts,
  };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await productService.getById(productId);
      setProduct(data.product || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

export default useProducts;
