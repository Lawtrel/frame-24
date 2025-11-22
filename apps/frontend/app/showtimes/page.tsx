'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showtimesService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Calendar, Plus, Edit, Trash2, Clock, Film } from 'lucide-react';
import Link from 'next/link';

export default function ShowtimesPage() {
    const { token } = useAuth();
    const [showtimes, setShowtimes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadShowtimes();
    }, []);

    const loadShowtimes = async () => {
        if (!token) return;
        
        try {
            const data = await showtimesService.getAll(token);
            setShowtimes(data);
        } catch (error) {
            console.error('Error loading showtimes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir esta sessão?')) return;

        try {
            await showtimesService.delete(id, token);
            loadShowtimes();
        } catch (error) {
            console.error('Error deleting showtime:', error);
            alert('Erro ao excluir sessão');
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Sessões"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Sessões', href: '/showtimes' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Programação de Sessões
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie a programação de filmes e horários
                        </p>
                    </div>

                    <Link
                        href="/showtimes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Nova Sessão
                    </Link>
                </div>

                {/* Showtimes List */}
                <div className="space-y-4">
                    {showtimes.map((showtime) => (
                        <div key={showtime.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg h-fit">
                                        <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {showtime.movie?.title || 'Filme não informado'}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                showtime.status === 'scheduled' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : showtime.status === 'in_progress'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}>
                                                {showtime.status === 'scheduled' ? 'Agendada' : 
                                                 showtime.status === 'in_progress' ? 'Em andamento' : 
                                                 'Finalizada'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatDateTime(showtime.start_time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Film className="h-4 w-4" />
                                                <span>Sala {showtime.room?.number || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Idioma:</span> {showtime.language?.name || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Áudio:</span> {showtime.audio_type?.name || 'N/A'}
                                            </div>
                                        </div>

                                        {showtime.price && (
                                            <div className="mt-3">
                                                <span className="text-lg font-bold text-blue-600">
                                                    R$ {showtime.price.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Link
                                        href={`/showtimes/edit/${showtime.id}`}
                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(showtime.id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showtimes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhuma sessão agendada
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece criando uma nova sessão.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/showtimes/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Sessão
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}
