'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { financialService } from '../../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { BarChart3, Calendar, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

export default function CashFlowPage() {
    const { token } = useAuth();
    const [cashFlowData, setCashFlowData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days ago
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Today

    const loadCashFlow = async () => {
        if (!token || !startDate || !endDate) return;
        
        setLoading(true);
        try {
            const data = await financialService.getCashFlow(token, startDate, endDate);
            setCashFlowData(data);
        } catch (error) {
            console.error('Error loading cash flow:', error);
            alert('Erro ao carregar fluxo de caixa');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCashFlow();
    }, [token, startDate, endDate]);

    const formatCurrency = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const totalInflow = cashFlowData?.inflow || 0;
    const totalOutflow = cashFlowData?.outflow || 0;
    const netFlow = totalInflow - totalOutflow;

    return (
        <React.Fragment>
            <PageHeader
                title="Fluxo de Caixa"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Financeiro', href: '/finance' },
                    { label: 'Fluxo de Caixa', href: '/finance/cash-flow' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Análise de Fluxo de Caixa
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize as entradas e saídas de caixa no período selecionado.
                        </p>
                    </div>
                </div>

                {/* Date Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data Inicial
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data Final
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={loadCashFlow}
                        disabled={loading}
                        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calendar className="h-5 w-5" />}
                        {loading ? 'Carregando...' : 'Aplicar Filtro'}
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Inflow */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entradas (Inflow)</p>
                            <TrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(totalInflow)}
                        </p>
                    </div>

                    {/* Outflow */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saídas (Outflow)</p>
                            <TrendingDown className="h-6 w-6 text-red-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(totalOutflow)}
                        </p>
                    </div>

                    {/* Net Flow */}
                    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${netFlow >= 0 ? 'border-blue-500' : 'border-red-500'}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fluxo Líquido</p>
                            <BarChart3 className={`h-6 w-6 ${netFlow >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
                        </div>
                        <p className={`text-3xl font-bold ${netFlow >= 0 ? 'text-blue-600' : 'text-red-600'} dark:text-white mt-1`}>
                            {formatCurrency(netFlow)}
                        </p>
                    </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Gráfico de Fluxo de Caixa (Placeholder)
                    </h3>
                    <div className="h-96 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">
                            Gráfico de linhas ou barras será implementado aqui.
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
