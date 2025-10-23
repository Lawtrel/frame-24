import { movieService } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import {Film, Plus} from 'lucide-react';
import Link from 'next/link';

async function ListarFilmesPage() {
    let movies = [];

    try {
        movies = await movieService.getAll();
    } catch (error) {
        console.error('Error fetching movies:', error);
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Listar Filmes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Visualize e gerencie todos os filmes do catálogo
                    </p>
                </div>

                <Link
                    href="/movies/cadastrar"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Cadastrar Filme
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie: any) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {movies.length === 0 && (
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
                                href="/movies/cadastrar"
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
    );
}

export default ListarFilmesPage;