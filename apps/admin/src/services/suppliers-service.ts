import { apiClient } from './api-config';

export const SuppliersService = {
  // Busca todos e filtra apenas os que são distribuidores de filmes
  getDistributors: async () => {
    const response = await apiClient.get('/v1/suppliers', {
      params: { distributors: true },
    });

    return (response.data ?? []) as unknown[];
  },
};
