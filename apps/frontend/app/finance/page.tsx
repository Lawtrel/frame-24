'use client';

import React from 'react';
import { PageHeader } from '@repo/ui/page-header';
import { DollarSign, ArrowDown, ArrowUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const financeModules = [
    {
        title: 'Contas a Pagar',
        description: 'Gerencie todas as despesas e obrigações financeiras da empresa.',
        icon: ArrowDown,
        href: '/finance/accounts-payable',
        color: 'text-red-600 bg-red-100',
    },
    {
        title: 'Contas a Receber',
        description: 'Acompanhe todos os valores a serem recebidos de clientes e parceiros.',
        icon: ArrowUp,
        href: '/finance/accounts-receivable',
        color: 'text-green-600 bg-green-100',
    },
    {
        title: 'Fluxo de Caixa',
        description: 'Visualize e analise o movimento de entradas e saídas de dinheiro.',
        icon: BarChart3,
        href: '/finance/cash-flow',
        color: 'text-blue-600 bg-blue-100',
    },
];

export default function FinancePage() {
    return (
        <React.Fragment>
            <PageHeader
                title="Gestão Financeira"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Financeiro', href: '/finance' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Módulos Financeiros
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Selecione o módulo para gerenciar as finanças do cinema.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {financeModules.map((module) => (
                        <Link key={module.title} href={module.href}>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer">
                                <div className={`p-3 rounded-full w-fit mb-4 ${module.color}`}>
                                    <module.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {module.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {module.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}
