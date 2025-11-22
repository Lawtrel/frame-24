'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { rolesService, permissionsService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormTextarea } from '../../../components/FormInput';
import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

// Esquema de validação com Zod
const roleSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    description: z.string().optional(),
    permissions: z.array(z.string()).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

// Componente de seleção de permissões
const PermissionsSelector: React.FC<{ permissions: any[] }> = ({ permissions }) => {
    const { register, watch } = useFormContext();
    const watchedPermissions = watch('permissions') || [];

    const togglePermission = (permissionId: string) => {
        const currentPermissions = watchedPermissions || [];
        const newPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter((id: string) => id !== permissionId)
            : [...currentPermissions, permissionId];
        
        // Não é necessário chamar setValue aqui, pois o register já está cuidando disso
        // Apenas para garantir que o array está sendo manipulado corretamente
        return newPermissions;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissões</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <input
                            type="checkbox"
                            value={permission.id}
                            {...register('permissions')}
                            checked={watchedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {permission.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default function CreateEditRolePage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [defaultValues, setDefaultValues] = useState<RoleFormData>({
        name: '',
        description: '',
        permissions: [],
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const loadedPermissions = await permissionsService.getAll(token);
                setAllPermissions(loadedPermissions);

                if (isEdit) {
                    const role = await rolesService.getById(id as string, token);
                    setDefaultValues({
                        name: role.name,
                        description: role.description || '',
                        permissions: role.permissions.map((p: any) => p.id),
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

    const onSubmit = async (data: RoleFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                permissions: data.permissions || [],
            };

            if (isEdit) {
                await rolesService.update(id as string, payload, token);
                alert('Role atualizada com sucesso!');
            } else {
                await rolesService.create(payload, token);
                alert('Role criada com sucesso!');
            }
            router.push('/roles');
        } catch (error) {
            console.error('Error saving role:', error);
            alert('Erro ao salvar role');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormLayout
            title={isEdit ? 'Editar Role' : 'Nova Role'}
            subtitle={isEdit ? `Atualizar role ${defaultValues.name}` : 'Defina o nome e as permissões para a nova role'}
            schema={roleSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/roles"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Criar Role'}
        >
            <div className="space-y-6">
                <FormInput name="name" label="Nome da Role" required />
                <FormTextarea name="description" label="Descrição" rows={3} />
                
                {!isLoading && allPermissions.length > 0 && (
                    <PermissionsSelector permissions={allPermissions} />
                )}
            </div>
        </FormLayout>
    );
}
