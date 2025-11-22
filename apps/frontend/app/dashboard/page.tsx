'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { moviesService, productsService, showtimesService, usersService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Film, Package, Calendar, Users, TrendingUp, DollarSign, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { token, user } = useAuth();
    const [metrics, setMetrics] = useState({
        totalMovies: 0,
        totalProducts: 0,
        totalShowtimes: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        if (!token) return;
        
        try {
            const [movies, products, showtimes, users] = await Promise.all([
                moviesService.getAll(token).catch(() => []),
                productsService.getAll(token).catch(() => []),
                showtimesService.getAll(token).catch(() => []),
                usersService.getAll(token).catch(() => []),
            ]);

            setMetrics({
                totalMovies: movies.length,
                totalProducts: products.length,
                totalShowtimes: showtimes.length,
                totalUsers: users.length,
            });
        } catch (error) {
            console.error('Error loading metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Filmes',
            value: metrics.totalMovies,
            icon: Film,
            color: 'bg-blue-500',
            href: '/movies',
        },
        {
            title: 'Produtos',
            value: metrics.totalProducts,
            icon: Package,
            color: 'bg-green-500',
            href: '/products',
        },
        {
            title: 'Sessões',
            value: metrics.totalShowtimes,
            icon: Calendar,
            color: 'bg-purple-500',
            href: '/showtimes',
        },
        {
            title: 'Usuários',
            value: metrics.totalUsers,
            icon: Users,
            color: 'bg-orange-500',
            href: '/users',
        },
    ];

    if (loading) {
        return <div className="p-6">Carregando...</div>;
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
                    {statCards.map((stat) => (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Ações Rápidas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/movies/cadastrar"
                            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-3"
                        >
                            <Film className="h-6 w-6" />
                            <span className="font-medium">Cadastrar Filme</span>
                        </Link>
                        <Link
                            href="/products/create"
                            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-3"
                        >
                            <Package className="h-6 w-6" />
                            <span className="font-medium">Novo Produto</span>
                        </Link>
                        <Link
                            href="/showtimes/create"
                            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-3"
                        >
                            <Calendar className="h-6 w-6" />
                            <span className="font-medium">Agendar Sessão</span>
                        </Link>
                        <Link
                            href="/users/create"
                            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-3"
                        >
                            <Users className="h-6 w-6" />
                            <span className="font-medium">Novo Usuário</span>
                        </Link>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Receita do Mês
                            </h3>
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            R$ 0,00
                        </p>
                        <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>Em desenvolvimento</span>
                        </div>
                    </div>

                    {/* Attendance Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Público do Mês
                            </h3>
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            0
                        </p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span>Ingressos vendidos</span>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        🎬 Frame-24 - Sistema de Gestão para Cinema
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Sistema completo para gerenciamento de complexos de cinema, incluindo catálogo de filmes, 
                        programação de sessões, gestão de produtos, controle de estoque e muito mais.
                    </p>
                </div>
            </div>
        </React.Fragment>
    );
}
