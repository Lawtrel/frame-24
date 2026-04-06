"use client";

import { useCompany } from "@/hooks/use-company";
import { useComplexes } from "@/hooks/use-complexes";
import { useFilters } from "@/store/use-filters";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AuthActions } from "@/components/layout/auth-actions";
import { useEffect } from "react";

interface Company {
  id: string;
  corporate_name: string;
  trade_name?: string | null;
  tenant_slug: string;
}

interface Complex {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
}

export function AppHeader({ tenantSlug }: { tenantSlug: string }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.includes("/auth/") ?? false;
  const router = useRouter();
  const { data: company } = useCompany(tenantSlug, { enabled: !isAuthRoute });
  const { data: complexes } = useComplexes(tenantSlug, {
    enabled: !isAuthRoute,
  });
  const { selectedComplexId, setComplex, selectedCity, setCity, setTenantSlug } =
    useFilters();

  const complexesList = (complexes as unknown as Complex[]) || [];
  const companyData = (company as Company | undefined) ?? undefined;

  // Extrair cidades únicas
  const cities = Array.from(
    new Set(complexesList.map((c) => c.city).filter(Boolean)),
  );

  // Filtrar complexos por cidade
  const filteredComplexes = selectedCity
    ? complexesList.filter((c) => c.city === selectedCity)
    : complexesList;

  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setTenantSlug(tenantSlug);
  }, [setTenantSlug, tenantSlug]);

  if (isAuthRoute) {
    return (
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => router.push(`/${tenantSlug}`)}
              className="text-2xl font-bold text-white hover:text-red-400 transition-colors"
            >
              Frame<span className="text-red-500">24</span>
            </button>
            <AuthActions tenantSlug={tenantSlug} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/${tenantSlug}`)}
              className="text-2xl font-bold text-white hover:text-red-400 transition-colors"
            >
              Frame<span className="text-red-500">24</span>
            </button>
            <div className="h-8 w-px bg-zinc-700" />
            <div className="text-sm">
              <div className="text-zinc-400">Rede:</div>
              <div className="text-white font-medium">
                {companyData?.trade_name || companyData?.corporate_name}
              </div>
            </div>
          </div>

          {/* Filtros e Auth */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Seletor de Cidade */}
            {cities.length > 1 && (
              <select
                value={selectedCity || ""}
                onChange={(e) => {
                  setCity(e.target.value || null);
                  setComplex(null); // Reset complex when city changes
                }}
                className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-red-500/50 transition-colors focus:outline-none focus:border-red-500 cursor-pointer hidden md:block"
              >
                <option value="">Todas as cidades</option>
                {cities.map((city) => (
                  <option key={city} value={city!}>
                    {city}
                  </option>
                ))}
              </select>
            )}

            {/* Seletor de Complexo */}
            {filteredComplexes.length > 0 && (
              <select
                value={selectedComplexId || ""}
                onChange={(e) => setComplex(e.target.value || null)}
                className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-red-500/50 transition-colors focus:outline-none focus:border-red-500 cursor-pointer min-w-[200px] hidden md:block"
              >
                <option value="">Todos os cinemas</option>
                {filteredComplexes.map((complex) => (
                  <option key={complex.id} value={complex.id}>
                    {complex.name}
                    {complex.city && ` - ${complex.city}`}
                  </option>
                ))}
              </select>
            )}

            <div className="h-8 w-px bg-zinc-700 hidden md:block" />

            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/80" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-800/70" />
                </div>
                <AuthActions tenantSlug={tenantSlug} />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/${tenantSlug}/profile`)}
                  className="text-right hidden sm:block hover:opacity-80 transition-opacity"
                >
                  <div className="text-sm font-medium text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {user?.loyalty_level} • {user?.accumulated_points} pts
                  </div>
                </button>
                <AuthActions tenantSlug={tenantSlug} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AuthActions tenantSlug={tenantSlug} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
