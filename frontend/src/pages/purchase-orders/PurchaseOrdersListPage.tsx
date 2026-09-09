import { Link } from "react-router-dom";
import { usePurchaseOrders } from "../../api/purchaseOrders";
import { useSuppliers } from "../../api/suppliers";

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  received: "Recebido",
  partially_received: "Recebido parcial",
  cancelled: "Cancelado",
};

export function PurchaseOrdersListPage() {
  const { data: orders, isLoading, isError, error } = usePurchaseOrders();
  const { data: suppliers } = useSuppliers();

  if (isLoading) return <p>Carregando pedidos...</p>;
  if (isError) return <p>Erro ao carregar pedidos: {String(error)}</p>;

  function supplierName(supplierId: string) {
    return suppliers?.find((s) => s.id === supplierId)?.name ?? supplierId;
  }

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Pedidos de compra</h1>
        <Link to="/purchase-orders/new">Novo pedido</Link>
      </header>
      <table>
        <thead>
          <tr>
            <th>Fornecedor</th>
            <th>Status</th>
            <th>Itens</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>
                <Link to={`/purchase-orders/${order.id}`}>{supplierName(order.supplierId)}</Link>
              </td>
              <td>{STATUS_LABEL[order.status]}</td>
              <td>{order.items.length}</td>
              <td>R$ {order.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
