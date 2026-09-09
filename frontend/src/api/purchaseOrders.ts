import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../lib/http";
import type { PurchaseOrder, PurchaseOrderInput } from "../types/api";

const PURCHASE_ORDERS_KEY = ["purchase-orders"] as const;

async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data } = await http.get<PurchaseOrder[]>("/purchase-orders");
  return data;
}

async function createPurchaseOrder(input: PurchaseOrderInput): Promise<PurchaseOrder> {
  const { data } = await http.post<PurchaseOrder>("/purchase-orders", input);
  return data;
}

export function usePurchaseOrders() {
  return useQuery({ queryKey: PURCHASE_ORDERS_KEY, queryFn: fetchPurchaseOrders });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY }),
  });
}
