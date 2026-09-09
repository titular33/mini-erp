import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSuppliers } from "../../api/suppliers";
import { useProducts } from "../../api/products";
import { useCreatePurchaseOrder } from "../../api/purchaseOrders";
import { purchaseOrderSchema, type PurchaseOrderFormValues } from "./purchaseOrderSchema";

export function PurchaseOrderFormPage() {
  const navigate = useNavigate();
  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();
  const createPurchaseOrder = useCreatePurchaseOrder();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: "",
      items: [{ productId: "", quantityOrdered: 1, unitPrice: 0 }],
    },
  });

  // useFieldArray gerencia a lista de itens do pedido como um array dentro do
  // mesmo form controlado — cada linha tem seu próprio registro de validação,
  // sem precisar de N useState soltos nem re-render manual da lista.
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");
  const total = items?.reduce((sum, item) => sum + (item.quantityOrdered || 0) * (item.unitPrice || 0), 0) ?? 0;

  async function onSubmit(values: PurchaseOrderFormValues) {
    await createPurchaseOrder.mutateAsync(values);
    navigate("/purchase-orders");
  }

  const activeSuppliers = suppliers?.filter((s) => s.status === "active") ?? [];

  return (
    <div>
      <h1>Novo pedido de compra</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="supplierId">Fornecedor</label>
          <select id="supplierId" {...register("supplierId")}>
            <option value="">Selecione...</option>
            {activeSuppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId && <span role="alert">{errors.supplierId.message}</span>}
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço unitário</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td>
                  <select {...register(`items.${index}.productId`)}>
                    <option value="">Selecione...</option>
                    {products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <span role="alert">{errors.items[index]?.productId?.message}</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    step="1"
                    {...register(`items.${index}.quantityOrdered`)}
                  />
                  {errors.items?.[index]?.quantityOrdered && (
                    <span role="alert">{errors.items[index]?.quantityOrdered?.message}</span>
                  )}
                </td>
                <td>
                  <input type="number" step="0.01" {...register(`items.${index}.unitPrice`)} />
                  {errors.items?.[index]?.unitPrice && (
                    <span role="alert">{errors.items[index]?.unitPrice?.message}</span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={() => append({ productId: "", quantityOrdered: 1, unitPrice: 0 })}
        >
          Adicionar item
        </button>
        {errors.items?.root && <p role="alert">{errors.items.root.message}</p>}

        <p>
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Criar pedido"}
        </button>
      </form>
    </div>
  );
}
