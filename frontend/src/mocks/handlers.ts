import { http, HttpResponse } from "msw";
import { db } from "./data";
import type { Supplier, SupplierInput } from "../types/api";

const BASE = "/api/v1";

function notFound(message: string) {
  return HttpResponse.json(
    { error: { code: "NOT_FOUND", message } },
    { status: 404 },
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
];
