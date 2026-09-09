import { Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import { SuppliersListPage } from "./pages/suppliers/SuppliersListPage";
import { SupplierFormPage } from "./pages/suppliers/SupplierFormPage";
import { ProductsListPage } from "./pages/products/ProductsListPage";
import { ProductFormPage } from "./pages/products/ProductFormPage";
import { PurchaseOrdersListPage } from "./pages/purchase-orders/PurchaseOrdersListPage";
import { PurchaseOrderFormPage } from "./pages/purchase-orders/PurchaseOrderFormPage";
import { PurchaseOrderDetailPage } from "./pages/purchase-orders/PurchaseOrderDetailPage";
import { LoginPage } from "./pages/login/LoginPage";
import { RequireAuth } from "./auth/RequireAuth";
import { useAuth } from "./auth/AuthContext";

function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <RequireAuth>
      <nav style={{ marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/suppliers">Fornecedores</Link>
        <Link to="/products">Produtos</Link>
        <Link to="/purchase-orders">Pedidos de compra</Link>
        <span style={{ marginLeft: "auto" }}>{user?.name}</span>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </nav>
      <Outlet />
    </RequireAuth>
  );
}

export function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/suppliers" replace />} />
          <Route path="/suppliers" element={<SuppliersListPage />} />
          <Route path="/suppliers/new" element={<SupplierFormPage />} />
          <Route path="/suppliers/:id" element={<SupplierFormPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductFormPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersListPage />} />
          <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
        </Route>
      </Routes>
    </div>
  );
}
