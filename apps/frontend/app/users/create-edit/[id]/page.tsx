'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { usersService, rolesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormSelect } from '../../../components/FormInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// Esquema de validação com Zod
const userSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
    role_id: z.string().uuid('Selecione uma role válida'),
    is_active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

export default function CreateEditUserPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [defaultValues, setDefaultValues] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        role_id: '',
        is_active: true,
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const loadedRoles = await rolesService.getAll(token);
                setRoles(loadedRoles);

                if (isEdit) {
                    const user = await usersService.getById(id as string, token);
                    setDefaultValues({
                        name: user.name,
                        email: user.email,
                        password: '', // Senha não é preenchida em edição
                        role_id: user.role_id,
                        is_active: user.is_active,
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

    const onSubmit = async (data: UserFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                password: data.password || undefined, // Não enviar senha vazia
            };

            if (isEdit) {
                await usersService.update(id as string, payload, token);
                alert('Usuário atualizado com sucesso!');
            } else {
                await usersService.create(payload, token);
                alert('Usuário criado com sucesso!');
            }
            router.push('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Erro ao salvar usuário');
        } finally {
            setIsSubmitting(false);
        }
    };

    const roleOptions = roles.map(role => ({ value: role.id, label: role.name }));

    return (
        <FormLayout
            title={isEdit ? 'Editar Usuário' : 'Novo Usuário'}
            subtitle={isEdit ? `Atualizar dados do usuário ${defaultValues.name}` : 'Preencha os dados para criar um novo usuário'}
            schema={userSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/users"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Criar Usuário'}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="name" label="Nome Completo" required />
                <FormInput name="email" label="Email" type="email" required />
                <FormInput name="password" label={isEdit ? 'Nova Senha (opcional)' : 'Senha'} type="password" required={!isEdit} />
                <FormSelect name="role_id" label="Role" options={roleOptions} required />
                
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            {...useForm().register('is_active')}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Usuário Ativo
                        </span>
                    </label>
                </div>
            </div>
        </FormLayout>
    );
}
