import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/order.service";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      const data = await orderService.create(orderData);
      setOrders((prev) => [data.order || data, ...prev]);
      return { success: true, order: data.order || data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create order",
      };
    }
  }, []);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      await orderService.cancel(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to cancel order",
      };
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    cancelOrder,
    refetch: fetchOrders,
  };
}

export function useOrder(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getById(orderId);
      setOrder(data.order || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}

export default useOrders;
