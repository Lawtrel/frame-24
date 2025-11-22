'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cinemaComplexesService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Building2, Plus, Edit, Trash2, MapPin, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Pagination } from '../components/Pagination';
import { usePaginationAndFilter } from '../hooks/usePaginationAndFilter';

export default function CinemaComplexesPage() {
    const { token } = useAuth();
    
    const {
        data: complexes,
        loading,
        error,
        currentPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        setPage,
        refetch,
    } = usePaginationAndFilter(cinemaComplexesService, token);

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir este complexo?')) return;

        try {
            await cinemaComplexesService.delete(id, token);
            refetch();
        } catch (error) {
            console.error('Error deleting complex:', error);
            alert('Erro ao excluir complexo');
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
        return <div className="p-6 text-red-500">Erro ao carregar complexos: {error}</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Complexos de Cinema"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Complexos', href: '/cinema-complexes' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Complexos de Cinema
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie os complexos e suas localizações
                        </p>
                    </div>

                    <Link
                        href="/cinema-complexes/create-edit/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Novo Complexo
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
                            placeholder="Buscar complexos por nome ou cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Complexes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complexes.map((complex) => (
                        <div key={complex.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                        <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        complex.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {complex.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {complex.name}
                                </h3>
                                
                                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p>{complex.address}</p>
                                        <p>{complex.city} - {complex.state}</p>
                                    </div>
                                </div>

                                {complex.phone && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        📞 {complex.phone}
                                    </p>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Link
                                        href={`/cinema-complexes/create-edit/${complex.id}`}
                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(complex.id)}
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

                {complexes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhum complexo cadastrado
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece cadastrando um novo complexo de cinema.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/cinema-complexes/create-edit/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Novo Complexo
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}
