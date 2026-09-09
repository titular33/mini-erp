import type { Supplier } from "../types/api";

// Estado em memória do mock — reseta a cada reload da página.
// Isso é aceitável para desenvolvimento de UI, mas não substitui testes de integração
// contra uma API real: MSW garante que o *shape* do contrato está certo, não a lógica
// de negócio de verdade (isso mora no back-end, .NET ou Node).
export const db = {
  suppliers: [
    {
      id: "3f8a1c1e-1111-4a2b-9c1d-000000000001",
      name: "Fornecedora Alfa Ltda",
      taxId: "12.345.678/0001-90",
      email: "contato@alfa.com",
      phone: "(11) 4000-1000",
      status: "active",
      createdAt: "2026-01-10T10:00:00Z",
    },
    {
      id: "3f8a1c1e-1111-4a2b-9c1d-000000000002",
      name: "Beta Suprimentos",
      taxId: "98.765.432/0001-10",
      email: "vendas@betasuprimentos.com",
      phone: "(21) 3000-2000",
      status: "inactive",
      createdAt: "2026-02-05T15:30:00Z",
    },
  ] as Supplier[],
};
