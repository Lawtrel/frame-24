import { PublicApi, CustomerAuthApi, Configuration } from '@repo/api-types';

// Configuração da API
const apiConfig = new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Instância do cliente PublicApi
// Instância do cliente PublicApi
export const publicApi = new PublicApi(apiConfig);
export const customerAuthApi = new CustomerAuthApi(apiConfig);

// Helper para extrair dados da resposta
export const unwrapResponse = <T>(response: { data: T }): T => response.data;
