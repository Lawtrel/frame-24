'use client';

import { Movie } from '../types/movie';
import { Clock, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MovieCardProps {
    movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/movies/edit/${movie.id}`);
    };

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir este filme?')) {
            try {
                await fetch(`/api/movies/${movie.id}`, {
                    method: 'DELETE',
                });
                router.refresh(); // Recarrega a página
            } catch (error) {
                console.error('Error deleting movie:', error);
                alert('Erro ao excluir filme');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white line-clamp-1">
                    {movie.title}
                </h3>

                {movie.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {movie.description}
                    </p>
                )}

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} className="mr-2" />
                        <span>{movie.duration} minutos</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} className="mr-2" />
                        <span>{new Date(movie.release_date).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {movie.age_ratings && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User size={16} className="mr-2" />
                            <span>{movie.age_ratings.name}</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex space-x-2">
                    <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                        <Edit size={14} />
                        Editar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                    >
                        <Trash2 size={14} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}