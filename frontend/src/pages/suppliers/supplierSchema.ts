import { z } from "zod";

// Schema único usado tanto pela validação do formulário (react-hook-form resolver)
// quanto como fonte de tipos — evita o form e o tipo de API divergirem com o tempo.
export const supplierSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  taxId: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve estar no formato 00.000.000/0000-00"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido"),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
