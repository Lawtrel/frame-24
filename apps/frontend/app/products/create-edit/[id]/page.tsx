'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { productsService, productCategoriesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormSelect, FormTextarea } from '../../../components/FormInput';
import { ImageUpload } from '../../../components/ImageUpload';
import { z } from 'zod';

// Esquema de validação com Zod
const productSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    description: z.string().optional(),
    price: z.number().min(0.01, 'Preço deve ser maior que zero'),
    stock_quantity: z.number().int('Estoque deve ser um número inteiro').min(0, 'Estoque não pode ser negativo'),
    product_category_id: z.string().uuid('Selecione uma categoria válida'),
    is_active: z.boolean().default(true),
    // O campo 'image' será tratado separadamente pelo ImageUpload
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateEditProductPage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<ProductFormData>({} as ProductFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

    // Listas de opções para selects
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const loadedCategories = await productCategoriesService.getAll(token);
                setCategories(loadedCategories);

                if (isEdit) {
                    const product = await productsService.getById(id as string, token);
                    setDefaultValues({
                        name: product.name,
                        description: product.description || '',
                        price: product.price,
                        stock_quantity: product.stock_quantity,
                        product_category_id: product.product_category_id,
                        is_active: product.is_active,
                    });
                    setCurrentImageUrl(product.image_url);
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

    const onSubmit = async (data: ProductFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                price: Number(data.price),
                stock_quantity: Number(data.stock_quantity),
            };

            let productId: string;

            if (isEdit) {
                await productsService.update(id as string, payload, token);
                productId = id as string;
                alert('Produto atualizado com sucesso!');
            } else {
                const newProduct = await productsService.create(payload, token);
                productId = newProduct.id;
                alert('Produto criado com sucesso!');
            }

            // Upload da imagem, se houver
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                await productsService.uploadImage(productId, formData, token);
            }

            router.push('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <FormLayout
            title={isEdit ? 'Editar Produto' : 'Novo Produto'}
            subtitle={isEdit ? `Atualizar dados do produto ${defaultValues.name}` : 'Preencha os dados para cadastrar um novo produto'}
            schema={productSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/products"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <FormInput name="name" label="Nome do Produto" required />
                    <FormTextarea name="description" label="Descrição (opcional)" rows={3} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormInput name="price" label="Preço (R$)" type="number" step="0.01" required />
                        <FormInput name="stock_quantity" label="Estoque" type="number" required />
                        <FormSelect name="product_category_id" label="Categoria" options={categoryOptions} required />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            {...useFormContext().register('is_active')}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Produto Ativo
                        </span>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <ImageUpload
                        name="image"
                        label="Imagem do Produto"
                        required={!isEdit}
                        currentImage={currentImageUrl}
                        onImageChange={setImageFile}
                    />
                </div>
            </div>
        </FormLayout>
    );
}
