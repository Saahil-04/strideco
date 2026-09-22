import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Card"
import OrderConfirmed from "./pages/OrderConfirmed";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CardContext"

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<StoreLayout><Landing /></StoreLayout>} />
          <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
          <Route path="/products/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
          <Route path="/order-confirmed" element={<StoreLayout><OrderConfirmed /></StoreLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}