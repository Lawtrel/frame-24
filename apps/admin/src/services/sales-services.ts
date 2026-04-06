import { apiConfig } from "./api-config";
import axios from "axios";
import { ProductsApi, ProductCategoriesApi } from "@repo/api-types";

const productsApi = new ProductsApi(apiConfig);
const categoriesApi = new ProductCategoriesApi(apiConfig);

type GenericObject = Record<string, unknown>;

export const SalesService = {
  // --- Tipos de Ingresso ---
  async getTicketTypes() {
    const response = await axios.get(`${apiConfig.basePath}/v1/ticket-types`, {
      withCredentials: true,
    });
    return (response.data ?? []) as unknown[];
  },

  async getTicketTypeById(id: string) {
    const response = await axios.get(
      `${apiConfig.basePath}/v1/ticket-types/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async createTicketType(data: GenericObject) {
    return await axios.post(
      `${apiConfig.basePath}/v1/ticket-types`,
      data,
      {
        withCredentials: true,
      },
    );
  },

  async updateTicketType(id: string, data: GenericObject) {
    return await axios.put(
      `${apiConfig.basePath}/v1/ticket-types/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
  },

  async deleteTicketType(id: string) {
    return await axios.delete(`${apiConfig.basePath}/v1/ticket-types/${id}`, {
      withCredentials: true,
    });
  },

  // --- Produtos (Bombonière) ---
  async getProducts() {
    const response = await productsApi.productsControllerFindAllV1({
      active: "true",
    });
    return response.data;
  },

  async createProduct(data: GenericObject) {
    return await axios.post(
      `${apiConfig.basePath}/v1/products`,
      {
        ...data,
        active: true,
      },
      {
        withCredentials: true,
      },
    );
  },

  async getProductCategories() {
    const response = await categoriesApi.productCategoriesControllerFindAllV1();
    return response.data;
  },
};
