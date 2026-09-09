import { Routes, Route, Navigate, Link } from "react-router-dom";
import { SuppliersListPage } from "./pages/suppliers/SuppliersListPage";
import { SupplierFormPage } from "./pages/suppliers/SupplierFormPage";
import { ProductsListPage } from "./pages/products/ProductsListPage";
import { ProductFormPage } from "./pages/products/ProductFormPage";

export function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <nav style={{ marginBottom: 24, display: "flex", gap: 16 }}>
        <Link to="/suppliers">Fornecedores</Link>
        <Link to="/products">Produtos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/suppliers" replace />} />
        <Route path="/suppliers" element={<SuppliersListPage />} />
        <Route path="/suppliers/new" element={<SupplierFormPage />} />
        <Route path="/suppliers/:id" element={<SupplierFormPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductFormPage />} />
      </Routes>
    </div>
  );
}
