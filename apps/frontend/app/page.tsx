"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarSection,
    SidebarSubmenuItem,
    SidebarUser,
} from "@repo/ui/sidebar";
import { LayoutDashboard, Ticket } from "lucide-react";

export default function Page() {
    return (
        <main>
            <Sidebar>
                <SidebarHeader title="Frame 24" />
                <SidebarContent>
                    <SidebarSection title="Menu">
                        <SidebarItem icon={<LayoutDashboard />} label="Dashboard" />
                        <SidebarItem icon={<Ticket />} label="Tickets">
                            <SidebarSubmenuItem label="Gerenciar" icon={<Ticket />} />
                        </SidebarItem>
                    </SidebarSection>
                </SidebarContent>
            </Sidebar>
        </main>
    );
}
