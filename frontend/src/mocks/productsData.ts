import type { Product } from "../types/api";

export const products: Product[] = [
  {
    id: "9a1b2c3d-2222-4a2b-9c1d-000000000001",
    sku: "PRD-001",
    name: "Parafuso Sextavado M8",
    unit: "UN",
    minStock: 500,
    currentStock: 1200,
    averageCost: 0.35,
  },
  {
    id: "9a1b2c3d-2222-4a2b-9c1d-000000000002",
    sku: "PRD-002",
    name: "Tinta Acrílica Branca 18L",
    unit: "L",
    minStock: 20,
    currentStock: 8,
    averageCost: 145.9,
  },
];
