import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  PlusCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      path: "/admin/orders",
    },
    ...(user?.role === 'MASTER_ADMIN' ? [{
      label: "Customers",
      icon: Users,
      path: "/admin/customers",
    }] : []),
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-64px)] sticky top-16 hidden md:flex flex-col">
      <div className="p-6 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6 border-t">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
          <PlusCircle className="w-5 h-5" />
          Add Product
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
