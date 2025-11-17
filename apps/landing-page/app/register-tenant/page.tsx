import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';

export default function RegisterTenantPage() {
    return (
        <div className="min-h-screen bg-gray-950">
            <header className="border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition">
                        ← Voltar
                    </Link>
                </nav>
            </header>

            <main className="flex items-center justify-center px-6 py-12">
                <RegisterForm/>
            </main>
        </div>
    );
}