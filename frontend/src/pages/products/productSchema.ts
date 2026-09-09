import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(2, "SKU deve ter ao menos 2 caracteres"),
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  unit: z.enum(["UN", "KG", "CX", "L"]),
  minStock: z.coerce.number().min(0, "Estoque mínimo não pode ser negativo"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
