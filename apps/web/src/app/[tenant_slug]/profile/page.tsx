'use client';

import { use, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { User, Award, History, LogOut, Mail } from 'lucide-react';

export default function ProfilePage({
    params,
}: {
    params: Promise<{ tenant_slug: string }>;
}) {
    const { tenant_slug } = use(params);
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/${tenant_slug}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, tenant_slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
                    <p className="text-zinc-400">Informações da sua conta</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Card */}
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-zinc-400 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <h3 className="font-semibold">Nível de Fidelidade</h3>
                                </div>
                                <p className="text-2xl font-bold text-yellow-500">
                                    {user.loyalty_level || 'Bronze'}
                                </p>
                            </div>

                            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="w-5 h-5 text-red-500" />
                                    <h3 className="font-semibold">Pontos Acumulados</h3>
                                </div>
                                <p className="text-2xl font-bold text-red-500">
                                    {user.accumulated_points || 0} pts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push(`/${tenant_slug}/profile/history`)}
                            className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
                        >
                            <History className="w-5 h-5" />
                            Histórico de Compras
                        </button>

                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
