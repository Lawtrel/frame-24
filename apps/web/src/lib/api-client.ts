import {
  PublicApi,
  CustomerAuthApi,
  CustomerApi,
  AuthApi,
  Configuration,
} from "@repo/api-types";
import axios from "axios";

// Criar instância do axios SEM /v1 para os clientes OpenAPI
// (eles já adicionam /v1 automaticamente)
const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configuração da API
const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// Instâncias dos clientes da API usando a instância do axios configurada
export const publicApi = new PublicApi(apiConfig, undefined, apiInstance);
export const customerAuthApi = new CustomerAuthApi(
  apiConfig,
  undefined,
  apiInstance,
);
export const customerApi = new CustomerApi(apiConfig, undefined, apiInstance);
export const authApi = new AuthApi(apiConfig, undefined, apiInstance);

export const resolveCustomerProfile = async (tenantSlug?: string | null) => {
  const response = await apiInstance.get("/v1/customer/profile/resolve", {
    headers: tenantSlug
      ? {
          "x-tenant-slug": tenantSlug,
        }
      : undefined,
  });
  const data = response.data as
    | { profile?: unknown }
    | null
    | undefined;

  if (data && typeof data === "object" && "profile" in data) {
    return data.profile ?? null;
  }

  return data ?? null;
};

// Helper para extrair dados da resposta
export const unwrapResponse = <T>(response: { data: T }): T => response.data;
