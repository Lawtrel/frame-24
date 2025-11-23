'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { salesService, productsService, showtimesService } from '../../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { ShoppingCart, Plus, Minus, X, DollarSign, Ticket, Package, Search, Loader2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image_url?: string;
}

interface Showtime {
    id: string;
    movie: { title: string };
    room: { name: string };
    start_time: string;
    price: number;
}

interface SaleItem {
    id: string;
    type: 'product' | 'ticket';
    name: string;
    price: number;
    quantity: number;
    total: number;
    refId: string; // product ID or showtime ID
}

interface Sale {
    id: string;
    items: SaleItem[];
    total: number;
    status: 'pending' | 'completed' | 'canceled';
}

export default function POSPage() {
    const { token } = useAuth();
    const [sale, setSale] = useState<Sale | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'showtimes'>('products');

    const loadData = useCallback(async () => {
        if (!token) return;
        
        try {
            const [productsData, showtimesData] = await Promise.all([
                productsService.getAll(token, 1, 100), // Fetch first 100 products
                showtimesService.getAll(token, 1, 100), // Fetch first 100 showtimes
            ]);
            setProducts(productsData.data || []);
            setShowtimes(showtimesData.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const startNewSale = async () => {
        if (!token) return;
        try {
            const newSale = await salesService.startSale(token);
            setSale({ ...newSale, items: [], total: 0, status: 'pending' });
        } catch (error) {
            console.error('Error starting new sale:', error);
            alert('Erro ao iniciar nova venda');
        }
    };

    const addItemToSale = async (item: { type: 'product' | 'ticket', refId: string, name: string, price: number }) => {
        if (!token || !sale) {
            await startNewSale();
            return;
        }

        try {
            const data = {
                type: item.type,
                refId: item.refId,
                quantity: 1,
                price: item.price,
            };
            const updatedSale = await salesService.addItem(sale.id, data, token);
            setSale(updatedSale);
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Erro ao adicionar item');
        }
    };

    const removeItemFromSale = async (itemId: string) => {
        if (!token || !sale) return;

        try {
            const updatedSale = await salesService.removeItem(sale.id, itemId, token);
            setSale(updatedSale);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Erro ao remover item');
        }
    };

    const completeSale = async () => {
        if (!token || !sale || sale.items.length === 0) return;

        const paymentData = {
            paymentMethod: 'credit_card', // Placeholder
            amount: sale.total,
        };

        try {
            const completedSale = await salesService.completeSale(sale.id, paymentData, token);
            alert(`Venda concluída! Total: R$ ${completedSale.total.toFixed(2).replace('.', ',')}`);
            setSale(null); // Clear sale after completion
            await startNewSale(); // Start a new sale automatically
        } catch (error) {
            console.error('Error completing sale:', error);
            alert('Erro ao finalizar venda');
        }
    };

    const cancelSale = async () => {
        if (!token || !sale) return;

        if (!confirm('Tem certeza que deseja cancelar esta venda?')) return;

        try {
            await salesService.cancelSale(sale.id, token);
            alert('Venda cancelada.');
            setSale(null);
            await startNewSale();
        } catch (error) {
            console.error('Error canceling sale:', error);
            alert('Erro ao cancelar venda');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredShowtimes = showtimes.filter(s =>
        s.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando dados do PDV...</span>
            </div>
        );
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Ponto de Venda (PDV)"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Vendas', href: '/sales/pos' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Produtos e Sessões */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Catálogo de Vendas
                    </h2>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === 'products'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => setActiveTab('showtimes')}
                            className={`px-4 py-2 text-sm font-medium ${
                                activeTab === 'showtimes'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            Ingressos
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={`Buscar ${activeTab === 'products' ? 'produtos' : 'sessões'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="h-[600px] overflow-y-auto pr-2">
                        {activeTab === 'products' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500"
                                        onClick={() => addItemToSale({ type: 'product', refId: product.id, name: product.name, price: product.price })}
                                    >
                                        <div className="flex justify-center mb-2">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="h-16 w-16 object-cover rounded-full" />
                                            ) : (
                                                <Package className="h-10 w-10 text-blue-600" />
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate text-center">
                                            {product.name}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 text-center">
                                            {formatCurrency(product.price)}
                                        </p>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                                        Nenhum produto encontrado.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'showtimes' && (
                            <div className="space-y-4">
                                {filteredShowtimes.map(showtime => (
                                    <div
                                        key={showtime.id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500"
                                        onClick={() => addItemToSale({ type: 'ticket', refId: showtime.id, name: `Ingresso: ${showtime.movie.title} (${formatTime(showtime.start_time)})`, price: showtime.price })}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {showtime.movie.title}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {showtime.room.name} - {formatTime(showtime.start_time)}
                                                </p>
                                            </div>
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(showtime.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {filteredShowtimes.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                                        Nenhuma sessão encontrada.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Carrinho e Finalização */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6" />
                        Carrinho
                    </h2>

                    {sale && sale.items.length > 0 ? (
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                            {sale.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatCurrency(item.price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">
                                            {formatCurrency(item.total)}
                                        </p>
                                        <button
                                            onClick={() => removeItemFromSale(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <ShoppingCart className="h-12 w-12 mb-4" />
                            <p>O carrinho está vazio.</p>
                            <button 
                                onClick={startNewSale}
                                className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" /> Iniciar Nova Venda
                            </button>
                        </div>
                    )}

                    {/* Total e Ações */}
                    {sale && (
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">Total:</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(sale.total)}
                                </p>
                            </div>

                            <button
                                onClick={completeSale}
                                disabled={sale.items.length === 0}
                                className={`w-full py-3 rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2 ${
                                    sale.items.length > 0
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <DollarSign className="h-5 w-5" />
                                Finalizar Venda
                            </button>

                            <button
                                onClick={cancelSale}
                                disabled={sale.items.length === 0}
                                className={`w-full mt-2 py-3 rounded-lg text-red-600 border border-red-600 font-bold transition-colors flex items-center justify-center gap-2 ${
                                    sale.items.length > 0
                                        ? 'hover:bg-red-50 dark:hover:bg-red-900'
                                        : 'text-gray-400 border-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <X className="h-5 w-5" />
                                Cancelar Venda
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
