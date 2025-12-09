import { SuppliersApi } from "@repo/api-types";
import { apiConfig } from "./api-config";

const api = new SuppliersApi(apiConfig);

export const SuppliersService = {
  // Busca todos e filtra apenas os que são distribuidores de filmes
  getDistributors: async () => {
    // O endpoint findAll geralmente aceita filtros, verifique se sua API suporta query params
    // Caso contrário, filtraremos no frontend por enquanto
    const response = await api.suppliersControllerFindAllV1();
    return response.data.filter((s: any) => s.is_film_distributor);
  }
};