'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSeatReservation } from '@/hooks/use-seat-reservation';
import { useShowtimeDetails } from '@/hooks/use-showtime-details';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCompany } from '@/hooks/use-company';
import { api } from '@/lib/api';
import { extractErrorMessage } from '@/lib/error-utils';

interface TicketType {
    id: string;
    name: string;
    price_modifier?: number;
    discount_percentage?: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

export default function CheckoutPage({
    params,
}: {
    params: Promise<{ tenant_slug: string; id: string }>;
}) {
    const { tenant_slug, id } = use(params);
    const router = useRouter();
    const { data: companyData } = useCompany(tenant_slug);
    const company = companyData as any;

    const { reservation, isInitialized } = useSeatReservation({
        showtimeId: id,
        companyId: company?.id || '',
        user: null
    });

    const { data: showtime } = useShowtimeDetails(id);
    const { user } = useAuth();

    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<Record<string, string>>({});
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Redirecionar se não houver reserva
    useEffect(() => {
        if (isInitialized && (!reservation.reservationUuid || reservation.reservedSeatIds.length === 0)) {
            router.replace(`/${tenant_slug}/showtime/${id}`);
        }
    }, [isInitialized, reservation, router, tenant_slug, id]);

    // Carregar dados
    useEffect(() => {
        async function loadData() {
            try {
                // Carregar seleções do localStorage
                const savedTickets = localStorage.getItem(`selected-tickets-${id}`);
                const savedCart = localStorage.getItem(`cart-${id}`);

                if (savedTickets) setSelectedTickets(JSON.parse(savedTickets));
                if (savedCart) setCart(JSON.parse(savedCart));

                // Buscar tipos de ingresso
                const ticketsRes = await api.get(`/public/companies/${tenant_slug}/ticket-types`);
                setTicketTypes(ticketsRes.data);

                // Buscar produtos
                const productsUrl = `/public/companies/${tenant_slug}/products`;
                const productsRes = await api.get(productsUrl);
                setProducts(productsRes.data);

            } catch (error) {
            } finally {
                setLoading(false);
            }
        }

        if (showtime) {
            loadData();
        }
    }, [tenant_slug, showtime, id]);

    const calculateTotal = () => {
        if (!showtime) return 0;

        // Total Ingressos
        // Total Ingressos
        const ticketsTotal = reservation.reservedSeatIds.reduce((total, seatId) => {
            const ticketTypeId = selectedTickets[seatId];
            const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
            if (!ticketType) return total;

            // Encontrar detalhes do assento para pegar o valor adicional
            const seatDetails = showtime.seats.find(s => s.id === seatId);
            const additionalValue = Number(seatDetails?.additional_value || 0);

            const basePrice = Number(showtime.base_ticket_price);
            const seatBasePrice = basePrice + additionalValue;

            let multiplier = 1;
            if (ticketType.price_modifier !== undefined && ticketType.price_modifier !== null) {
                multiplier = Number(ticketType.price_modifier);
            } else if (ticketType.discount_percentage) {
                multiplier = 1 - (Number(ticketType.discount_percentage) / 100);
            }

            return total + (seatBasePrice * multiplier);
        }, 0);

        // Total Produtos
        const productsTotal = Object.entries(cart).reduce((total, [productId, qty]) => {
            const product = products.find(p => p.id === productId);
            return total + (product ? product.price * qty : 0);
        }, 0);

        return ticketsTotal + productsTotal;
    };

    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            if (!tenant_slug) return; // Use tenant_slug directly from the destructured params
            try {
                const response = await api.get(`/public/companies/${tenant_slug}/payment-methods`);
                setPaymentMethods(response.data);
                // Selecionar o primeiro por padrão se houver
                if (response.data.length > 0) {
                    setSelectedPaymentMethod(response.data[0].id);
                }
            } catch (error) {
                console.error('Erro ao buscar métodos de pagamento:', error);
            }
        };

