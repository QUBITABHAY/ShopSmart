import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/layout";
import { CartDrawer } from "./components/cart";
import { ErrorBoundary } from "./components/common";
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
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Auth pages without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pages with layout */}
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
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
