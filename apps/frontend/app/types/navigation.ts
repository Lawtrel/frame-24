import { ReactNode } from "react";

export interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
    slug: string; 
    submenu?: NavItem[];
}

export interface NavSection {
    title: string;
    items: NavItem[];
}