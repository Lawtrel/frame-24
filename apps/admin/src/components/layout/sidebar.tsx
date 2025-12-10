"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Film, 
  DollarSign, 
  Settings, 
  Package,
  LogOut 
} from "lucide-react";
import { AuthService } from "@/services/auth-service";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Usuários & Identidade", href: "/identity" },
  { icon: Film, label: "Catálogo de Filmes", href: "/catalog" },
  { icon: DollarSign, label: "Financeiro", href: "/finance" },
  { icon: Package, label: "Estoque", href: "/stock" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Tenta avisar o backend (opcional, mas boa prática)
      await AuthService.logout();
    } catch (error) {
      console.error("Erro silencioso no logout:", error);
    } finally {
      // Limpeza local obrigatória
      localStorage.removeItem("admin_token");
      
      // Limpa o cookie forçando a expiração
      document.cookie = "admin_token=; path=/; max-age=0; SameSite=Strict";
      
      // Força o redirecionamento via window para garantir o reset do estado da aplicação
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex flex-col h-full py-4">
      {/* Cabeçalho da Sidebar */}
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-foreground">
          Frame24 <span className="text-accent-red">Admin</span>
        </h1>
      </div>
      
      {/* Navegação Principal */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? "bg-accent-red/10 text-accent-red" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Botão de Logout (Rodapé da Sidebar) */}
      <div className="px-4 mt-auto border-t border-zinc-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 rounded-lg hover:bg-red-950/30 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );
}