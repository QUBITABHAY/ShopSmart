import { X, Package, User, MapPin } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { cn } from "../../lib/utils";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900 font-heading">
                Order #{order.id.slice(-8).toUpperCase()}
              </h2>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  getStatusColor(order.status),
                )}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold font-heading">
                <User className="w-5 h-5 text-primary" />
                <h3>Customer Details</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <p className="font-medium text-gray-900">{order.user?.name}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold font-heading">
                <MapPin className="w-5 h-5 text-primary" />
                <h3>Shipping Address</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {order.address || "No address provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold font-heading">
              <Package className="w-5 h-5 text-primary" />
              <h3>Order Items</h3>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">
                      Product
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">
                      Quantity
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                      Price
                    </th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border bg-gray-100 flex-shrink-0 overflow-hidden">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {item.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50/50">
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-4 text-right font-bold text-gray-900"
                    >
                      Total Amount
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-primary text-lg">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all font-heading"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
