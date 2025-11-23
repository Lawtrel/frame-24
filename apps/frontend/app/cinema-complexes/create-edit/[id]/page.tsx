'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { cinemaComplexesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormTextarea } from '../../../components/FormInput';
import { z } from 'zod';

// Esquema de validação com Zod
const complexSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    address: z.string().min(5, 'Endereço é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 letras (UF)'),
    phone: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    is_active: z.boolean().default(true),
});

type ComplexFormData = z.infer<typeof complexSchema>;

export default function CreateEditComplexPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<ComplexFormData>({
        name: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        is_active: true,
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                if (isEdit) {
                    const complex = await cinemaComplexesService.getById(id as string, token);
                    setDefaultValues({
                        name: complex.name,
                        address: complex.address,
                        city: complex.city,
                        state: complex.state,
                        phone: complex.phone || '',
                        email: complex.email || '',
                        is_active: complex.is_active,
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

    const onSubmit = async (data: ComplexFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            if (isEdit) {
                await cinemaComplexesService.update(id as string, data, token);
                alert('Complexo atualizado com sucesso!');
            } else {
                await cinemaComplexesService.create(data, token);
                alert('Complexo criado com sucesso!');
            }
            router.push('/cinema-complexes');
        } catch (error) {
            console.error('Error saving complex:', error);
            alert('Erro ao salvar complexo');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormLayout
            title={isEdit ? 'Editar Complexo' : 'Novo Complexo de Cinema'}
            subtitle={isEdit ? `Atualizar dados do complexo ${defaultValues.name}` : 'Preencha os dados para cadastrar um novo complexo'}
            schema={complexSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/cinema-complexes"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Cadastrar Complexo'}
        >
            <div className="space-y-6">
                <FormInput name="name" label="Nome do Complexo" required />
                <FormTextarea name="address" label="Endereço Completo" rows={2} required />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput name="city" label="Cidade" required />
                    <FormInput name="state" label="Estado (UF)" required maxLength={2} />
                    <FormInput name="phone" label="Telefone (opcional)" type="tel" />
                </div>
                
                <FormInput name="email" label="Email (opcional)" type="email" />

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        {...useFormContext().register('is_active')}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Complexo Ativo
                    </span>
                </div>
            </div>
        </FormLayout>
    );
}
