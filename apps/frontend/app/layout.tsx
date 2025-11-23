import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import { headers } from 'next/headers'; 

import { SidebarNav } from './components/SidebarNav'; 


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Frame 24",
    description: "Cinema Management System",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    
    const headersList = await headers();
    const fullPath = headersList.get('x-pathname') || '/';
    const currentPath = new URL(fullPath, 'http://dummy.com').pathname; 

    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head />
            <body className={inter.className}>
                <ThemeProvider>
                    <AuthProvider>
                
                    
                    <div className="relative flex min-h-screen overflow-x-hidden">
                        
                        <SidebarNav currentPath={currentPath} />
                        
                        <main className="flex-1 transition-all duration-300">
                            {children} 
                        </main>
                        
                    </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>