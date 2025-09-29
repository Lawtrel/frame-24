import { LayoutDashboard, Ticket, Landmark, Settings, Package, ShoppingCart } from "lucide-react";
import { NavSection } from "../types/navigation";

// Estrutura de navegação completa
export const PRIMARY_NAVIGATION: NavSection[] = [
    {
        title: "Menu Principal",
        items: [
            { 
                label: "Dashboard", 
                href: "/dashboard", 
                icon: <LayoutDashboard size={20} />, 
                slug: "dashboard" 
            },
            {
                label: "Inventário",
                href: "/inventory",
                icon: <Package size={20} />,
                slug: "inventory",
                submenu: [
                    { 
                        label: "Transferências", 
                        href: "/inventory/transfers", 
                        icon: <Ticket size={16} />, 
                        slug: "inventory/transfers" 
                    },
                    { 
                        label: "Entrada/Saída", 
                        href: "/inventory/entries", 
                        icon: <Ticket size={16} />, 
                        slug: "inventory/entries" 
                    },
                ],
            },
            {
                label: "Vendas",
                href: "/sales",
                icon: <ShoppingCart size={20} />,
                slug: "sales",
            },
            { 
                label: "Financeiro", 
                href: "/finance", 
                icon: <Landmark size={20} />, 
                slug: "finance" 
            },
        ],
    },
    {
        title: "Sistema",
        items: [
            { 
                label: "Configurações", 
                href: "/settings", 
                icon: <Settings size={20} />, 
                slug: "settings" 
            },
        ],
    },
];