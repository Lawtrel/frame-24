'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { moviesService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Film, Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../components/MovieCard';

export default function MoviesPage() {
    const { token } = useAuth();
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        if (!token) return;
        
        try {
            const data = await moviesService.getAll(token);
            setMovies(data);
        } catch (error) {
            console.error('Error loading movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir este filme?')) return;

        try {
            await moviesService.delete(id, token);
            loadMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Erro ao excluir filme');
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Filmes"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Filmes', href: '/movies' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Catálogo de Filmes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Visualize e gerencie todos os filmes do catálogo
                        </p>
                    </div>

                    <Link
                        href="/movies/create-edit/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Cadastrar Filme
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
                            placeholder="Buscar filmes por título ou diretor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMovies.map((movie: any) => (
                        <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Film className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhum filme cadastrado
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece cadastrando o primeiro filme.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/movies/create-edit/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Cadastrar Filme
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

// Componente MovieCard precisa ser atualizado para receber onDelete e usar o link de edição correto
// O MovieCard original não foi fornecido, assumindo que está em apps/frontend/app/components/MovieCard.tsx
// e que precisa ser atualizado para usar o link de edição correto e o botão de delete.
