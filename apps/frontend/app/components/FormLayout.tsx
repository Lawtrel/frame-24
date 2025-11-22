'use client';

import React from 'react';
import { FormProvider, useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { PageHeader } from '@repo/ui/page-header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FormLayoutProps<T extends FieldValues> {
    title: string;
    subtitle: string;
    schema: ZodSchema<T>;
    onSubmit: (data: T) => void;
    defaultValues?: T;
    children: React.ReactNode;
    isLoading?: boolean;
    isSubmitting?: boolean;
    backHref: string;
    submitButtonText?: string;
}

export const FormLayout = <T extends FieldValues>({
    title,
    subtitle,
    schema,
    onSubmit,
    defaultValues,
    children,
    isLoading = false,
    isSubmitting = false,
    backHref,
    submitButtonText = 'Salvar',
}: FormLayoutProps<T>) => {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
    });

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <PageHeader
                title={title}
                breadcrumbItems={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: title, href: backHref }
                ]}
            />

            <div className="p-6 md:p-8 pt-28 min-h-[calc(100vh-100px)]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Link href={backHref} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-4">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">Carregando dados...</div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                {children}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? 'Salvando...' : submitButtonText}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </FormProvider>
    );
};