        fetchPaymentMethods();
    }, [tenant_slug]); // Use tenant_slug directly from the destructured params

    const handleCheckout = async () => {
        if (!selectedPaymentMethod) {
            alert('Selecione um método de pagamento');
            return;
        }

        setProcessing(true);
        try {
            // Montar payload da venda
            const salePayload = {
                cinema_complex_id: showtime?.cinema?.id,
                customer_id: user?.id, // Opcional se não logado
                payment_method: selectedPaymentMethod,
                tickets: reservation.reservedSeatIds.map(seatId => ({
                    showtime_id: id,
                    seat_id: seatId,
                    ticket_type: selectedTickets[seatId]
                })),
                concession_items: Object.entries(cart).map(([itemId, quantity]) => ({
                    item_type: 'PRODUCT',
                    item_id: itemId,
                    quantity
                }))
            };

            const response = await api.post('/public/sales', salePayload);

            if (response.status === 201) {
                // Sucesso! Limpar dados e redirecionar
                localStorage.removeItem(`selected-tickets-${id}`);
                localStorage.removeItem(`cart-${id}`);
                // IMPORTANTE: Limpar reserva de assentos também
                localStorage.removeItem(`seat-reservation-${id}`);
                // O backend deve cuidar de mudar o status dos assentos

                alert('Compra realizada com sucesso!');
                router.push(`/${tenant_slug}/confirmation/${response.data.id}`);
            } else {
                alert(`Erro na compra: Tente novamente`);
            }
        } catch (error: any) {
            console.error('Erro no checkout:', error);
            const errorMessage = extractErrorMessage(error, 'Erro ao processar compra. Verifique sua conexão.');
            alert(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    if (loading || !showtime) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Checkout</h1>
                        <p className="text-sm text-zinc-400">Revise seu pedido</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-zinc-400">Tempo restante</div>
                        <div className="text-xl font-mono font-bold text-red-500">
                            {Math.floor(reservation.timeRemaining / 60)}:{(reservation.timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 mt-8 grid md:grid-cols-[1fr_350px] gap-8">
                {/* Detalhes do Pedido */}
                <div className="space-y-6">
                    {/* Filme e Sessão */}
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                        <h3 className="font-bold text-lg mb-4 text-zinc-200">Sessão</h3>
                        <div className="flex gap-4">
                            {showtime.movie?.poster_url && (
                                <img src={showtime.movie.poster_url} alt="Poster" className="w-16 h-24 object-cover rounded" />
                            )}
                            <div>
                                <h4 className="font-bold text-white">{showtime.movie?.title}</h4>
                                <p className="text-zinc-400 text-sm">
                                    {showtime.cinema?.name} • Sala {showtime.room?.name}
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    {showtime.start_time && format(new Date(showtime.start_time), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ingressos */}
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                        <h3 className="font-bold text-lg mb-4 text-zinc-200">Ingressos</h3>
                        <div className="space-y-3">
                            {reservation.reservedSeatIds.map(seatId => {
                                const ticketTypeId = selectedTickets[seatId];
                                const ticketType = ticketTypes.find(t => t.id === ticketTypeId);

                                // Encontrar detalhes do assento para pegar o valor adicional
                                const seatDetails = showtime.seats.find(s => s.id === seatId);
                                const additionalValue = Number(seatDetails?.additional_value || 0);

                                const basePrice = Number(showtime.base_ticket_price);
                                const seatBasePrice = basePrice + additionalValue;

                                let multiplier = 1;
                                if (ticketType?.price_modifier !== undefined && ticketType.price_modifier !== null) {
                                    multiplier = Number(ticketType.price_modifier);
                                } else if (ticketType?.discount_percentage) {
                                    multiplier = 1 - (Number(ticketType.discount_percentage) / 100);
                                }
                                const price = seatBasePrice * multiplier;

                                return (
                                    <div key={seatId} className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="text-zinc-300">Assento (ID: {seatId.substring(0, 4)})</span>
                                            <span className="text-zinc-500 mx-2">•</span>
                                            <span className="text-zinc-400">{ticketType?.name || 'Padrão'}</span>
                                        </div>
                                        <div className="font-mono text-zinc-300">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Produtos */}
                    {Object.keys(cart).length > 0 && (
                        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                            <h3 className="font-bold text-lg mb-4 text-zinc-200">Bomboniere</h3>
                            <div className="space-y-3">
                                {Object.entries(cart).map(([productId, qty]) => {
                                    const product = products.find(p => p.id === productId);
                                    if (!product) return null;
                                    return (
                                        <div key={productId} className="flex justify-between items-center text-sm">
                                            <div>
                                                <span className="text-zinc-300">{qty}x {product.name}</span>
                                            </div>
                                            <div className="font-mono text-zinc-300">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * qty)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Pagamento */}
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                        <h3 className="font-bold text-lg mb-4 text-zinc-200">Pagamento</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.length === 0 ? (
                                <div className="col-span-2 text-center text-zinc-500 py-4">
                                    Carregando métodos de pagamento...
                                </div>
                            ) : (
                                paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`p-4 rounded border text-center transition-colors ${selectedPaymentMethod === method.id
                                            ? 'bg-red-500/10 border-red-500 text-white'
                                            : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {method.name}
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="mt-4 p-4 bg-zinc-950 rounded border border-zinc-800 text-center text-zinc-500 text-sm">
                            Ambiente de Teste - Nenhuma cobrança real será realizada
                        </div>
                    </div>
                </div>

                {/* Resumo Lateral */}
                <div>
                    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 sticky top-24">
                        <h3 className="font-bold text-xl mb-6 text-white">Resumo do Pedido</h3>

                        <div className="space-y-2 mb-6 pb-6 border-b border-zinc-800">
                            <div className="flex justify-between text-zinc-400">
                                <span>Ingressos</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                    reservation.reservedSeatIds.reduce((total, seatId) => {
                                        const ticketTypeId = selectedTickets[seatId];
                                        const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
                                        if (!ticketType) return total;

                                        // Encontrar detalhes do assento para pegar o valor adicional
                                        const seatDetails = showtime.seats.find(s => s.id === seatId);
                                        const additionalValue = Number(seatDetails?.additional_value || 0);

                                        const basePrice = Number(showtime.base_ticket_price);
                                        const seatBasePrice = basePrice + additionalValue;

                                        let multiplier = 1;
                                        if (ticketType.price_modifier !== undefined && ticketType.price_modifier !== null) {
                                            multiplier = Number(ticketType.price_modifier);
                                        } else if (ticketType.discount_percentage) {
                                            multiplier = 1 - (Number(ticketType.discount_percentage) / 100);
                                        }
                                        return total + (seatBasePrice * multiplier);
                                    }, 0)
                                )}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Bomboniere</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                    Object.entries(cart).reduce((total, [productId, qty]) => {
                                        const product = products.find(p => p.id === productId);
                                        return total + (product ? product.price * qty : 0);
                                    }, 0)
                                )}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Taxas</span>
                                <span>R$ 0,00</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <span className="text-zinc-200 font-bold">Total</span>
                            <span className="text-2xl font-bold text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={processing}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-green-900/20"
                        >
                            {processing ? 'Processando...' : 'Finalizar Compra'}
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
}
