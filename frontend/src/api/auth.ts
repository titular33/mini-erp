import { useMutation } from "@tanstack/react-query";
import { http } from "../lib/http";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { id: string; name: string; role: "admin" | "operator" };
}

async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login", input);
  return data;
}

export function useLogin() {
  return useMutation({ mutationFn: login });
}
