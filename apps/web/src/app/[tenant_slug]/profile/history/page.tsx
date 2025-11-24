'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api-client';
import { CustomerSalesResponseDto } from '@repo/api-types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, MapPin, Clock, Film, ShoppingBag } from 'lucide-react';

export default function PurchaseHistoryPage({
    params,
}: {
    params: Promise<{ tenant_slug: string }>;
}) {
    const { tenant_slug } = use(params);
    const { user, isAuthenticated, token, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [sales, setSales] = useState<CustomerSalesResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            router.push(`/${tenant_slug}/auth/login`);
            return;
        }

        const fetchSales = async () => {
            try {
                const response = await publicApi.publicControllerGetCustomerSalesV1({
                    headers: {
                        'x-customer-id': user.id,
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSales(response.data);
                setError(null);
            } catch (error: any) {
                setError('Erro ao carregar histórico de compras. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [isAuthenticated, user, token, router, tenant_slug, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{error}</h2>
                    <button
                        onClick={() => router.push(`/${tenant_slug}/profile`)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Voltar ao Perfil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/${tenant_slug}/profile`)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Histórico de Compras</h1>
                        <p className="text-zinc-400">{sales.length} compra(s) realizada(s)</p>
                    </div>
                </div>

                {sales.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
                        <Film className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Nenhuma compra ainda</h2>
                        <p className="text-zinc-400 mb-6">
                            Quando você comprar ingressos, eles aparecerão aqui!
                        </p>
                        <button
                            onClick={() => router.push(`/${tenant_slug}`)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Ver Filmes em Cartaz
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sales.map((sale) => (
                            <div
                                key={sale.id}
                                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Movie Poster */}
                                    <div className="w-full md:w-48 h-48 md:h-auto bg-zinc-950 flex-shrink-0">
                                        {sale.movie?.poster_url ? (
                                            <img
                                                src={sale.movie.poster_url}
                                                alt={sale.movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Film className="w-12 h-12 text-zinc-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 p-6">
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold mb-2">
                                                {sale.movie?.title || 'Filme'}
                                            </h2>
                                            {sale.showtime_schedule && (
                                                <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                                                    {sale.showtime_schedule.start_time && (
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(new Date(sale.showtime_schedule.start_time), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                                        </span>
                                                    )}
                                                    {sale.showtime_schedule.cinema_complexes?.name && (
                                                        <span className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {sale.showtime_schedule.cinema_complexes.name}
                                                        </span>
                                                    )}
                                                    {sale.showtime_schedule.rooms?.name && (
                                                        <span>Sala {sale.showtime_schedule.rooms.name}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tickets */}
                                        {sale.tickets && sale.tickets.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold mb-3 text-sm text-zinc-400 uppercase tracking-wider">
                                                    Ingressos ({sale.tickets.length})
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {sale.tickets.map((ticket: any) => (
                                                        <div
                                                            key={ticket.id}
                                                            className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 flex items-center gap-4"
                                                        >
                                                            <img
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${ticket.ticket_number}`}
                                                                alt="QR Code"
                                                                className="w-16 h-16 bg-white p-1 rounded"
                                                            />
                                                            <div>
                                                                <div className="text-sm font-bold">
                                                                    Assento {ticket.seats?.row || ''}{ticket.seats?.column || ticket.seat || 'N/A'}
                                                                </div>
                                                                <div className="text-xs text-zinc-500">
                                                                    {ticket.ticket_types?.name || 'Ingresso'}
                                                                </div>
                                                                <div className="text-xs text-zinc-600 font-mono">
                                                                    {ticket.ticket_number}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Products */}
                                        {sale.concession_sales && sale.concession_sales.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold mb-3 text-sm text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Produtos
                                                </h3>
                                                <div className="space-y-2">
                                                    {sale.concession_sales.map((concession: any) =>
                                                        concession.concession_sale_items?.map((item: any) => (
                                                            item.products && (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex justify-between items-center text-sm bg-zinc-950 rounded p-2"
                                                                >
                                                                    <span>
                                                                        {item.quantity}x {item.products.name}
                                                                    </span>
                                                                    <span className="text-zinc-400">
                                                                        R$ {(Number(item.price) * item.quantity).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                            <div className="text-sm text-zinc-500">
                                                Comprado em {format(new Date(sale.sale_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                            </div>
                                            <div className="text-xl font-bold text-red-500">
                                                R$ {Number(sale.total_amount).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
