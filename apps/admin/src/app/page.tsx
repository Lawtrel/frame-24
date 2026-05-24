"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Film, Ticket, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { CatalogService } from "@/services/catalog-service";
import { UsersService } from "@/services/users-service";
import { ScheduleService } from "@/services/schedule-service";
import { PosService, type PosSession, type PosTransaction } from "@/services/pos-service";
import { apiClient } from "@/services/api-config";

interface DashboardStat {
  title: string;
  value: string;
  icon: typeof TrendingUp;
  color: string;
  loading: boolean;
}

interface RecentSale {
  id: string;
  sale_number: string;
  total_amount: string;
  status?: string;
  payment_method?: string;
  sale_date: string;
  movie_title?: string;
}

interface PopularMovie {
  id: string;
  title: string;
  showtime_count: number;
  sold_seats: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: "Total de Vendas", value: "R$ 0,00", icon: TrendingUp, color: "text-green-500", loading: true },
    { title: "Usuários Ativos", value: "0", icon: Users, color: "text-blue-500", loading: true },
    { title: "Filmes em Cartaz", value: "0", icon: Film, color: "text-purple-500", loading: true },
    { title: "Ingressos Hoje", value: "0", icon: Ticket, color: "text-orange-500", loading: true },
  ]);

  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [popularMovies, setPopularMovies] = useState<PopularMovie[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateStat = useCallback((title: string, value: string) => {
    setStats((prev) =>
      prev.map((s) => (s.title === title ? { ...s, value, loading: false } : s)),
    );
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError(null);

      await Promise.allSettled([
        fetchTotalSales(),
        fetchActiveUsers(),
        fetchActiveMovies(),
        fetchTodayTickets(),
        fetchRecentSales(),
        fetchPopularMovies(),
      ]);
    };

    fetchDashboardData();
  }, []);

  const fetchTotalSales = async () => {
    try {
      const sessions: PosSession[] = await PosService.getPosSessions();
      const total = Array.isArray(sessions)
        ? sessions.reduce((acc, s) => acc + (s.total_received_amount ?? 0), 0)
        : 0;
      updateStat("Total de Vendas", formatCurrency(total));
    } catch {
      updateStat("Total de Vendas", "R$ 0,00");
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const data = await UsersService.getAll();
      const count = Array.isArray(data) ? data.length : 0;
      updateStat("Usuários Ativos", String(count));
    } catch {
      updateStat("Usuários Ativos", "0");
    }
  };

  const fetchActiveMovies = async () => {
    try {
      const data = await CatalogService.getMovies();
      const movies = (Array.isArray(data) ? data : []) as Record<string, unknown>[];
      const activeCount = movies.filter((m) => m.active === true).length;
      updateStat("Filmes em Cartaz", String(activeCount));
    } catch {
      updateStat("Filmes em Cartaz", "0");
    }
  };

  const fetchTodayTickets = async () => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const data = await ScheduleService.getShowtimes();
      const showtimes = (Array.isArray(data) ? data : []) as Record<string, unknown>[];

      const todayShowtimes = showtimes.filter((s) => {
        const startTime = s.start_time;
        if (!startTime) return false;
        return new Date(startTime as string) >= todayStart;
      });

      const totalSold = todayShowtimes.reduce(
        (acc, s) => acc + ((s.sold_seats as number) ?? 0),
        0,
      );
      updateStat("Ingressos Hoje", String(totalSold));
    } catch {
      updateStat("Ingressos Hoje", "0");
    }
  };

  const fetchRecentSales = async () => {
    try {
      setSalesLoading(true);
      const response = await apiClient.get("/v1/sales", {
        params: { limit: 10, page: 1 },
      });
      const sales = Array.isArray(response.data) ? response.data : [];

      const mapped: RecentSale[] = sales.map((sale: Record<string, unknown>) => ({
        id: sale.id as string,
        sale_number: (sale.sale_number as string) ?? "—",
        total_amount: (sale.total_amount as string) ?? "0",
        status: sale.status as string | undefined,
        payment_method: sale.payment_method as string | undefined,
        sale_date: (sale.created_at as string) ?? (sale.sale_date as string) ?? "",
        movie_title:
          (sale.movie as Record<string, unknown> | null)?.title as string | undefined,
      }));

      setRecentSales(mapped);
    } catch {
      setRecentSales([]);
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      setMoviesLoading(true);
      const data = await ScheduleService.getShowtimes();
      const showtimes = (Array.isArray(data) ? data : []) as Record<string, unknown>[];

      const movieMap = new Map<string, { title: string; showtime_count: number; sold_seats: number }>();

      for (const showtime of showtimes) {
        const movie = showtime.movie as Record<string, unknown> | undefined;
        if (!movie?.id) continue;

        const id = movie.id as string;
        const existing = movieMap.get(id) ?? {
          title: (movie.title as string) ?? "—",
          showtime_count: 0,
          sold_seats: 0,
        };
        existing.showtime_count += 1;
        existing.sold_seats += ((showtime.sold_seats as number) ?? 0);
        movieMap.set(id, existing);
      }

      const sorted = Array.from(movieMap.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.sold_seats - a.sold_seats)
        .slice(0, 5);

      setPopularMovies(sorted);
    } catch {
      setPopularMovies([]);
    } finally {
      setMoviesLoading(false);
    }
  };

  const anyStatLoading = stats.some((s) => s.loading);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-zinc-400">Visão geral do sistema Frame24.</p>
      </header>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-red-900/50 bg-red-950/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium text-zinc-400">
                {stat.title}
              </h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stat.loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Vendas Recentes
          </h3>
          {salesLoading ? (
            <div className="h-[200px] flex items-center justify-center text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : recentSales.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              Nenhuma venda registrada.
            </div>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      {sale.movie_title ?? `Venda #${sale.sale_number}`}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {sale.sale_number} · {formatDateTime(sale.sale_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {sale.status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          sale.status === "completed" || sale.status === "confirmed"
                            ? "bg-green-950 border-green-900 text-green-400"
                            : sale.status === "cancelled"
                              ? "bg-red-950 border-red-900 text-red-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {sale.status}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-zinc-200">
                      {formatCurrency(Number(sale.total_amount))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Filmes Populares
          </h3>
          {moviesLoading ? (
            <div className="h-[200px] flex items-center justify-center text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : popularMovies.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-zinc-500">
                Nenhum dado disponível no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {popularMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      {movie.title}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {movie.showtime_count} sessão{movie.showtime_count !== 1 ? "ões" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm font-semibold text-zinc-300">
                      {movie.sold_seats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
