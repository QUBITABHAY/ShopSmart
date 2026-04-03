import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer, AdminLayout } from "./components/layout";
import { CartDrawer } from "./components/cart";
import { ErrorBoundary, AdminRoute, ProtectedRoute } from "./components/common";
import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";
import {
  Home,
  Products,
  ProductDetail,
  Cart,
  Checkout,
  Login,
  Register,
  Profile,
  Orders,
  AdminDashboard,
  AdminProducts,
  AdminOrders,
  AdminUsers,
} from "./pages";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchCart();
    };
    init();
  }, [checkAuth, fetchCart]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Auth pages without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Pages with layout */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/products"
            element={
              <AppLayout>
                <Products />
              </AppLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <AppLayout>
                <ProductDetail />
              </AppLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <AppLayout>
                <Cart />
              </AppLayout>
            }
          />
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/checkout"
              element={
                <AppLayout>
                  <Checkout />
                </AppLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <AppLayout>
                  <Orders />
                </AppLayout>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
