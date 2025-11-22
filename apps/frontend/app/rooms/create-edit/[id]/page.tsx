'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { roomsService, cinemaComplexesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormSelect } from '../../../components/FormInput';
import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

// Esquema de validação com Zod
const roomSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    number: z.string().min(1, 'Número da sala é obrigatório'),
    capacity: z.number().int('Capacidade deve ser um número inteiro').min(1, 'Capacidade deve ser maior que 0'),
    cinema_complex_id: z.string().uuid('Selecione um complexo válido'),
    is_active: z.boolean().default(true),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function CreateEditRoomPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [complexes, setComplexes] = useState<any[]>([]);
    const [defaultValues, setDefaultValues] = useState<RoomFormData>({
        name: '',
        number: '',
        capacity: 0,
        cinema_complex_id: '',
        is_active: true,
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const loadedComplexes = await cinemaComplexesService.getAll(token);
                setComplexes(loadedComplexes);

                if (isEdit) {
                    const room = await roomsService.getById(id as string, token);
                    setDefaultValues({
                        name: room.name,
                        number: room.number,
                        capacity: room.capacity,
                        cinema_complex_id: room.cinema_complex_id,
                        is_active: room.is_active,
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

    const onSubmit = async (data: RoomFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                capacity: Number(data.capacity),
            };

            if (isEdit) {
                await roomsService.update(id as string, payload, token);
                alert('Sala atualizada com sucesso!');
            } else {
                await roomsService.create(payload, token);
                alert('Sala criada com sucesso!');
            }
            router.push('/rooms');
        } catch (error) {
            console.error('Error saving room:', error);
            alert('Erro ao salvar sala');
        } finally {
            setIsSubmitting(false);
        }
    };

    const complexOptions = complexes.map(c => ({ value: c.id, label: c.name }));

    return (
        <FormLayout
            title={isEdit ? 'Editar Sala' : 'Nova Sala de Cinema'}
            subtitle={isEdit ? `Atualizar dados da sala ${defaultValues.number}` : 'Preencha os dados para cadastrar uma nova sala'}
            schema={roomSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/rooms"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Cadastrar Sala'}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput name="number" label="Número da Sala" required />
                    <FormInput name="name" label="Nome/Descrição (ex: Sala VIP)" required />
                    <FormInput name="capacity" label="Capacidade (lugares)" type="number" required />
                </div>
                
                <FormSelect name="cinema_complex_id" label="Complexo de Cinema" options={complexOptions} required />

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        {...useFormContext().register('is_active')}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sala Ativa
                    </span>
                </div>
            </div>
        </FormLayout>
    );
}
