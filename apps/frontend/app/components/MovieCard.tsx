'use client';

import { Movie } from '../types/movie';
import { Clock, Calendar, User, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
    movie: any; // Usando 'any' temporariamente até definir o tipo Movie
    onDelete: (id: string) => void;
}

export function MovieCard({ movie, onDelete }: MovieCardProps) {
    
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(movie.id);
    };

    return (
        <div className="bg-text-primary dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            {/* Poster Placeholder */}
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {movie.poster_url ? (
                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">Sem Poster</span>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-text-primary line-clamp-1">
                    {movie.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {movie.synopsis || 'Sem sinopse disponível.'}
                </p>

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} className="mr-2" />
                        <span>{movie.duration_minutes} minutos</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} className="mr-2" />
                        <span>{new Date(movie.release_date).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {movie.age_rating && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <User size={16} className="mr-2" />
                            <span>{movie.age_rating.name}</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex space-x-2">
                    <Link
                        href={`/movies/create-edit/${movie.id}`}
                        className="flex-1 bg-blue-600 text-text-primary py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                        <Edit size={14} />
                        Editar
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 text-text-primary py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                    >
                        <Trash2 size={14} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}
