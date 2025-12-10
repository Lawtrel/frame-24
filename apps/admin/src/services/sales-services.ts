import { apiConfig } from "./api-config";
import { TicketsApi, ProductsApi, ProductCategoriesApi } from "@repo/api-types";

const ticketTypesApi = new TicketsApi(apiConfig);
const productsApi = new ProductsApi(apiConfig);
const categoriesApi = new ProductCategoriesApi(apiConfig);

export const SalesService = {
  // --- Tipos de Ingresso ---
  async getTicketTypes() {
    const response = await ticketTypesApi.ticketsControllerFindOneV1({ id: 'someId' }); // Replace 'someId' with the actual ID you want to use
    return response.data;
  },

  async createTicketType(data: any) {
    // Converte porcentagem para decimal se necessário (ex: 50% -> 0.5) ou mantém int dependendo do back
    return await ticketTypesApi.ticketTypesControllerCreateV1({ 
      createContractTypeDto: data // O gerador pode ter nomeado errado o DTO, verifique se é CreateTicketTypeDto
    } as any);
  },

  async deleteTicketType(id: string) {
    return await ticketTypesApi.ticketTypesControllerRemoveV1(id);
  },

  // --- Produtos (Bombonière) ---
  async getProducts() {
    const response = await productsApi.productsControllerFindAllV1({});
    return response.data;
  },

  async createProduct(data: any) {
    return await productsApi.productsControllerCreateV1({ 
      createProductDto: {
        ...data,
        active: true
      } 
    });
  },

  async getProductCategories() {
    const response = await categoriesApi.productCategoriesControllerFindAllV1();
    return response.data;
  }
};