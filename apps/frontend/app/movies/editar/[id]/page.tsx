'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Film } from 'lucide-react';
import Link from 'next/link';

export default function EditarFilmePage() {
    const [loading, setLoading] = useState(false);
    const [movie, setMovie] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        release_date: '',
        age_rating_id: '',
        supplier_id: '',
    });

    const router = useRouter();
    const params = useParams();
    const movieId = params.id;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${movieId}`);
                if (response.ok) {
                    const movieData = await response.json();
                    setMovie(movieData);
                    setFormData({
                        title: movieData.title,
                        description: movieData.description || '',
                        duration: movieData.duration.toString(),
                        release_date: movieData.release_date.split('T')[0], // Formata a data
                        age_rating_id: movieData.age_rating_id.toString(),
                        supplier_id: movieData.supplier_id.toString(),
                    });
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };

        fetchMovie();
    }, [movieId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/movies/${movieId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    duration: parseInt(formData.duration),
                    age_rating_id: parseInt(formData.age_rating_id),
                    supplier_id: parseInt(formData.supplier_id),
                }),
            });

            if (response.ok) {
                router.push('/movies');
            } else {
                alert('Erro ao atualizar filme');
            }
        } catch (error) {
            console.error('Error updating movie:', error);
            alert('Erro ao atualizar filme');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (!movie) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/movies" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">Carregando...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/movies"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Editar Filme
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Edite as informações do filme
                    </p>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href="/movies"
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}