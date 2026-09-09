// Tipos espelham docs/api-contract.md na raiz do repo — mantenha sincronizado.

export type SupplierStatus = "active" | "inactive";

export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  status: SupplierStatus;
  createdAt: string;
}

export type SupplierInput = Omit<Supplier, "id" | "status" | "createdAt">;

export type ProductUnit = "UN" | "KG" | "CX" | "L";

export interface Product {
  id: string;
  sku: string;
  name: string;
  unit: ProductUnit;
  minStock: number;
  currentStock: number;
  averageCost: number;
}

export type ProductInput = Omit<Product, "id" | "currentStock" | "averageCost">;

export type PurchaseOrderStatus =
  | "draft"
  | "submitted"
  | "received"
  | "partially_received"
  | "cancelled";

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  createdAt: string;
}

export interface PurchaseOrderItemInput {
  productId: string;
  quantityOrdered: number;
  unitPrice: number;
}

export interface PurchaseOrderInput {
  supplierId: string;
  items: PurchaseOrderItemInput[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  unitCost: number;
  reason: "purchase_receipt" | "manual_adjustment";
  referenceId: string;
  createdAt: string;
}

export interface ReceivePurchaseOrderItemInput {
  purchaseOrderItemId: string;
  quantityReceived: number;
}

export interface ReceivePurchaseOrderInput {
  items: ReceivePurchaseOrderItemInput[];
}

export interface DashboardSummary {
  totalStockValue: number;
  pendingPurchaseOrders: number;
  productsBelowMinStock: number;
  recentMovements: unknown[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}
