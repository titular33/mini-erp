import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../lib/http";
import type { PurchaseOrder, PurchaseOrderInput, ReceivePurchaseOrderInput } from "../types/api";

const PURCHASE_ORDERS_KEY = ["purchase-orders"] as const;
const PRODUCTS_KEY = ["products"] as const;

async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data } = await http.get<PurchaseOrder[]>("/purchase-orders");
  return data;
}

async function fetchPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const { data } = await http.get<PurchaseOrder>(`/purchase-orders/${id}`);
  return data;
}

async function createPurchaseOrder(input: PurchaseOrderInput): Promise<PurchaseOrder> {
  const { data } = await http.post<PurchaseOrder>("/purchase-orders", input);
  return data;
}

async function submitPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const { data } = await http.post<PurchaseOrder>(`/purchase-orders/${id}/submit`);
  return data;
}

async function cancelPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const { data } = await http.post<PurchaseOrder>(`/purchase-orders/${id}/cancel`);
  return data;
}

async function receivePurchaseOrder(
  id: string,
  input: ReceivePurchaseOrderInput,
): Promise<PurchaseOrder> {
  const { data } = await http.post<PurchaseOrder>(`/purchase-orders/${id}/receive`, input);
  return data;
}

export function usePurchaseOrders() {
  return useQuery({ queryKey: PURCHASE_ORDERS_KEY, queryFn: fetchPurchaseOrders });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: [...PURCHASE_ORDERS_KEY, id],
    queryFn: () => fetchPurchaseOrder(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY }),
  });
}

export function useSubmitPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY }),
  });
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY }),
  });
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReceivePurchaseOrderInput }) =>
      receivePurchaseOrder(id, input),
    onSuccess: () => {
      // Recebimento também muda o estoque derivado dos produtos — invalida os
      // dois caches, não só o de pedidos.
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
