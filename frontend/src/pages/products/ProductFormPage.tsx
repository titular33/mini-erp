import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateProduct, useProducts, useUpdateProduct } from "../../api/products";
import { productSchema, type ProductFormInput, type ProductFormValues } from "./productSchema";

export function ProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: products } = useProducts();
  const existing = products?.find((p) => p.id === id);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: existing
      ? { sku: existing.sku, name: existing.name, unit: existing.unit, minStock: existing.minStock }
      : undefined,
  });

  async function onSubmit(values: ProductFormValues) {
    if (isEditing && id) {
      await updateProduct.mutateAsync({ id, input: values });
    } else {
      await createProduct.mutateAsync(values);
    }
    navigate("/products");
  }

  return (
    <div>
      <h1>{isEditing ? "Editar produto" : "Novo produto"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sku">SKU</label>
          <input id="sku" {...register("sku")} />
          {errors.sku && <span role="alert">{errors.sku.message}</span>}
        </div>

        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" {...register("name")} />
          {errors.name && <span role="alert">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="unit">Unidade</label>
          <select id="unit" {...register("unit")}>
            <option value="UN">UN</option>
            <option value="KG">KG</option>
            <option value="CX">CX</option>
            <option value="L">L</option>
          </select>
          {errors.unit && <span role="alert">{errors.unit.message}</span>}
        </div>

        <div>
          <label htmlFor="minStock">Estoque mínimo</label>
          <input id="minStock" type="number" step="1" {...register("minStock")} />
          {errors.minStock && <span role="alert">{errors.minStock.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
