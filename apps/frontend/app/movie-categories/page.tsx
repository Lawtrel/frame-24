'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { movieCategoriesService } from '../services/api';
import { PageHeader } from '@repo/ui/page-header';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';

export default function MovieCategoriesPage() {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        if (!token) return;
        
        try {
            const data = await movieCategoriesService.getAll(token);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            if (editingCategory) {
                await movieCategoriesService.update(editingCategory.id, formData, token);
            } else {
                await movieCategoriesService.create(formData, token);
            }
            setShowModal(false);
            setFormData({ name: '', description: '' });
            setEditingCategory(null);
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erro ao salvar categoria');
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await movieCategoriesService.delete(id, token);
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Erro ao excluir categoria');
        }
    };

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <React.Fragment>
            <PageHeader
                title="Categorias de Filmes"
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Categorias', href: '/movie-categories' }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Categorias de Filmes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gerencie as categorias para classificar seus filmes
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', description: '' });
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Nova Categoria
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                        <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {category.description || 'Sem descrição'}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Edit size={16} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-12">
                            <Tag className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                Nenhuma categoria cadastrada
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Comece criando uma nova categoria.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCategory(null);
                                        setFormData({ name: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
