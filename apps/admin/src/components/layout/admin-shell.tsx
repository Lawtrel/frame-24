"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const isLoginPage = pathname === "/login";
  const isReady = !isPending;
  const authenticated = !!session;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!authenticated && !isLoginPage) {
      router.replace("/login");
      return;
    }

    if (authenticated && isLoginPage) {
      router.replace("/");
    }
  }, [authenticated, isLoginPage, isReady, router]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center text-sm text-zinc-400">
        Carregando...
      </main>
    );
  }

  if (!authenticated && !isLoginPage) {
    return null;
  }

  return (
    <>
      {!isLoginPage && (
        <aside className="hidden w-64 border-r border-border bg-zinc-900/50 md:block">
          <Sidebar />
        </aside>
      )}

      <main className={`flex-1 overflow-y-auto ${!isLoginPage ? "p-8" : ""}`}>
        {children}
      </main>
    </>
  );
}
