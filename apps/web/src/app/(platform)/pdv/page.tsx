"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { posApi } from "@/lib/api-client";
import { getTenantSlugFromHost, getTenantSlugFromPathname } from "@/lib/tenant-routing";
import { usePdvStore, CartTicket, CartProduct } from "@/stores/use-pdv-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { authClient } from "@/lib/auth-client";
import {
  Calculator,
  Film,
  Ticket,
  Popcorn,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Plus,
  Minus,
  Search,
} from "lucide-react";

type PosSession = {
  id: string;
  session_number: string;
  cinema_complex_id: string;
  status: string;
  status_name?: string;
  opening_amount: number;
  total_sales_amount: number;
  total_sales_count: number;
  opened_at: string;
};

type CinemaComplex = {
  id: string;
  name: string;
};

type ShowtimeItem = {
  id: string;
  start_time: string;
  base_ticket_price: number | string;
  movie?: { id: string; title: string; poster_url?: string; duration_minutes?: number };
  room?: { id: string; name: string };
  complex?: { id: string; name: string };
  available_seats?: number | null;
  sold_seats?: number | null;
};

type TicketTypeItem = {
  id: string;
  name: string;
  discount_percentage: number;
  price_modifier: number;
};

type SeatItem = {
  id: string;
  seat_code: string;
  row_code: string;
  column_number: number;
  status: string;
  seat_kind?: string;
  additional_value?: number | string;
};

type ProductItem = {
  id: string;
  name: string;
  sale_price?: number;
  price?: number;
  image_url?: string | null;
  product_code?: string;
};

type PosPaymentMethodItem = {
  id: string;
  name: string;
  requires_change: boolean;
};

type SalesPaymentMethodItem = {
  id: string;
  name: string;
  auto_settle: boolean;
};

type SaleResponse = {
  id: string;
  public_reference?: string;
  sale_number?: string;
};

