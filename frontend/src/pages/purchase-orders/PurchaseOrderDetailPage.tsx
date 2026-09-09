import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  usePurchaseOrder,
  useSubmitPurchaseOrder,
  useCancelPurchaseOrder,
  useReceivePurchaseOrder,
} from "../../api/purchaseOrders";
import { useSuppliers } from "../../api/suppliers";
import { useProducts } from "../../api/products";

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  received: "Recebido",
  partially_received: "Recebido parcial",
  cancelled: "Cancelado",
};

interface ReceiveFormValues {
  quantities: Record<string, number>;
}

export function PurchaseOrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = usePurchaseOrder(id);
  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();

  const submitOrder = useSubmitPurchaseOrder();
  const cancelOrder = useCancelPurchaseOrder();
  const receiveOrder = useReceivePurchaseOrder();

  const { register, handleSubmit, reset } = useForm<ReceiveFormValues>();

  if (isLoading || !order) return <p>Carregando pedido...</p>;

  const supplierName = suppliers?.find((s) => s.id === order.supplierId)?.name ?? order.supplierId;
  const canReceive = order.status === "submitted" || order.status === "partially_received";

  function productName(productId: string) {
    return products?.find((p) => p.id === productId)?.name ?? productId;
  }

  async function onReceive(values: ReceiveFormValues) {
    if (!order) return;
    const items = Object.entries(values.quantities)
      .map(([purchaseOrderItemId, quantityReceived]) => ({
        purchaseOrderItemId,
        quantityReceived: Number(quantityReceived),
      }))
      .filter((item) => item.quantityReceived > 0);

    if (items.length === 0) return;

    await receiveOrder.mutateAsync({ id: order.id, input: { items } });
    reset();
  }

  return (
    <div>
      <h1>Pedido de compra</h1>
      <p>
        <strong>Fornecedor:</strong> {supplierName}
      </p>
      <p>
        <strong>Status:</strong> {STATUS_LABEL[order.status]}
      </p>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Pedido</th>
            <th>Recebido</th>
            <th>Restante</th>
            {canReceive && <th>Receber agora</th>}
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            const remaining = item.quantityOrdered - item.quantityReceived;
            return (
              <tr key={item.id}>
                <td>{productName(item.productId)}</td>
                <td>{item.quantityOrdered}</td>
                <td>{item.quantityReceived}</td>
                <td>{remaining}</td>
                {canReceive && (
                  <td>
                    <input
                      type="number"
                      step="1"
                      min={0}
                      max={remaining}
                      defaultValue={0}
                      disabled={remaining === 0}
                      {...register(`quantities.${item.id}`)}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p>
        <strong>Total: R$ {order.totalAmount.toFixed(2)}</strong>
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        {order.status === "draft" && (
          <button
            type="button"
            disabled={submitOrder.isPending}
            onClick={() => submitOrder.mutate(order.id)}
          >
            Submeter pedido
          </button>
        )}

        {(order.status === "draft" || order.status === "submitted") && (
          <button
            type="button"
            disabled={cancelOrder.isPending}
            onClick={() => cancelOrder.mutate(order.id)}
          >
            Cancelar pedido
          </button>
        )}

        {canReceive && (
          <button type="button" disabled={receiveOrder.isPending} onClick={handleSubmit(onReceive)}>
            {receiveOrder.isPending ? "Recebendo..." : "Confirmar recebimento"}
          </button>
        )}
      </div>
    </div>
  );
}
