import { Container } from "../../components/layout";
import { Settings, Package, Users, BarChart3 } from "lucide-react";

function AdminDashboard() {
  const stats = [
    { label: "Total Orders", value: "—", icon: Package, color: "bg-blue-500" },
    {
      label: "Total Products",
      value: "—",
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      label: "Total Customers",
      value: "—",
      icon: Users,
      color: "bg-purple-500",
    },
    { label: "Revenue", value: "—", icon: Settings, color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Settings className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Admin Panel Coming Soon
          </h2>
          <p className="text-gray-500">
            Product management, order management, and analytics will be
            available here.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default AdminDashboard;
