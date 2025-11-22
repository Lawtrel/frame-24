'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { moviesService, productsService, showtimesService, usersService, salesService, financialService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Film, Package, Calendar, Users, Loader2, BarChart3, DollarSign, Landmark, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { token, user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        moviesCount: 0,
        productsCount: 0,
        showtimesCount: 0,
        usersCount: 0,
        totalSales: 0,
        netFlow: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [token]);

    const loadDashboardData = async () => {
        if (!token) return;
        
        setLoading(true);
        try {
            const [movies, products, showtimes, users, sales, cashFlow] = await Promise.all([
                moviesService.getAll(token, 1, 1).catch(() => ({ total: 0 })),
                productsService.getAll(token, 1, 1).catch(() => ({ total: 0 })),
                showtimesService.getAll(token, 1, 1).catch(() => ({ total: 0 })),
                usersService.getAll(token, 1, 1).catch(() => ({ total: 0 })),
                salesService.getAll(token, 1, 1).catch(() => ({ total: 0 })),
                financialService.getCashFlow(token, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], new Date().toISOString().split('T')[0]).catch(() => ({ inflow: 0, outflow: 0 })),
            ]);

            setDashboardData({
                moviesCount: movies.total || 0,
                productsCount: products.total || 0,
                showtimesCount: showtimes.total || 0,
                usersCount: users.total || 0,
                totalSales: sales.total || 0,
                netFlow: (cashFlow.inflow || 0) - (cashFlow.outflow || 0),
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Carregando Dashboard...</span>
            </div>
        );
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Dashboard" 
                breadcrumbItems={[]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Bem-vindo, {user?.name || 'Usuário'}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Aqui está um resumo do seu sistema Frame-24
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Filmes Cadastrados</p>
                            <Film className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {dashboardData.moviesCount}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Produtos em Estoque</p>
                            <Package className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {dashboardData.productsCount}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sessões Agendadas</p>
                            <Calendar className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {dashboardData.showtimesCount}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuários Ativos</p>
                            <Users className="h-6 w-6 text-yellow-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {dashboardData.usersCount}
                        </p>
                    </div>
                </div>

                {/* Sales and Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Total Sales */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-teal-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Vendas (Mês)</p>
                            <DollarSign className="h-6 w-6 text-teal-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(dashboardData.totalSales)}
                        </p>
                    </div>

                    {/* Net Flow */}
                    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${dashboardData.netFlow >= 0 ? 'border-lime-500' : 'border-red-500'}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fluxo Líquido (30 Dias)</p>
                            {dashboardData.netFlow >= 0 ? <TrendingUp className="h-6 w-6 text-lime-500" /> : <TrendingDown className="h-6 w-6 text-red-500" />}
                        </div>
                        <p className={`text-3xl font-bold ${dashboardData.netFlow >= 0 ? 'text-lime-600' : 'text-red-600'} dark:text-white mt-1`}>
                            {formatCurrency(dashboardData.netFlow)}
                        </p>
                    </div>
                </div>

                {/* Charts and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico de Vendas */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Vendas por Mês (Placeholder)
                        </h3>
                        <div className="h-80 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">
                                Gráfico de barras ou linhas será implementado aqui.
                            </p>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Ações Rápidas
                        </h3>
                        <div className="space-y-3">
                            <Link href="/sales/pos" className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <span className="text-gray-900 dark:text-white">Iniciar Nova Venda (PDV)</span>
                            </Link>
                            <Link href="/movies/create-edit/create" className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                <Film className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-900 dark:text-white">Cadastrar Novo Filme</span>
                            </Link>
                            <Link href="/products/create-edit/create" className="flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                <Package className="h-5 w-5 text-yellow-600" />
                                <span className="text-gray-900 dark:text-white">Adicionar Novo Produto</span>
                            </Link>
                            <Link href="/showtimes/create-edit/create" className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <span className="text-gray-900 dark:text-white">Agendar Nova Sessão</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Fluxo de Caixa */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-red-600" />
                        Fluxo de Caixa (Placeholder)
                    </h3>
                    <div className="h-80 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">
                            Gráfico de entradas e saídas será implementado aqui.
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
