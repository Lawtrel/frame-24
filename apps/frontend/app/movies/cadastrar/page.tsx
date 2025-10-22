'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Film } from 'lucide-react';
import Link from 'next/link';

export default function CadastrarFilmesPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        release_date: '',
        age_rating_id: '',
        supplier_id: '',
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    duration: parseInt(formData.duration),
                    age_rating_id: parseInt(formData.age_rating_id),
                    supplier_id: parseInt(formData.supplier_id),
                    active: true,
                }),
            });

            if (response.ok) {
                router.push('/movies');
            } else {
                alert('Erro ao cadastrar filme');
            }
        } catch (error) {
            console.error('Error creating movie:', error);
            alert('Erro ao cadastrar filme');
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
                        Cadastrar Filmes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Adicione um novo filme ao catálogo do cinema
                    </p>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campos do formulário (mesmo código anterior) */}
                            <div className="md:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Título do Filme *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Digite o título do filme"
                                />
                            </div>

                        </div>

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
                                {loading ? 'Cadastrando...' : 'Cadastrar Filme'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}