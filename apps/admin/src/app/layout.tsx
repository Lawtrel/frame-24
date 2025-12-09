"use client";

import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("admin_token");
    
    if (!token && !isLoginPage) {
      router.push("/login");
    }
  }, [pathname, isLoginPage, router]);

  return (
    <html lang="pt-BR" className="dark">
      <body className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* Renderiza o conteúdo apenas quando montado para evitar erros de hidratação */}
        {!isMounted ? (
          <div className="flex h-full w-full items-center justify-center">
            {/* Opcional: Loader simples */}
          </div>
        ) : (
          <>
            {!isLoginPage && (
              <aside className="w-64 border-r border-border bg-zinc-900/50 hidden md:block">
                <Sidebar />
              </aside>
            )}
            
            <main className={`flex-1 overflow-y-auto ${!isLoginPage ? 'p-8' : ''}`}>
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  );
}