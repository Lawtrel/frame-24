import { apiConfig } from "./api-config";
import axios from "axios";
import { ProductsApi, ProductCategoriesApi } from "@repo/api-types";

const productsApi = new ProductsApi(apiConfig);
const categoriesApi = new ProductCategoriesApi(apiConfig);

function getAuthHeaders() {
  return {
    Authorization:
      typeof window !== "undefined"
        ? `Bearer ${localStorage.getItem("admin_token") || ""}`
        : "",
  };
}

export const SalesService = {
  // --- Tipos de Ingresso ---
  async getTicketTypes() {
    const response = await axios.get(`${apiConfig.basePath}/v1/ticket-types`, {
      headers: getAuthHeaders(),
    });
    return (response.data ?? []) as any[];
  },

  async getTicketTypeById(id: string) {
    const response = await axios.get(
      `${apiConfig.basePath}/v1/ticket-types/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  },

  async createTicketType(data: any) {
    return await axios.post(
      `${apiConfig.basePath}/v1/ticket-types`,
      data,
      {
        headers: getAuthHeaders(),
      },
    );
  },

  async updateTicketType(id: string, data: any) {
    return await axios.put(
      `${apiConfig.basePath}/v1/ticket-types/${id}`,
      data,
      {
        headers: getAuthHeaders(),
      },
    );
  },

  async deleteTicketType(id: string) {
    return await axios.delete(`${apiConfig.basePath}/v1/ticket-types/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  // --- Produtos (Bombonière) ---
  async getProducts() {
    const response = await productsApi.productsControllerFindAllV1({
      active: "true",
    });
    return response.data;
  },

  async createProduct(data: any) {
    return await axios.post(`${apiConfig.basePath}/v1/products`, {
      ...data,
      active: true,
    }, {
      headers: getAuthHeaders(),
    });
  },

  async getProductCategories() {
    const response = await categoriesApi.productCategoriesControllerFindAllV1();
    return response.data;
  },
};
