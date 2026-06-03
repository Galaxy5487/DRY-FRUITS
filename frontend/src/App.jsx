import { NavLink, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProductsPage from "./pages/shop/ProductsPage";
import ProductDetailPage from "./pages/shop/ProductDetailPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminShopPage from "./pages/admin/AdminShopPage";
import NotFoundPage from "./pages/NotFoundPage";

const AdminNav = () => (
  <div className="container-shell pt-8">
    <div className="card-surface flex flex-wrap gap-3 p-4">
      {[
        ["/admin", "Dashboard"],
        ["/admin/products", "Products"],
        ["/admin/orders", "Orders"],
        ["/admin/reviews", "Reviews"],
        ["/admin/shop", "Shop Info"]
      ].map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/admin"}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm ${isActive ? "bg-brand-cocoa text-white" : "bg-brand-cream"}`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  </div>
);

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderSummaryPage />} />
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route
          path="/admin"
          element={
            <>
              <AdminNav />
              <AdminDashboardPage />
            </>
          }
        />
        <Route
          path="/admin/products"
          element={
            <>
              <AdminNav />
              <AdminProductsPage />
            </>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <>
              <AdminNav />
              <AdminOrdersPage />
            </>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <>
              <AdminNav />
              <AdminReviewsPage />
            </>
          }
        />
        <Route
          path="/admin/shop"
          element={
            <>
              <AdminNav />
              <AdminShopPage />
            </>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
