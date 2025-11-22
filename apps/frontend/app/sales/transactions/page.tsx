'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { salesService } from '../../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { DollarSign, Search, Loader2, FileText } from 'lucide-react';
import { Pagination } from '../../components/Pagination';
import { usePaginationAndFilter } from '../../hooks/usePaginationAndFilter';

export default function TransactionsPage() {
    const { token } = useAuth();
    
    const {
        data: transactions,
        loading,
        error,
        currentPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        setPage,
    } = usePaginationAndFilter(salesService, token);

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando transações...</span>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">Erro ao carregar transações: {error}</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Histórico de Transações"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Vendas', href: '/sales/pos' },
                    { label: 'Transações', href: '/sales/transactions' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Transações de Vendas
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize o histórico completo de vendas
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, valor ou status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    ID da Venda
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Data/Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Itens
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.map((transaction: any) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {transaction.id.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(transaction.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(transaction.total)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.status === 'completed' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : transaction.status === 'canceled'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {transaction.status === 'completed' ? 'Concluída' : 
                                             transaction.status === 'canceled' ? 'Cancelada' : 
                                             'Pendente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {transaction.items?.length || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>

                    {transactions.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhuma transação encontrada
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                As transações de vendas aparecerão aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
