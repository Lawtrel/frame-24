'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productsService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        if (!token) return;
        
        try {
            const data = await productsService.getAll(token);
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await productsService.delete(id, token);
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erro ao excluir produto');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Produtos"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Produtos', href: '/products' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gerenciar Produtos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize e gerencie todos os produtos do catálogo
                        </p>
                    </div>

                    <Link
                        href="/products/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Novo Produto
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar produtos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Package className="h-8 w-8 text-blue-600" />
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        product.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {product.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {product.name}
                                </h3>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {product.description || 'Sem descrição'}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-blue-600">
                                        R$ {product.price?.toFixed(2) || '0.00'}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Estoque: {product.stock || 0}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/products/edit/${product.id}`}
                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhum produto encontrado
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece cadastrando um novo produto.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/products/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Produto
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}
