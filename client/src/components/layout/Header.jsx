import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { cn } from "../../lib/utils";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, openCart } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ShopSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0",
          )}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
