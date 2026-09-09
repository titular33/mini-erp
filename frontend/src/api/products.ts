import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../lib/http";
import type { Product, ProductInput } from "../types/api";

const PRODUCTS_KEY = ["products"] as const;

async function fetchProducts(): Promise<Product[]> {
  const { data } = await http.get<Product[]>("/products");
  return data;
}

async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await http.post<Product>("/products", input);
  return data;
}

async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data } = await http.put<Product>(`/products/${id}`, input);
  return data;
}

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: fetchProducts });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) => updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
