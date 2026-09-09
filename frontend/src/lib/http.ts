import axios from "axios";

// baseURL aponta para o mesmo host — em dev, o MSW intercepta antes de sair da rede.
// Quando plugarmos a API real (.NET ou Node), só trocamos essa env var, o resto do
// front não muda: essa é a razão de existir um client centralizado em vez de fetch
// espalhado pelos componentes.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