const STEPS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: "session", label: "Caixa", icon: <Calculator className="w-4 h-4" /> },
  { key: "showtime", label: "Sessão", icon: <Film className="w-4 h-4" /> },
  { key: "tickets", label: "Ingressos", icon: <Ticket className="w-4 h-4" /> },
  { key: "products", label: "Lanches", icon: <Popcorn className="w-4 h-4" /> },
  { key: "payment", label: "Pagamento", icon: <CreditCard className="w-4 h-4" /> },
  { key: "confirmation", label: "Confirmação", icon: <CheckCircle2 className="w-4 h-4" /> },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AuthInlineLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const tenantSlug =
    typeof window !== "undefined"
      ? getTenantSlugFromHost(window.location.host) ?? getTenantSlugFromPathname(window.location.pathname)
      : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authClient.signIn.email({
        email: tenantSlug
          ? `${email.trim().toLowerCase().split("@")[0]}__tenant__${tenantSlug}@${email.trim().toLowerCase().split("@")[1]}`
          : email.trim().toLowerCase(),
        password,
      });
      if (result.error) {
        setError(result.error.message || "Erro ao fazer login");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-left">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground-muted">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm"
          placeholder="admin@lawtrel.com"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground-muted">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm"
          placeholder="••••••••"
          required
        />
      </div>
      {error && <p className="text-sm text-accent-red-500">{error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Entrar"}
      </Button>
    </form>
  );
}

export default function PdvPage() {
  const { hasSession, isLoading: authLoading } = useAuth();
  const {
    posSessionId,
    posSessionNumber,
    cinemaComplexId,
    selectedShowtimeId,
    cartTickets,
    cartProducts,
    selectedPaymentMethodId,
    cashReceived,
    step,
    lastSaleId,
    lastSaleReference,
    setPosSession,
    setSelectedShowtime,
    addCartTicket,
    removeCartTicket,
    setCartProduct,
    removeCartProduct,
    setPaymentMethod,
    setCashReceived,
    setStep,
    setLastSale,
    resetSale,
    resetAll,
  } = usePdvStore();

  const [posSessions, setPosSessions] = useState<PosSession[]>([]);
  const [complexes, setComplexes] = useState<CinemaComplex[]>([]);
  const [showtimes, setShowtimes] = useState<ShowtimeItem[]>([]);
  const [showtimeDetails, setShowtimeDetails] = useState<ShowtimeItem | null>(null);
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PosPaymentMethodItem[]>([]);
  const [salesPaymentMethods, setSalesPaymentMethods] = useState<SalesPaymentMethodItem[]>([]);
  const tenantSlug = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getTenantSlugFromHost(window.location.host) ?? getTenantSlugFromPathname(window.location.pathname);
  }, []);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movieFilter, setMovieFilter] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const loadPosSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await posApi.posSessionsFindAllV1({ status: "Aberta" });
      const sessions = (res.data as unknown[] || []).map((s) => {
        const r = s as Record<string, unknown>;
        return {
          id: String(r.id),
          session_number: String(r.session_number || ""),
          cinema_complex_id: String(r.cinema_complex_id || ""),
          status: String(r.status || ""),
          status_name: String(r.status_name || r.status || ""),
          opening_amount: Number(r.opening_amount || 0),
          total_sales_amount: Number(r.total_sales_amount || 0),
          total_sales_count: Number(r.total_sales_count || 0),
          opened_at: String(r.opened_at || ""),
        } as PosSession;
      });
      setPosSessions(sessions);
      if (sessions.length === 0) {
        const cRes = await posApi.complexesFindAllV1();
        setComplexes((cRes.data as unknown[] || []).map((c) => {
          const r = c as Record<string, unknown>;
          return { id: String(r.id), name: String(r.name || "Complexo") } as CinemaComplex;
        }));
      }
    } catch {
      setError("Erro ao carregar sessões PDV.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === "session" && !posSessionId) {
      void loadPosSessions();
    }
  }, [step, posSessionId, loadPosSessions]);

  useEffect(() => {
    if (step !== "showtime" || !cinemaComplexId) return;
    let cancelled = false;
    setLoading(true);
    posApi
      .showtimesFindAllV1({ cinema_complex_id: cinemaComplexId, limit: 50 })
      .then((res) => {
        if (cancelled) return;
      const items = (res.data as unknown[] || []).map((s) => {
        const r = s as Record<string, unknown>;
        const movie = (r.movie ?? r.movies) as Record<string, unknown> | undefined;
        const room = r.rooms as Record<string, unknown> | undefined;
        const complex = (r.complex ?? r.cinema_complexes) as Record<string, unknown> | undefined;
        return {
          id: String(r.id),
          start_time: String(r.start_time || ""),
          base_ticket_price: Number(r.base_ticket_price || 0),
          movie: movie ? { id: String(movie.id || ""), title: String(movie.title || movie.brazil_title || movie.original_title || ""), poster_url: movie.poster_url ? String(movie.poster_url) : (movie.movie_media ? String((movie.movie_media as Record<string, unknown>[])?.[0]?.media_url || "") : undefined), duration_minutes: Number(movie.duration_minutes || 0) } : undefined,
          room: room ? { id: String(room.id || ""), name: String(room.name || "") } : undefined,
          complex: complex ? { id: String(complex.id || ""), name: String(complex.name || "") } : undefined,
          available_seats: r.available_seats != null ? Number(r.available_seats) : null,
          sold_seats: r.sold_seats != null ? Number(r.sold_seats) : null,
        } as ShowtimeItem;
      });
        setShowtimes(items);
      })
      .catch(() => setError("Erro ao carregar sessões de filme."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [step, cinemaComplexId]);

  useEffect(() => {
    if (step !== "tickets" || !selectedShowtimeId) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      posApi.showtimesFindOneV1(selectedShowtimeId),
      posApi.showtimesSeatsV1(selectedShowtimeId),
      posApi.ticketTypesFindAllV1(),
    ])
      .then(([detailRes, seatsRes, typesRes]) => {
        if (cancelled) return;
      const detail = detailRes.data as Record<string, unknown>;
      const movie = (detail.movie ?? detail.movies) as Record<string, unknown> | undefined;
      const room = (detail.room ?? detail.rooms) as Record<string, unknown> | undefined;
      setShowtimeDetails({
        id: String(detail.id),
        start_time: String(detail.start_time || ""),
        base_ticket_price: Number(detail.base_ticket_price || 0),
        movie: movie ? { id: String(movie.id || ""), title: String(movie.title || movie.brazil_title || movie.original_title || ""), poster_url: movie.poster_url ? String(movie.poster_url) : (movie.movie_media ? String((movie.movie_media as Record<string, unknown>[])?.[0]?.media_url || "") : undefined), duration_minutes: Number(movie.duration_minutes || 0) } : undefined,
        room: room ? { id: String(room.id || ""), name: String(room.name || "") } : undefined,
      } as ShowtimeItem);

        const seatsData = seatsRes.data as Record<string, unknown>;
        const seatsList = (Array.isArray(seatsData) ? seatsData : (seatsData?.seats as unknown[] || [])) as unknown[];
        setSeats(
          seatsList.map((s) => {
            const r = s as Record<string, unknown>;
            const statusObj = typeof r.status === "object" && r.status !== null ? r.status as Record<string, unknown> : null;
            const statusStr = statusObj ? String(statusObj.name || "available") : String(r.status || "available");
            return {
              id: String(r.seat_id ?? r.id ?? ""),
              seat_code: String(r.seat_code || `${r.row ?? r.row_code ?? ""}${r.number ?? r.column_number ?? ""}`),
              row_code: String(r.row ?? r.row_code ?? ""),
              column_number: Number(r.number ?? r.column_number ?? 0),
              status: statusStr.toLowerCase(),
              seat_kind: String(r.seat_kind ?? r.kind ?? "standard"),
              additional_value: r.additional_value != null ? Number(r.additional_value) : 0,
            } as SeatItem;
          }),
        );

        setTicketTypes(
          (typesRes.data as unknown[] || []).map((t) => {
            const r = t as Record<string, unknown>;
            return {
              id: String(r.id),
              name: String(r.name || ""),
              discount_percentage: Number(r.discount_percentage || 0),
              price_modifier: Number(r.price_modifier ?? 1),
            } as TicketTypeItem;
          }),
        );
        if (!selectedTicketType && ticketTypes.length > 0) {
          const inteira = ticketTypes.find((tt) => tt.name.toLowerCase().includes("inteira"));
          setSelectedTicketType(inteira?.id || ticketTypes[0]?.id || "");
        }
      })
      .catch(() => setError("Erro ao carregar dados da sessão."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [step, selectedShowtimeId]);

  useEffect(() => {
    if (step !== "products") return;
    let cancelled = false;
    setLoading(true);
    Promise.all([posApi.productsFindAllV1({ active: true }), posApi.posPaymentMethodsV1()])
      .then(([prodRes, pmRes]) => {
        if (cancelled) return;
        setProducts(
          (prodRes.data as unknown[] || []).map((p) => {
            const r = p as Record<string, unknown>;
            return {
              id: String(r.id),
              name: String(r.name || ""),
              sale_price: Number(r.sale_price || r.price || 0),
              price: Number(r.price || r.sale_price || 0),
              image_url: r.image_url ? String(r.image_url) : null,
              product_code: String(r.product_code || ""),
            } as ProductItem;
          }),
        );
        setPaymentMethods(
          (pmRes.data as unknown[] || []).map((m) => {
            const r = m as Record<string, unknown>;
            return {
              id: String(r.id),
              name: String(r.name || ""),
              requires_change: Boolean(r.requires_change),
            } as PosPaymentMethodItem;
          }),
        );
        if (tenantSlug) {
          posApi.salesPaymentMethodsV1(tenantSlug).then((spmRes) => {
            if (cancelled) return;
            setSalesPaymentMethods(
              (spmRes.data as unknown[] || []).map((m) => {
                const r = m as Record<string, unknown>;
                return {
                  id: String(r.id),
                  name: String(r.name || ""),
                  auto_settle: Boolean(r.auto_settle),
                } as SalesPaymentMethodItem;
              }),
            );
          }).catch(() => {});
        }
      })
      .catch(() => setError("Erro ao carregar produtos."))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [step]);

  useEffect(() => {
    if (step !== "payment" || paymentMethods.length > 0) return;
    let cancelled = false;
    posApi.posPaymentMethodsV1()
      .then((res) => {
        if (cancelled) return;
        setPaymentMethods(
          (res.data as unknown[] || []).map((m) => {
            const r = m as Record<string, unknown>;
            return { id: String(r.id), name: String(r.name || ""), requires_change: Boolean(r.requires_change) } as PosPaymentMethodItem;
          }),
        );
      })
      .catch(() => {})
      .finally(() => {});
    return () => { cancelled = true; };
  }, [step, paymentMethods.length]);

  useEffect(() => {
    if (!selectedTicketType && ticketTypes.length > 0) {
      const inteira = ticketTypes.find((tt) => tt.name.toLowerCase().includes("inteira"));
      setSelectedTicketType(inteira?.id || ticketTypes[0]?.id || "");
    }
  }, [ticketTypes, selectedTicketType]);

  const ticketsTotal = useMemo(() => {
    return cartTickets.reduce((sum, t) => sum + t.price, 0);
  }, [cartTickets]);

  const productsTotal = useMemo(() => {
    return cartProducts.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
  }, [cartProducts]);

  const grandTotal = useMemo(() => {
    return ticketsTotal + productsTotal;
  }, [ticketsTotal, productsTotal]);

  const changeAmount = useMemo(() => {
    const selectedPm = paymentMethods.find((m) => m.id === selectedPaymentMethodId);
    if (selectedPm?.requires_change && cashReceived > grandTotal) {
      return cashReceived - grandTotal;
    }
    return 0;
  }, [cashReceived, grandTotal, selectedPaymentMethodId, paymentMethods]);

  const availableSeats = useMemo(() => {
    return seats.filter(
      (s) =>
        s.status === "available" ||
        s.status === "disponivel" ||
        s.status === "disponível" ||
        s.status === "livre",
    );
  }, [seats]);

  const handleOpenSession = async (complexId: string, complexName: string, openingAmount: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await posApi.posSessionsCreateV1({
        cinema_complex_id: complexId,
        opening_amount: openingAmount,
      });
      const data = res.data as Record<string, unknown>;
      setPosSession(
        String(data.id),
        String(data.session_number || `PDV-${complexName}`),
        complexId,
      );
    } catch {
      setError("Erro ao abrir caixa.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExistingSession = (session: PosSession) => {
    setPosSession(session.id, session.session_number, session.cinema_complex_id);
  };

  const handleSeatClick = (seat: SeatItem) => {
    if (!selectedTicketType || !showtimeDetails) return;
    const isAvailable =
      seat.status === "available" ||
      seat.status === "disponivel" ||
      seat.status === "disponível" ||
      seat.status === "livre";
    if (!isAvailable) return;

    const existingIdx = cartTickets.findIndex((t) => t.seatId === seat.id);
    if (existingIdx >= 0) {
      removeCartTicket(seat.id);
      return;
    }

    const tt = ticketTypes.find((t) => t.id === selectedTicketType);
    if (!tt) return;

    const basePrice = Number(showtimeDetails.base_ticket_price);
    const additional = Number(seat.additional_value || 0);
    const price = (basePrice + additional) * tt.price_modifier;

    addCartTicket({
      showtimeId: selectedShowtimeId!,
      ticketTypeId: tt.id,
      ticketTypeName: tt.name,
      seatId: seat.id,
      seatLabel: seat.seat_code,
      price,
    });
  };

  const handleProcessSale = async () => {
    if (!posSessionId || !selectedPaymentMethodId || !selectedShowtimeId) return;
    if (cartTickets.length === 0 && cartProducts.length === 0) return;

    setProcessing(true);
    setError(null);
    try {
      const selectedPosPm = paymentMethods.find((m) => m.id === selectedPaymentMethodId);
      const salesPm = selectedPosPm
        ? salesPaymentMethods.find((spm) =>
            spm.name.toLowerCase().replace(/\s+/g, " ") ===
            selectedPosPm.name.toLowerCase().replace(/\s+/g, " "),
          )
        : null;

      const salePayload: Record<string, unknown> = {
        cinema_complex_id: cinemaComplexId,
        payment_method: salesPm?.id || selectedPaymentMethodId,
        tickets: cartTickets.map((t) => ({
          showtime_id: t.showtimeId,
          seat_id: t.seatId,
          ticket_type: t.ticketTypeId,
        })),
        concession_items: cartProducts
          .filter((p) => p.quantity > 0)
          .map((p) => ({
            item_type: "PRODUCT",
            item_id: p.productId,
            quantity: p.quantity,
          })),
      };

      const saleRes = await posApi.salesCreateV1(salePayload);
      const saleData = saleRes.data as SaleResponse;
      const saleId = saleData.id;
      const saleRef = saleData.public_reference || saleData.sale_number || saleId;

      await posApi.posTransactionsCreateV1({
        pos_session_id: posSessionId,
        transaction_type: "sale",
        payment_method: selectedPaymentMethodId,
        amount: grandTotal,
        change_amount: changeAmount > 0 ? changeAmount : 0,
        description: `${cartTickets.length} ingresso(s)${cartProducts.length > 0 ? ` + ${cartProducts.reduce((s, p) => s + p.quantity, 0)} produto(s)` : ""}`,
        reference_type: "sale",
        reference_id: saleId,
      });

      setLastSale(saleId, saleRef);
      setStep("confirmation");
    } catch (err: unknown) {
      let msg = "Erro ao processar venda.";
      if (err && typeof err === "object" && "response" in err) {
        const resp = (err as { response?: { data?: { message?: unknown } } }).response;
        if (resp?.data?.message) {
          const m = resp.data.message;
          msg = Array.isArray(m) ? m.join(" | ") : String(m);
        }
      }
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  const goNext = () => {
    const idx = STEPS.findIndex((s) => s.key === step);
    const next = STEPS[idx + 1];
    if (next) setStep(next.key as typeof step);
  };

  const goBack = () => {
    const idx = STEPS.findIndex((s) => s.key === step);
    const prev = STEPS[idx - 1];
    if (prev) setStep(prev.key as typeof step);
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case "session":
        return !!posSessionId;
      case "showtime":
        return !!selectedShowtimeId;
      case "tickets":
        return cartTickets.length > 0;
      case "products":
        return true;
      case "payment":
        return !!selectedPaymentMethodId && grandTotal > 0;
      default:
        return false;
    }
  }, [step, posSessionId, selectedShowtimeId, cartTickets.length, selectedPaymentMethodId, grandTotal]);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-red-500" />
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent-red-500/10 flex items-center justify-center">
              <Calculator className="w-8 h-8 text-accent-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold">Frente de Caixa</h1>
          <p className="text-sm text-foreground-muted">
            Faça login para acessar o PDV
          </p>
          <AuthInlineLogin />
        </Card>
      </main>
    );
  }

  if (loading && step === "session" && posSessions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-red-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background-elevated/95 backdrop-blur-xl">
        <div className="px-4 py-3 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-accent-red-500" />
            <h1 className="text-xl font-bold font-display">
              {posSessionNumber || "PDV"}
            </h1>
            {posSessionNumber && (
              <span className="text-xs text-foreground-muted bg-surface px-2 py-0.5 rounded-full">
                Caixa Aberto
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent-red-500">
              {formatCurrency(grandTotal)}
            </span>
            {step !== "session" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Encerrar operação do PDV? Dados da venda atual serão perdidos.")) {
                    resetAll();
                  }
                }}
              >
                <X className="w-4 h-4" />
                Sair
              </Button>
            )}
          </div>
        </div>
        <div className="px-4 pb-2 flex gap-1 overflow-x-auto max-w-[1600px] mx-auto">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => {
                if (i < currentStepIndex) setStep(s.key as typeof step);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                i === currentStepIndex
                  ? "bg-accent-red-500 text-white"
                  : i < currentStepIndex
                  ? "bg-surface text-foreground cursor-pointer hover:bg-background-strong"
                  : "text-foreground-muted"
              }`}
              disabled={i > currentStepIndex}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-4">
        {error && (
          <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-accent-red-500/10 border border-accent-red-500/30 text-accent-red-400 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">
              Fechar
            </button>
          </div>
        )}

        {step === "session" && (
          <SessionStep
            sessions={posSessions}
            complexes={complexes}
            onSelect={handleSelectExistingSession}
            onOpen={handleOpenSession}
            loading={loading}
          />
        )}

        {step === "showtime" && (
          <ShowtimeStep
            showtimes={showtimes}
            selectedId={selectedShowtimeId}
            onSelect={(id) => setSelectedShowtime(id)}
            movieFilter={movieFilter}
            onMovieFilterChange={setMovieFilter}
            loading={loading}
          />
        )}

        {step === "tickets" && (
          <TicketsStep
            showtimeDetails={showtimeDetails}
            seats={seats}
            availableSeats={availableSeats}
            ticketTypes={ticketTypes}
            cartTickets={cartTickets}
            selectedTicketType={selectedTicketType}
            onTicketTypeChange={setSelectedTicketType}
            onSeatClick={handleSeatClick}
            onRemoveTicket={removeCartTicket}
            loading={loading}
          />
        )}

        {step === "products" && (
          <ProductsStep
            products={products}
            cartProducts={cartProducts}
            onSetProduct={setCartProduct}
            onRemoveProduct={removeCartProduct}
            loading={loading}
          />
        )}

        {step === "payment" && (
          <PaymentStep
            paymentMethods={paymentMethods}
            selectedMethodId={selectedPaymentMethodId}
            onMethodChange={setPaymentMethod}
            cashReceived={cashReceived}
            onCashReceivedChange={setCashReceived}
            grandTotal={grandTotal}
            changeAmount={changeAmount}
            cartTickets={cartTickets}
            cartProducts={cartProducts}
            processing={processing}
            onConfirm={handleProcessSale}
          />
        )}

        {step === "confirmation" && (
          <ConfirmationStep
            saleReference={lastSaleReference}
            grandTotal={grandTotal}
            cartTickets={cartTickets}
            cartProducts={cartProducts}
            onNewSale={resetSale}
          />
        )}

        {step !== "confirmation" && step !== "session" && (
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={goBack}
              disabled={currentStepIndex <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
            {step !== "payment" && (
              <Button
                variant="primary"
                onClick={goNext}
                disabled={!canAdvance}
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function SessionStep({
  sessions,
  complexes,
  onSelect,
  onOpen,
  loading,
}: {
  sessions: PosSession[];
  complexes: CinemaComplex[];
  onSelect: (s: PosSession) => void;
  onOpen: (complexId: string, complexName: string, openingAmount: number) => void;
  loading: boolean;
}) {
  const [openingAmount, setOpeningAmount] = useState(200);
  const [selectedComplex, setSelectedComplex] = useState<string>("");

  if (loading) {
    return (
      <Card className="flex items-center justify-center min-h-[12rem]">
        <Loader2 className="w-6 h-6 animate-spin text-accent-red-500" />
      </Card>
    );
  }

  if (sessions.length > 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold">Sessões de Caixa Abertas</h2>
        <p className="text-foreground-muted text-sm">Selecione uma sessão de caixa ativa para continuar:</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="glass-panel rounded-[var(--radius-lg)] border border-border/90 p-5 text-left hover:border-accent-red-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-accent-red-500" />
                <span className="font-bold">{s.session_number}</span>
                <span className="ml-auto text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">
                  {s.status_name || "Aberta"}
                </span>
              </div>
              <p className="text-sm text-foreground-muted">
                Fundo de troco: {formatCurrency(s.opening_amount)}
              </p>
              <p className="text-sm text-foreground-muted">
                Vendas: {s.total_sales_count} ({formatCurrency(s.total_sales_amount)})
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                Aberto em {formatDateTime(s.opened_at)}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Abrir Caixa</h2>
      <p className="text-foreground-muted text-sm">Nenhuma sessão de caixa aberta. Selecione o complexo e o fundo de troco:</p>
      <Card className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1.5 text-foreground-muted font-medium">
            Complexo
          </label>
          <select
            className="w-full bg-background-strong border border-border rounded-[var(--radius-sm)] p-2.5 text-foreground text-sm"
            value={selectedComplex}
            onChange={(e) => setSelectedComplex(e.target.value)}
          >
            <option value="">Selecione...</option>
            {complexes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-foreground-muted font-medium">
            Fundo de Troco (R$)
          </label>
          <input
            type="number"
            min={0}
            step={10}
            className="w-full bg-background-strong border border-border rounded-[var(--radius-sm)] p-2.5 text-foreground text-sm"
            value={openingAmount}
            onChange={(e) => setOpeningAmount(Number(e.target.value))}
          />
        </div>
        <Button
          variant="primary"
          className="w-full"
          disabled={!selectedComplex || loading}
          onClick={() => {
            const c = complexes.find((x) => x.id === selectedComplex);
            if (c) onOpen(c.id, c.name, openingAmount);
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
          Abrir Caixa
        </Button>
      </Card>
    </div>
  );
}

function ShowtimeStep({
  showtimes,
  selectedId,
  onSelect,
  movieFilter,
  onMovieFilterChange,
  loading,
}: {
  showtimes: ShowtimeItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  movieFilter: string;
  onMovieFilterChange: (v: string) => void;
  loading: boolean;
}) {
  const filtered = movieFilter
    ? showtimes.filter((s) =>
        s.movie?.title?.toLowerCase().includes(movieFilter.toLowerCase()),
      )
    : showtimes;

  const today = new Date().toISOString().split("T")[0] || "";
  const todayShowtimes = filtered.filter((s) => s.start_time?.startsWith(today));
  const otherShowtimes = filtered.filter((s) => s.start_time && !s.start_time.startsWith(today));

  if (loading) {
    return (
      <Card className="flex items-center justify-center min-h-[12rem]">
        <Loader2 className="w-6 h-6 animate-spin text-accent-red-500" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Selecionar Sessão</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Filtrar por filme..."
          className="w-full bg-background-strong border border-border rounded-[var(--radius-md)] pl-10 pr-4 py-2.5 text-foreground text-sm"
          value={movieFilter}
          onChange={(e) => onMovieFilterChange(e.target.value)}
        />
      </div>

      {showtimes.length === 0 && (
        <p className="text-foreground-muted text-sm py-8 text-center">
          Nenhuma sessão encontrada para este complexo.
        </p>
      )}

      {todayShowtimes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground-muted mb-2 uppercase tracking-wider">Hoje</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayShowtimes.map((s) => (
              <ShowtimeCard
                key={s.id}
                showtime={s}
                selected={selectedId === s.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {otherShowtimes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground-muted mb-2 uppercase tracking-wider mt-4">Próximos dias</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherShowtimes.map((s) => (
              <ShowtimeCard
                key={s.id}
                showtime={s}
                selected={selectedId === s.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShowtimeCard({
  showtime,
  selected,
  onSelect,
}: {
  showtime: ShowtimeItem;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(showtime.id)}
      className={`glass-panel rounded-[var(--radius-lg)] border p-4 text-left transition-all ${
        selected
          ? "border-accent-red-500 bg-accent-red-500/5"
          : "border-border/90 hover:border-accent-red-500/40"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base truncate">
            {showtime.movie?.title || "Filme"}
          </p>
          <p className="text-sm text-foreground-muted">
            {showtime.room?.name || "Sala"} &bull;{" "}
            {formatTime(showtime.start_time)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-accent-red-500">
              A partir de {formatCurrency(Number(showtime.base_ticket_price))}
            </span>
            {showtime.available_seats != null && (
              <span className="text-xs text-foreground-muted">
                {showtime.available_seats} lugares
              </span>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {formatTime(showtime.start_time)}
        </div>
      </div>
    </button>
  );
}

function TicketsStep({
  showtimeDetails,
  seats,
  availableSeats,
  ticketTypes,
  cartTickets,
  selectedTicketType,
  onTicketTypeChange,
  onSeatClick,
  onRemoveTicket,
  loading,
}: {
  showtimeDetails: ShowtimeItem | null;
  seats: SeatItem[];
  availableSeats: SeatItem[];
  ticketTypes: TicketTypeItem[];
  cartTickets: CartTicket[];
  selectedTicketType: string;
  onTicketTypeChange: (id: string) => void;
  onSeatClick: (seat: SeatItem) => void;
  onRemoveTicket: (seatId: string) => void;
  loading: boolean;
}) {
  const seatsByRow = useMemo(() => {
    const map = new Map<string, SeatItem[]>();
    for (const seat of seats) {
      const row = seat.row_code || "?";
      if (!map.has(row)) map.set(row, []);
      map.get(row)!.push(seat);
    }
    for (const [, rowSeats] of map) {
      rowSeats.sort((a, b) => a.column_number - b.column_number);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [seats]);

  if (loading || !showtimeDetails) {
    return (
      <Card className="flex items-center justify-center min-h-[12rem]">
        <Loader2 className="w-6 h-6 animate-spin text-accent-red-500" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-display font-bold">
          {showtimeDetails.movie?.title || "Filme"}
        </h2>
        <p className="text-foreground-muted text-sm">
          {showtimeDetails.room?.name || "Sala"} &bull;{" "}
          {formatDate(showtimeDetails.start_time)} às{" "}
          {formatTime(showtimeDetails.start_time)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider text-foreground-muted">
              Tipo de Ingresso
            </h3>
            <div className="flex flex-wrap gap-2">
              {ticketTypes.map((tt) => (
                <button
                  key={tt.id}
                  onClick={() => onTicketTypeChange(tt.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTicketType === tt.id
                      ? "bg-accent-red-500 text-white"
                      : "bg-surface border border-border text-foreground hover:border-accent-red-500/40"
                  }`}
                >
                  {tt.name}
                  {tt.discount_percentage > 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      (-{tt.discount_percentage}%)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider text-foreground-muted">
              Assentos ({availableSeats.length} disponíveis)
            </h3>
            <div className="glass-panel rounded-[var(--radius-lg)] border border-border/90 p-4 overflow-x-auto">
              <div className="text-center mb-3 text-xs text-foreground-muted">
                ── TELA ──
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                {seatsByRow.map(([row, rowSeats]) => (
                  <div key={row} className="flex gap-1 items-center">
                    <span className="w-6 text-right text-xs text-foreground-muted font-mono">
                      {row}
                    </span>
                    {rowSeats.map((seat) => {
                      const isSelected = cartTickets.some(
                        (t) => t.seatId === seat.id,
                      );
            const isAvail =
              seat.status === "available" ||
              seat.status === "disponivel" ||
              seat.status === "disponível" ||
              seat.status === "livre";
                      return (
                        <button
                          key={seat.id}
                          onClick={() => onSeatClick(seat)}
                          disabled={!isAvail && !isSelected}
                          className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-accent-red-500 text-white"
                              : isAvail
                              ? "bg-surface border border-border hover:border-accent-red-500/60 text-foreground"
                              : "bg-background-strong text-foreground-muted/30 cursor-not-allowed"
                          }`}
                          title={`${seat.seat_code} - ${isAvail ? "Disponível" : "Ocupado"}`}
                        >
                          {seat.column_number}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="space-y-3 sticky top-36">
            <h3 className="font-semibold">
              Ingressos ({cartTickets.length})
            </h3>
            {cartTickets.length === 0 ? (
              <p className="text-sm text-foreground-muted">
                Selecione assentos no mapa
              </p>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {cartTickets.map((t) => (
                  <div
                    key={t.seatId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="bg-accent-red-500/10 text-accent-red-400 px-2 py-0.5 rounded text-xs font-mono">
                      {t.seatLabel}
                    </span>
                    <span className="flex-1 text-foreground-muted truncate">
                      {t.ticketTypeName}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(t.price)}
                    </span>
                    <button
                      onClick={() => onRemoveTicket(t.seatId)}
                      className="text-foreground-muted hover:text-accent-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {cartTickets.length > 0 && (
              <div className="pt-2 border-t border-border text-sm font-semibold flex justify-between">
                <span>Subtotal ingressos</span>
                <span>{formatCurrency(cartTickets.reduce((s, t) => s + t.price, 0))}</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProductsStep({
  products,
  cartProducts,
  onSetProduct,
  onRemoveProduct,
  loading,
}: {
  products: ProductItem[];
  cartProducts: CartProduct[];
  onSetProduct: (id: string, name: string, price: number, qty: number) => void;
  onRemoveProduct: (id: string) => void;
  loading: boolean;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.product_code?.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  if (loading) {
    return (
      <Card className="flex items-center justify-center min-h-[12rem]">
        <Loader2 className="w-6 h-6 animate-spin text-accent-red-500" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Lanches e Produtos</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Buscar produto..."
          className="w-full bg-background-strong border border-border rounded-[var(--radius-md)] pl-10 pr-4 py-2.5 text-foreground text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const inCart = cartProducts.find((c) => c.productId === p.id);
            const qty = inCart?.quantity || 0;
            const price = p.sale_price || p.price || 0;
            return (
              <Card key={p.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-accent-red-500 font-bold text-sm">
                      {formatCurrency(price)}
                    </p>
                  </div>
                  {p.product_code && (
                    <span className="text-xs text-foreground-muted bg-surface px-1.5 py-0.5 rounded">
                      {p.product_code}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetProduct(p.id, p.name, price, qty - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] bg-surface border border-border hover:border-accent-red-500/40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{qty}</span>
                  <button
                    onClick={() => onSetProduct(p.id, p.name, price, qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] bg-accent-red-500 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-foreground-muted text-sm col-span-full py-8 text-center">
              Nenhum produto encontrado.
            </p>
          )}
        </div>

        <div>
          <Card className="space-y-3 sticky top-36">
            <h3 className="font-semibold">
              Carrinho ({cartProducts.reduce((s, p) => s + p.quantity, 0)} itens)
            </h3>
            {cartProducts.length === 0 ? (
              <p className="text-sm text-foreground-muted">
                Adicione produtos ao carrinho
              </p>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {cartProducts.map((p) => (
                  <div key={p.productId} className="flex items-center gap-2 text-sm">
                    <span className="bg-accent-red-500/10 text-accent-red-400 px-2 py-0.5 rounded text-xs font-mono">
                      {p.quantity}x
                    </span>
                    <span className="flex-1 text-foreground-muted truncate">
                      {p.productName}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(p.unitPrice * p.quantity)}
                    </span>
                    <button
                      onClick={() => onRemoveProduct(p.productId)}
                      className="text-foreground-muted hover:text-accent-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {cartProducts.length > 0 && (
              <div className="pt-2 border-t border-border text-sm font-semibold flex justify-between">
                <span>Subtotal produtos</span>
                <span>
                  {formatCurrency(
                    cartProducts.reduce((s, p) => s + p.unitPrice * p.quantity, 0),
                  )}
                </span>
              </div>
            )}
            <p className="text-xs text-foreground-muted">
              Pule esta etapa se não deseja adicionar lanches.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  paymentMethods,
  selectedMethodId,
  onMethodChange,
  cashReceived,
  onCashReceivedChange,
  grandTotal,
  changeAmount,
  cartTickets,
  cartProducts,
  processing,
  onConfirm,
}: {
  paymentMethods: PosPaymentMethodItem[];
  selectedMethodId: string | null;
  onMethodChange: (id: string) => void;
  cashReceived: number;
  onCashReceivedChange: (v: number) => void;
  grandTotal: number;
  changeAmount: number;
  cartTickets: CartTicket[];
  cartProducts: CartProduct[];
  processing: boolean;
  onConfirm: () => void;
}) {
  const selectedPm = paymentMethods.find((m) => m.id === selectedMethodId);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold">Pagamento</h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="font-semibold text-lg">Método de Pagamento</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onMethodChange(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border transition-colors ${
                    selectedMethodId === m.id
                      ? "border-accent-red-500 bg-accent-red-500/5"
                      : "border-border hover:border-accent-red-500/40"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-foreground-muted" />
                  <span className="font-medium text-sm">{m.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {selectedPm?.requires_change && (
            <Card className="space-y-3">
              <h3 className="font-semibold text-lg">Valor Recebido</h3>
              <input
                type="number"
                min={0}
                step={0.01}
                className="w-full bg-background-strong border border-border rounded-[var(--radius-sm)] p-3 text-foreground text-lg font-mono"
                value={cashReceived || ""}
                onChange={(e) => onCashReceivedChange(Number(e.target.value))}
                placeholder="0,00"
              />
              {changeAmount > 0 && (
                <div className="bg-gold-100/10 border border-gold-300/30 rounded-[var(--radius-sm)] p-3">
                  <p className="text-gold-300 font-bold text-lg">
                    Troco: {formatCurrency(changeAmount)}
                  </p>
                </div>
              )}
              {cashReceived > 0 && cashReceived < grandTotal && (
                <p className="text-accent-red-400 text-sm">
                  Valor insuficiente. Faltam {formatCurrency(grandTotal - cashReceived)}.
                </p>
              )}
            </Card>
          )}
        </div>

        <Card className="space-y-4 sticky top-36">
          <h3 className="font-semibold text-lg">Resumo</h3>
          <div className="space-y-2">
            {cartTickets.map((t) => (
              <div key={t.seatId} className="flex justify-between text-sm">
                <span className="text-foreground-muted">
                  {t.seatLabel} - {t.ticketTypeName}
                </span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(t.price)}
                </span>
              </div>
            ))}
            {cartProducts.map((p) => (
              <div key={p.productId} className="flex justify-between text-sm">
                <span className="text-foreground-muted">
                  {p.quantity}x {p.productName}
                </span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(p.unitPrice * p.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-accent-red-500">{formatCurrency(grandTotal)}</span>
            </div>
            {changeAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Troco</span>
                <span className="text-gold-300 font-medium">{formatCurrency(changeAmount)}</span>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={
              processing ||
              !selectedMethodId ||
              grandTotal <= 0 ||
              (selectedPm?.requires_change && cashReceived < grandTotal)
            }
            onClick={onConfirm}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Confirmar Venda
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function ConfirmationStep({
  saleReference,
  grandTotal,
  cartTickets,
  cartProducts,
  onNewSale,
}: {
  saleReference: string | null;
  grandTotal: number;
  cartTickets: CartTicket[];
  cartProducts: CartProduct[];
  onNewSale: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">Venda Confirmada!</h2>
          {saleReference && (
            <p className="text-sm text-foreground-muted mt-1">
              Ref: {saleReference}
            </p>
          )}
        </div>
        <div className="space-y-2 text-sm text-left">
          {cartTickets.map((t) => (
            <div key={t.seatId} className="flex justify-between">
              <span className="text-foreground-muted">
                {t.seatLabel} - {t.ticketTypeName}
              </span>
              <span className="tabular-nums">{formatCurrency(t.price)}</span>
            </div>
          ))}
          {cartProducts.map((p) => (
            <div key={p.productId} className="flex justify-between">
              <span className="text-foreground-muted">
                {p.quantity}x {p.productName}
              </span>
              <span className="tabular-nums">
                {formatCurrency(p.unitPrice * p.quantity)}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-accent-red-500">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
        <Button variant="primary" size="lg" className="w-full" onClick={onNewSale}>
          <Plus className="w-4 h-4" />
          Nova Venda
        </Button>
      </Card>
    </div>
  );
}

function formatDateTime(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
