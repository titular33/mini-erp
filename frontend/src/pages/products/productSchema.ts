import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(2, "SKU deve ter ao menos 2 caracteres"),
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  unit: z.enum(["UN", "KG", "CX", "L"]),
  minStock: z.coerce.number().min(0, "Estoque mínimo não pode ser negativo"),
});

// z.coerce.number() tem tipo de ENTRADA "unknown" (o que o input HTML manda,
// string) e tipo de SAÍDA "number" (depois da coerção do Zod). ProductFormInput
// é o que o formulário manipula (register/defaultValues); ProductFormValues é o
// que chega em onSubmit já validado e coagido.
export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
