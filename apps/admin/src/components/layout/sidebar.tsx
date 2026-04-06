"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Film,
  DollarSign,
  Settings,
  Package,
  LogOut,
  CalendarClock,
  Ticket,
  Popcorn,
  Truck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CalendarClock, label: "Programação", href: "/schedule" },
  { icon: Film, label: "Catálogo de Filmes", href: "/catalog" },
  { icon: Popcorn, label: "Produtos & Combos", href: "/products" },
  { icon: Ticket, label: "Tipos de Ingresso", href: "/ticket-types" },
  { icon: Truck, label: "Fornecedores", href: "/suppliers" },
  { icon: Users, label: "Usuários & Identidade", href: "/identity" },
  { icon: DollarSign, label: "Financeiro", href: "/finance" },
  { icon: Package, label: "Estoque", href: "/stock" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col py-4">
      <div className="mb-8 px-6">
        <h1 className="text-xl font-bold text-foreground">
          Frame24 <span className="text-accent-red">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-red/10 text-accent-red"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-800 px-4 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-950/30 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}
