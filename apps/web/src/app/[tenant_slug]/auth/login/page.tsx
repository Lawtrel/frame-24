'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { customerAuthApi } from '@/lib/api-client';
import { useCompany } from '@/hooks/use-company';
import { extractErrorMessage } from '@/lib/error-utils';

export default function LoginPage({
    params,
}: {
    params: Promise<{ tenant_slug: string }>;
}) {
    const { tenant_slug } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const { data: company } = useCompany(tenant_slug);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const returnUrl = searchParams.get('returnUrl') || `/${tenant_slug}`;

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push(returnUrl);
        }
    }, [authLoading, isAuthenticated, router, returnUrl]);

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    // Don't render login form if already authenticated
    if (isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await customerAuthApi.customerAuthControllerLoginV1({
                loginCustomerDto: {
                    email,
                    password,
                    company_id: (company as any)?.id,
                },
            });

            const { access_token, customer } = response.data;
            login(access_token, customer);
            router.push(returnUrl);
        } catch (err: any) {
            const errorMessage = extractErrorMessage(err, 'Erro ao realizar login. Verifique suas credenciais.');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
                        <p className="text-zinc-400">Acesse sua conta para continuar</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500/20" />
                                <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">Lembrar de mim</span>
                            </label>
                            <a href="#" className="text-red-400 hover:text-red-300 transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-lg shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-zinc-400 text-sm">
                        Não tem uma conta?{' '}
                        <Link
                            href={`/${tenant_slug}/auth/register`}
                            className="text-white font-semibold hover:text-red-400 transition-colors"
                        >
                            Cadastre-se gratuitamente
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
