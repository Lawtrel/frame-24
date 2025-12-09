"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🚀 Tentando login com:", formData.email);
      
      const response = await AuthService.login(formData.email, formData.password);
      
      console.log("✅ Resposta da API:", response); // Veja isso no console do navegador (F12)

      // A API pode retornar o token dentro de data ou diretamente, dependendo do axios
      // Tenta pegar o token de várias formas possíveis para garantir
      const token = response.data?.accessToken || response.data?.access_token || (response as any).accessToken;
      
      console.log("🔑 Token extraído:", token);

      if (token) {
        // Salvar token
        localStorage.setItem("admin_token", token);
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;
        
        console.log("💾 Token salvo. Redirecionando...");

        // Forçar redirecionamento via window para garantir que o estado do App reseta
        window.location.href = "/"; 
      } else {
        console.error("❌ Token não encontrado na resposta");
        setError("Erro: Token de acesso não recebido.");
      }

    } catch (err: any) {
      console.error("❌ Erro no login:", err);
      // Tenta mostrar uma mensagem de erro mais útil
      const msg = err.response?.data?.message || "Credenciais inválidas ou erro no servidor.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 border border-border bg-zinc-900/50 p-8 rounded-xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lawtrel <span className="text-accent-red">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Entre com as suas credenciais de administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red"
                placeholder="admin@lawtrel.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent-red focus:outline-none focus:ring-1 focus:ring-accent-red"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-accent-red px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}