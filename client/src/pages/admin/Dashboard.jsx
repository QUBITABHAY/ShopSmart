import { useState, useEffect } from "react";
import {
  Package,
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { orderService } from "../../services/order.service";
import { cn } from "../../lib/utils";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await orderService.getAdminStats();
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Lifetime revenue",
    },
    {
      label: "Total Orders",
      value: stats ? stats.totalOrders : "0",
      icon: Package,
      color: "bg-blue-500",
      description: "Completed transactions",
    },
    {
      label: "Total Customers",
      value: stats ? stats.totalCustomers : "0",
      icon: Users,
      color: "bg-purple-500",
      description: "Registered users",
    },
    {
      label: "Total Products",
      value: stats ? stats.totalProducts : "0",
      icon: BarChart3,
      color: "bg-amber-500",
      description: "Items in catalog",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back to your ShopSmart store management.
          </p>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          View Reports
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-primary font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Real-time activity feed coming soon.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-bold text-gray-900 mb-6">Store Health</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Inventory Status</span>
                <span className="font-medium">Good</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Order Completion</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
