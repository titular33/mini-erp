import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../lib/http";
import type { Supplier, SupplierInput } from "../types/api";

const SUPPLIERS_KEY = ["suppliers"] as const;

async function fetchSuppliers(): Promise<Supplier[]> {
  const { data } = await http.get<Supplier[]>("/suppliers");
  return data;
}

async function createSupplier(input: SupplierInput): Promise<Supplier> {
  const { data } = await http.post<Supplier>("/suppliers", input);
  return data;
}

async function updateSupplier(id: string, input: SupplierInput): Promise<Supplier> {
  const { data } = await http.put<Supplier>(`/suppliers/${id}`, input);
  return data;
}

export function useSuppliers() {
  return useQuery({ queryKey: SUPPLIERS_KEY, queryFn: fetchSuppliers });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SupplierInput }) =>
      updateSupplier(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY }),
  });
}
