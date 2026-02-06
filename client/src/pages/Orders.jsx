import { Link } from "react-router-dom";
import { Package, Eye, ChevronRight } from "lucide-react";
import { Container } from "../components/layout";
import { useOrders } from "../hooks/useOrders";
import { formatCurrency, formatDate } from "../utils/formatters";
import { PageLoader } from "../components/common";
import { cn } from "../lib/utils";

function Orders() {
  const { orders, loading } = useOrders();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              When you place orders, they will appear here.
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full capitalize",
                          statusColors[order.status] ||
                            "bg-gray-100 text-gray-700",
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                    >
                      <img
                        src={item.imageUrl || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  {order.status === "delivered" && (
                    <button className="btn-outline text-sm">Reorder</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Orders;
