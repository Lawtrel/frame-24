import { redirect } from 'next/navigation';

export default function RootPage() {
    // Redireciona o usuário para a página de dashboard
    redirect('/dashboard');
}