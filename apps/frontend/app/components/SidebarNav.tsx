import { Sidebar, SidebarContent, SidebarSection, SidebarHeader, SidebarItem, SidebarSubmenuItem } from "@repo/ui/sidebar";
import { PRIMARY_NAVIGATION } from '../config/navigation'; 
import { NavItem } from '../types/navigation';
import React from 'react';

const isNavItemActive = (item: NavItem, currentPath: string): boolean => {
    const path = currentPath.slice(1); 
    
    if (item.submenu) {
        return path.startsWith(item.slug);
    }
    
    return path === item.slug;
};


interface SidebarNavProps {
    currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
    
    return (
        <Sidebar> 
            <SidebarHeader title="Frame 24" />
            
            <SidebarContent>
                {PRIMARY_NAVIGATION.map((section) => (
                    <SidebarSection key={section.title} title={section.title}>
                        {section.items.map((item) => {
                            
                            const isActive = isNavItemActive(item, currentPath);

                            let activeSubmenuLabel: string | undefined;
                            if (isActive && item.submenu) {
                                const activeSubItem = item.submenu.find(sub => isNavItemActive(sub, currentPath));
                                activeSubmenuLabel = activeSubItem?.label;
                            }

                            return (
                                <SidebarItem
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    href={item.href}
                                    hasSubmenu={!!item.submenu}
                                    isActive={isActive}
                                >
                                    {item.submenu && item.submenu.map(sub => (
                                        <SidebarSubmenuItem
                                            key={sub.label}
                                            label={sub.label}
                                            href={sub.href}
                                            isActive={sub.label === activeSubmenuLabel}
                                        />
                                    ))}
                                </SidebarItem>
                            );
                        })}
                    </SidebarSection>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}