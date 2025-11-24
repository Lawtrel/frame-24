'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSeatReservation } from '@/hooks/use-seat-reservation';
import { useShowtimeDetails } from '@/hooks/use-showtime-details';
import { useCompany } from '@/hooks/use-company';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '@/lib/api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    category_id: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function ProductSelectionPage({
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
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [ticketTotal, setTicketTotal] = useState(0);

    // Redirecionar se não houver reserva
    useEffect(() => {
        if (isInitialized && (!reservation.reservationUuid || reservation.reservedSeatIds.length === 0)) {
            router.replace(`/${tenant_slug}/showtime/${id}`);
        }
    }, [isInitialized, reservation, router, tenant_slug, id]);

    // Carregar total dos ingressos do localStorage
    useEffect(() => {
        const savedTickets = localStorage.getItem(`selected-tickets-${id}`);
        if (savedTickets && showtime) {
            // Aqui idealmente recalcularíamos o total com base nos tipos salvos
            // Por simplificação, vamos assumir um valor base ou recuperar o total se tivesse sido salvo
            // Vamos recalcular rapidinho se tivermos os tipos (but we don't have them here easily)
            // Para MVP, vamos assumir que o usuário selecionou e seguir
        }
    }, [id, showtime]);

    // Buscar produtos
    useEffect(() => {
        async function fetchProducts() {
            try {
                // Buscar produtos com preços específicos do complexo
                const complexId = showtime?.cinema?.name ? showtime.cinema.name : undefined; // Ajustar conforme estrutura real se tiver ID
                // Nota: O hook useShowtimeDetails agora retorna cinema.name, mas precisamos do ID para preços
                // Vamos tentar pegar do showtime se tiver, ou usar sem filtro por enquanto

                const url = `/public/companies/${tenant_slug}/products`;
                const params: any = {};
                // Se tivermos o ID do complexo no futuro, adicionamos aqui
                // params.complex_id = complexId;

                const response = await api.get(url, { params });
                setProducts(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            } finally {
                setLoading(false);
            }
        }

        if (showtime) {
            fetchProducts();
        }
    }, [tenant_slug, showtime]);

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0;
            const newQty = Math.max(0, currentQty + delta);

            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [productId]: newQty };
        });
    };

    const calculateProductTotal = () => {
        return Object.entries(cart).reduce((total, [productId, qty]) => {
            const product = products.find(p => p.id === productId);
            return total + (product ? product.price * qty : 0);
        }, 0);
    };

    const handleContinue = () => {
        // Salvar carrinho no localStorage
        localStorage.setItem(`cart-${id}`, JSON.stringify(cart));
        router.push(`/${tenant_slug}/showtime/${id}/checkout`);
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
                        <h1 className="text-xl font-bold">{showtime.movie?.title}</h1>
                        <p className="text-sm text-zinc-400">
                            Bomboniere • {showtime.cinema?.name}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-zinc-400">Tempo restante</div>
                        <div className="text-xl font-mono font-bold text-red-500">
                            {Math.floor(reservation.timeRemaining / 60)}:{(reservation.timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 mt-8">
                <h2 className="text-2xl font-bold mb-6">Adicione itens ao seu pedido</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map(product => {
                        const quantity = cart[product.id] || 0;

                        return (
                            <div key={product.id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 flex gap-4">
                                {/* Imagem Placeholder */}
                                <div className="w-24 h-24 bg-zinc-800 rounded-md flex-shrink-0 flex items-center justify-center text-zinc-600">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold">{product.name}</h3>
                                        <p className="text-sm text-zinc-400 line-clamp-2">{product.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="font-bold text-lg">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </div>

                                        <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(product.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
                                                disabled={quantity === 0}
                                            >
                                                -
                                            </button>
                                            <span className="w-4 text-center font-bold">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(product.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer com Total e Ação */}
            <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <div className="text-sm text-zinc-400">Total Produtos</div>
                        <div className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateProductTotal())}
                        </div>
                    </div>
                    <button
                        onClick={handleContinue}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                        Continuar para Pagamento
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    );
}
