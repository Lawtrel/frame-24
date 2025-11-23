import {
    LayoutDashboard, 
    Film, 
    Package, 
    ShoppingCart, 
    Landmark, 
    Settings, 
    Users, 
    Tag,
    Building2,
    DoorOpen,
    Calendar,
    Truck,
    FileText, // Adicionado para Transações
    ArrowDown, // Adicionado para Contas a Pagar
    ArrowUp, // Adicionado para Contas a Receber
    BarChart3 // Adicionado para Fluxo de Caixa
} from "lucide-react";
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
        ],
    },
    {
        title: "Catálogo",
        items: [
            {
                label: "Filmes",
                href: "/movies",
                icon: <Film size={20} />,
                slug: "movies",
                submenu: [
                    {
                        label: "Listar Filmes",
                        href: "/movies",
                        icon: <Film size={16} />,
                        slug: "movies"
                    },
                    {
                        label: "Cadastrar Filme",
                        href: "/movies/cadastrar",
                        icon: <Film size={16} />,
                        slug: "movies/cadastrar"
                    },
                    {
                        label: "Categorias",
                        href: "/movie-categories",
                        icon: <Tag size={16} />,
                        slug: "movie-categories"
                    },
                ],
            },
            {
                label: "Produtos",
                href: "/products",
                icon: <Package size={20} />,
                slug: "products",
                submenu: [
                    {
                        label: "Listar Produtos",
                        href: "/products",
                        icon: <Package size={16} />,
                        slug: "products"
                    },
                    {
                        label: "Cadastrar Produto",
                        href: "/products/create",
                        icon: <Package size={16} />,
                        slug: "products/create"
                    },
                    {
                        label: "Categorias",
                        href: "/product-categories",
                        icon: <Tag size={16} />,
                        slug: "product-categories"
                    },
                ],
            },
        ],
    },
    {
        title: "Operações",
        items: [
            {
                label: "Complexos",
                href: "/cinema-complexes",
                icon: <Building2 size={20} />,
                slug: "cinema-complexes",
            },
            {
                label: "Salas",
                href: "/rooms",
                icon: <DoorOpen size={20} />,
                slug: "rooms",
            },
            {
                label: "Sessões",
                href: "/showtimes",
                icon: <Calendar size={20} />,
                slug: "showtimes",
            },
        ],
    },
    {
        title: "Inventário",
        items: [
            {
                label: "Fornecedores",
                href: "/suppliers",
                icon: <Truck size={20} />,
                slug: "suppliers",
            },
        ],
    },
    {
        title: "Gestão",
        items: [
            {
                label: "Usuários",
                href: "/users",
                icon: <Users size={20} />,
                slug: "users",
            },
            {
                label: "Vendas",
                href: "/sales/pos",
                icon: <ShoppingCart size={20} />,
                slug: "sales",
                submenu: [
                    {
                        label: "Ponto de Venda (PDV)",
                        href: "/sales/pos",
                        icon: <ShoppingCart size={16} />,
                        slug: "sales/pos"
                    },
                    {
                        label: "Transações",
                        href: "/sales/transactions",
                        icon: <FileText size={16} />,
                        slug: "sales/transactions"
                    },
                ],
            },
            { 
                label: "Financeiro", 
                href: "/finance", 
                icon: <Landmark size={20} />, 
                slug: "finance",
                submenu: [
                    {
                        label: "Visão Geral",
                        href: "/finance",
                        icon: <Landmark size={16} />,
                        slug: "finance"
                    },
                    {
                        label: "Contas a Pagar",
                        href: "/finance/accounts-payable",
                        icon: <ArrowDown size={16} />,
                        slug: "finance/accounts-payable"
                    },
                    {
                        label: "Contas a Receber",
                        href: "/finance/accounts-receivable",
                        icon: <ArrowUp size={16} />,
                        slug: "finance/accounts-receivable"
                    },
                    {
                        label: "Fluxo de Caixa",
                        href: "/finance/cash-flow",
                        icon: <BarChart3 size={16} />,
                        slug: "finance/cash-flow"
                    },
                ],
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
