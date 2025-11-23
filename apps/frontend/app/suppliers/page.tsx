'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { suppliersService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Truck, Plus, Edit, Trash2, Phone, Mail, MapPin, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Pagination } from '../components/Pagination';
import { usePaginationAndFilter } from '../hooks/usePaginationAndFilter';

export default function SuppliersPage() {
    const { token } = useAuth();
    
    const {
        data: suppliers,
        loading,
        error,
        currentPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        setPage,
        refetch,
    } = usePaginationAndFilter(suppliersService, token);

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir este fornecedor?')) return;

        try {
            await suppliersService.delete(id, token);
            refetch();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            alert('Erro ao excluir fornecedor');
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando...</span>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">Erro ao carregar fornecedores: {error}</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Fornecedores"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Fornecedores', href: '/suppliers' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gerenciar Fornecedores
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize e gerencie todos os fornecedores
                        </p>
                    </div>

                    <Link
                        href="/suppliers/create-edit/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Novo Fornecedor
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
                            placeholder="Buscar fornecedores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                        <Truck className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        supplier.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {supplier.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {supplier.name}
                                </h3>
                                
                                {supplier.trade_name && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {supplier.trade_name}
                                    </p>
                                )}

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {supplier.document && (
                                        <div>
                                            <span className="font-medium">CNPJ:</span> {supplier.document}
                                        </div>
                                    )}
                                    
                                    {supplier.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <span>{supplier.email}</span>
                                        </div>
                                    )}
                                    
                                    {supplier.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            <span>{supplier.phone}</span>
                                        </div>
                                    )}
                                    
                                    {supplier.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p>{supplier.address}</p>
                                                {supplier.city && supplier.state && (
                                                    <p>{supplier.city} - {supplier.state}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {supplier.contact_person && (
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contato</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {supplier.contact_person}
                                        </p>
                                        {supplier.contact_phone && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {supplier.contact_phone}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Link
                                        href={`/suppliers/create-edit/${supplier.id}`}
                                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(supplier.id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>

                {suppliers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Truck className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhum fornecedor cadastrado
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece cadastrando um novo fornecedor.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/suppliers/create-edit/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Fornecedor
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}
