"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthActions({
  tenantSlug,
}: {
  tenantSlug: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hasSession, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading || !hasSession || isAuthenticated) {
      return;
    }

    const isOnLogin = pathname?.includes(`/${tenantSlug}/auth/login`) ?? false;
    const isOnRegister =
      pathname?.includes(`/${tenantSlug}/auth/register`) ?? false;

    if (isOnLogin || isOnRegister) {
      return;
    }

    const returnUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : `/${tenantSlug}`;

    router.replace(
      `/${tenantSlug}/auth/register?intent=activate&returnUrl=${encodeURIComponent(returnUrl)}`,
    );
  }, [
    hasSession,
    isAuthenticated,
    isLoading,
    pathname,
    router,
    tenantSlug,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-16 animate-pulse rounded-lg bg-zinc-800/80" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800/80" />
      </div>
    );
  }

  if (hasSession) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 text-zinc-300 hover:text-white font-medium transition-colors text-sm"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/${tenantSlug}/auth/login`}
        className="px-4 py-2 text-zinc-300 hover:text-white font-medium transition-colors text-sm"
      >
        Entrar
      </Link>
      <Link
        href={`/${tenantSlug}/auth/register`}
        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20 text-sm"
      >
        Cadastrar
      </Link>
    </>
  );
}
