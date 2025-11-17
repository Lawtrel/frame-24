'use server';

import { api } from "@/lib/api-client";

type FormState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

const getString = (value: FormDataEntryValue | null): string => {
    return value?.toString() || '';
};

const cleanPhone = (value: FormDataEntryValue | null): string => {
    return value?.toString().replace(/\D/g, '') || '';
};

export async function registerCompany(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    try {
        await api.auth.authControllerSignupV1({
            signupDto: {
                corporate_name: getString(formData.get('corporate_name')),
                trade_name: getString(formData.get('trade_name')) || undefined,
                cnpj: cleanPhone(formData.get('cnpj')),

                company_zip_code: cleanPhone(formData.get('company_zip_code')),
                company_street_address: getString(formData.get('company_street_address')),
                company_address_number: getString(formData.get('company_address_number')),
                company_address_complement: getString(formData.get('company_address_complement')) || undefined,
                company_neighborhood: getString(formData.get('company_neighborhood')),
                company_city: getString(formData.get('company_city')),
                company_state: getString(formData.get('company_state')),
                company_phone: cleanPhone(formData.get('company_phone')) || undefined,
                company_email: getString(formData.get('company_email')) || undefined,

                full_name: getString(formData.get('full_name')),
                email: getString(formData.get('email')),
                password: getString(formData.get('password')),
                mobile: cleanPhone(formData.get('mobile')),
            }
        });

        return {
            success: true,
            message: 'Cadastro realizado! Verifique seu email para confirmar sua conta.',
        };

    } catch (error: any) {
        const apiData = error.response?.data;

        return {
            success: false,
            message: apiData?.message?.message || apiData?.message || 'Erro ao cadastrar empresa.',
            errors: apiData?.errors,
        };
    }
}
