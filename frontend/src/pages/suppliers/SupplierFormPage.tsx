import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSupplier, useSuppliers, useUpdateSupplier } from "../../api/suppliers";
import { supplierSchema, type SupplierFormValues } from "./supplierSchema";

export function SupplierFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: suppliers } = useSuppliers();
  const existing = suppliers?.find((s) => s.id === id);

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    values: existing
      ? { name: existing.name, taxId: existing.taxId, email: existing.email, phone: existing.phone }
      : undefined,
  });

  async function onSubmit(values: SupplierFormValues) {
    if (isEditing && id) {
      await updateSupplier.mutateAsync({ id, input: values });
    } else {
      await createSupplier.mutateAsync(values);
    }
    navigate("/suppliers");
  }

  return (
    <div>
      <h1>{isEditing ? "Editar fornecedor" : "Novo fornecedor"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" {...register("name")} />
          {errors.name && <span role="alert">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="taxId">CNPJ</label>
          <input id="taxId" {...register("taxId")} placeholder="00.000.000/0000-00" />
          {errors.taxId && <span role="alert">{errors.taxId.message}</span>}
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="phone">Telefone</label>
          <input id="phone" {...register("phone")} />
          {errors.phone && <span role="alert">{errors.phone.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
