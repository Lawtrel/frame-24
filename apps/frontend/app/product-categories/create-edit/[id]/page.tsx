'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { productCategoriesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormTextarea } from '../../../components/FormInput';
import { z } from 'zod';

// Esquema de validação com Zod
const categorySchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateEditProductCategoryPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<CategoryFormData>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                if (isEdit) {
                    const category = await productCategoriesService.getById(id as string, token);
                    setDefaultValues({
                        name: category.name,
                        description: category.description || '',
                    });
                }
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Erro ao carregar dados');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, isEdit, token]);

    const onSubmit = async (data: CategoryFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            if (isEdit) {
                await productCategoriesService.update(id as string, data, token);
                alert('Categoria atualizada com sucesso!');
            } else {
                await productCategoriesService.create(data, token);
                alert('Categoria criada com sucesso!');
            }
            router.push('/product-categories');
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erro ao salvar categoria');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormLayout
            title={isEdit ? 'Editar Categoria de Produto' : 'Nova Categoria de Produto'}
            subtitle={isEdit ? `Atualizar categoria ${defaultValues.name}` : 'Preencha os dados para criar uma nova categoria'}
            schema={categorySchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/product-categories"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Criar Categoria'}
        >
            <div className="space-y-6">
                <FormInput name="name" label="Nome da Categoria" required />
                <FormTextarea name="description" label="Descrição (opcional)" rows={3} />
            </div>
        </FormLayout>
    );
    
}
