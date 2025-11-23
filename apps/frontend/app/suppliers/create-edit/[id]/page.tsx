'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { suppliersService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormTextarea } from '../../../components/FormInput';
import { z } from 'zod';
import { useFormContext } from 'react-hook-form';

// Esquema de validação com Zod
const supplierSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    trade_name: z.string().optional(),
    document: z.string().min(14, 'CNPJ deve ter 14 dígitos').optional().or(z.literal('')),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'Estado deve ter 2 letras (UF)').optional().or(z.literal('')),
    contact_person: z.string().optional(),
    contact_phone: z.string().optional(),
    is_active: z.boolean().default(true),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function CreateEditSupplierPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<SupplierFormData>({
        name: '',
        trade_name: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        contact_person: '',
        contact_phone: '',
        is_active: true,
    });

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                if (isEdit) {
                    const supplier = await suppliersService.getById(id as string, token);
                    setDefaultValues({
                        name: supplier.name,
                        trade_name: supplier.trade_name || '',
                        document: supplier.document || '',
                        email: supplier.email || '',
                        phone: supplier.phone || '',
                        address: supplier.address || '',
                        city: supplier.city || '',
                        state: supplier.state || '',
                        contact_person: supplier.contact_person || '',
                        contact_phone: supplier.contact_phone || '',
                        is_active: supplier.is_active,
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

    const onSubmit = async (data: SupplierFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            if (isEdit) {
                await suppliersService.update(id as string, data, token);
                alert('Fornecedor atualizado com sucesso!');
            } else {
                await suppliersService.create(data, token);
                alert('Fornecedor criado com sucesso!');
            }
            router.push('/suppliers');
        } catch (error) {
            console.error('Error saving supplier:', error);
            alert('Erro ao salvar fornecedor');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormLayout
            title={isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            subtitle={isEdit ? `Atualizar dados do fornecedor ${defaultValues.name}` : 'Preencha os dados para cadastrar um novo fornecedor'}
            schema={supplierSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/suppliers"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
        >
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Principais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput name="name" label="Razão Social" required />
                    <FormInput name="trade_name" label="Nome Fantasia (opcional)" />
                    <FormInput name="document" label="CNPJ (opcional)" />
                    <FormInput name="email" label="Email (opcional)" type="email" />
                    <FormInput name="phone" label="Telefone (opcional)" type="tel" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Endereço
                </h3>
                <FormTextarea name="address" label="Endereço Completo (opcional)" rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput name="city" label="Cidade (opcional)" />
                    <FormInput name="state" label="Estado (UF) (opcional)" maxLength={2} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput name="contact_person" label="Pessoa de Contato (opcional)" />
                    <FormInput name="contact_phone" label="Telefone de Contato (opcional)" type="tel" />
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <input
                        type="checkbox"
                        {...useFormContext().register('is_active')}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fornecedor Ativo
                    </span>
                </div>
            </div>
        </FormLayout>
    );
}
