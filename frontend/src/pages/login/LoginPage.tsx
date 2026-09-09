import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../../api/auth";
import { useAuth } from "../../auth/AuthContext";
import { loginSchema, type LoginFormValues } from "./loginSchema";

export function LoginPage() {
  const login = useLogin();
  const { login: setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/suppliers";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      const { token, user } = await login.mutateAsync(values);
      setSession(token, user);
      navigate(redirectTo, { replace: true });
    } catch {
      // erro de credenciais é exibido abaixo via login.isError
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto" }}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <span role="alert">{errors.password.message}</span>}
        </div>

        {login.isError && <p role="alert">Credenciais inválidas</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
