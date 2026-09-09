import { http, HttpResponse } from "msw";
import { db } from "./data";
import { products } from "./productsData";
import { purchaseOrders } from "./purchaseOrdersData";
import { movements } from "./inventoryData";
import type {
  Product,
  ProductInput,
  PurchaseOrder,
  PurchaseOrderInput,
  ReceivePurchaseOrderInput,
  Supplier,
  SupplierInput,
} from "../types/api";

const BASE = "/api/v1";

function notFound(message: string) {
  return HttpResponse.json(
    { error: { code: "NOT_FOUND", message } },
    { status: 404 },
  );
}

function conflict(message: string) {
  return HttpResponse.json({ error: { code: "CONFLICT", message } }, { status: 409 });
}

function validationError(message: string) {
  return HttpResponse.json(
    { error: { code: "VALIDATION_ERROR", message } },
    { status: 422 },
  );
}

export const handlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === "admin@erp.local" && body.password === "admin123") {
      return HttpResponse.json({
        token: "mock-jwt-token",
        user: { id: "u1", name: "Admin", role: "admin" },
      });
    }
    return HttpResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Credenciais inválidas" } },
      { status: 401 },
    );
  }),

  http.get(`${BASE}/suppliers`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search")?.toLowerCase();

    let result = db.suppliers;
    if (status) result = result.filter((s) => s.status === status);
    if (search) result = result.filter((s) => s.name.toLowerCase().includes(search));

    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/suppliers/:id`, ({ params }) => {
    const supplier = db.suppliers.find((s) => s.id === params.id);
    if (!supplier) return notFound("Fornecedor não encontrado");
    return HttpResponse.json(supplier);
  }),

  http.post(`${BASE}/suppliers`, async ({ request }) => {
    const input = (await request.json()) as SupplierInput;
    const created: Supplier = {
      ...input,
      id: crypto.randomUUID(),
      status: "active",
      createdAt: new Date().toISOString(),
    };
    db.suppliers.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE}/suppliers/:id`, async ({ params, request }) => {
    const idx = db.suppliers.findIndex((s) => s.id === params.id);
    if (idx === -1) return notFound("Fornecedor não encontrado");
    const input = (await request.json()) as SupplierInput;
    db.suppliers[idx] = { ...db.suppliers[idx], ...input };
    return HttpResponse.json(db.suppliers[idx]);
  }),

  http.patch(`${BASE}/suppliers/:id/status`, async ({ params, request }) => {
    const idx = db.suppliers.findIndex((s) => s.id === params.id);
    if (idx === -1) return notFound("Fornecedor não encontrado");
    const { status } = (await request.json()) as { status: Supplier["status"] };
    db.suppliers[idx].status = status;
    return HttpResponse.json(db.suppliers[idx]);
  }),

  http.get(`${BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const belowMinStock = url.searchParams.get("belowMinStock");
    const search = url.searchParams.get("search")?.toLowerCase();

    let result = products;
    if (belowMinStock === "true") {
      result = result.filter((p) => p.currentStock < p.minStock);
    }
    if (search) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search),
      );
    }
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return notFound("Produto não encontrado");
    return HttpResponse.json(product);
  }),

  http.post(`${BASE}/products`, async ({ request }) => {
    const input = (await request.json()) as ProductInput;
    const created: Product = { ...input, id: crypto.randomUUID(), currentStock: 0, averageCost: 0 };
    products.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE}/products/:id`, async ({ params, request }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return notFound("Produto não encontrado");
    const input = (await request.json()) as ProductInput;
    products[idx] = { ...products[idx], ...input };
    return HttpResponse.json(products[idx]);
  }),

  http.get(`${BASE}/purchase-orders`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    let result = purchaseOrders;
    if (status) result = result.filter((po) => po.status === status);
    return HttpResponse.json(result);
  }),

  http.get(`${BASE}/purchase-orders/:id`, ({ params }) => {
    const order = purchaseOrders.find((po) => po.id === params.id);
    if (!order) return notFound("Pedido de compra não encontrado");
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/purchase-orders`, async ({ request }) => {
    const input = (await request.json()) as PurchaseOrderInput;
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.quantityOrdered * item.unitPrice,
      0,
    );
    const created: PurchaseOrder = {
      id: crypto.randomUUID(),
      supplierId: input.supplierId,
      status: "draft",
      items: input.items.map((item) => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        quantityOrdered: item.quantityOrdered,
        quantityReceived: 0,
        unitPrice: item.unitPrice,
      })),
      totalAmount,
      createdAt: new Date().toISOString(),
    };
    purchaseOrders.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.post(`${BASE}/purchase-orders/:id/submit`, ({ params }) => {
    const order = purchaseOrders.find((po) => po.id === params.id);
    if (!order) return notFound("Pedido de compra não encontrado");
    if (order.status !== "draft") {
      return conflict("Apenas pedidos em rascunho podem ser submetidos");
    }
    order.status = "submitted";
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/purchase-orders/:id/cancel`, ({ params }) => {
    const order = purchaseOrders.find((po) => po.id === params.id);
    if (!order) return notFound("Pedido de compra não encontrado");
    if (order.status !== "draft" && order.status !== "submitted") {
      return conflict("Apenas pedidos em rascunho ou submetidos podem ser cancelados");
    }
    order.status = "cancelled";
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/purchase-orders/:id/receive`, async ({ params, request }) => {
    const order = purchaseOrders.find((po) => po.id === params.id);
    if (!order) return notFound("Pedido de compra não encontrado");
    if (order.status !== "submitted" && order.status !== "partially_received") {
      return conflict("Pedido precisa estar submetido para ser recebido");
    }

    const input = (await request.json()) as ReceivePurchaseOrderInput;

    for (const receiveItem of input.items) {
      const item = order.items.find((i) => i.id === receiveItem.purchaseOrderItemId);
      if (!item) return notFound(`Item ${receiveItem.purchaseOrderItemId} não pertence ao pedido`);

      const remaining = item.quantityOrdered - item.quantityReceived;
      if (receiveItem.quantityReceived <= 0 || receiveItem.quantityReceived > remaining) {
        return validationError(
          `Quantidade recebida inválida para o item ${item.id} (restante: ${remaining})`,
        );
      }

      item.quantityReceived += receiveItem.quantityReceived;

      // Ledger: cada recebimento é uma NOVA movimentação (insert), nunca um update
      // de um contador de estoque — evita lost updates em recebimentos concorrentes
      // e preserva auditoria completa de quando/quanto entrou.
      movements.push({
        id: crypto.randomUUID(),
        productId: item.productId,
        type: "in",
        quantity: receiveItem.quantityReceived,
        unitCost: item.unitPrice,
        reason: "purchase_receipt",
        referenceId: order.id,
        createdAt: new Date().toISOString(),
      });

      // Simplificação do mock: aqui mantemos currentStock/averageCost como campos
      // materializados no produto, atualizados a cada movimentação. No back-end
      // real (SQL), isso seria calculado por agregação sobre a tabela de
      // movimentações (SUM/AVG), não guardado como coluna mutável — é a diferença
      // entre "materialized view" e "derivar sob demanda", trade-off de
      // performance de leitura vs. risco de inconsistência que vamos revisitar
      // quando desenharmos o schema do PostgreSQL.
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const incomingQty = receiveItem.quantityReceived;
        const newStock = product.currentStock + incomingQty;
        product.averageCost =
          newStock > 0
            ? (product.currentStock * product.averageCost + incomingQty * item.unitPrice) / newStock
            : item.unitPrice;
        product.currentStock = newStock;
      }
    }

    const fullyReceived = order.items.every((i) => i.quantityReceived >= i.quantityOrdered);
    order.status = fullyReceived ? "received" : "partially_received";

    return HttpResponse.json(order);
  }),
];
