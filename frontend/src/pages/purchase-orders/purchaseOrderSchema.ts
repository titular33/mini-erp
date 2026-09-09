import { z } from "zod";

const itemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantityOrdered: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  unitPrice: z.coerce.number().positive("Preço deve ser maior que zero"),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Selecione um fornecedor"),
  items: z.array(itemSchema).min(1, "Adicione ao menos um item"),
});

export type PurchaseOrderFormInput = z.input<typeof purchaseOrderSchema>;
export type PurchaseOrderFormValues = z.output<typeof purchaseOrderSchema>;
