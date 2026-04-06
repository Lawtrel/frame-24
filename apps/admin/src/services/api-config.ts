import { Configuration } from "@repo/api-types";
import globalAxios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- Configuração do Axios Global (Interceptor) ---
// Isso garante que TODAS as chamadas feitas pelas classes geradas (MoviesApi, AuthApi, etc)
// passem por aqui e recebam o token.
globalAxios.interceptors.request.use(
  async (config) => {
    // 1. Usar cookies de sessão do Better Auth
    config.withCredentials = true;

    // 2. Corrigir URL Base se necessário (embora o Configuration já faça isso)
    if (!config.baseURL) {
      config.baseURL = BASE_URL;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- Configuração para as Classes Geradas ---
export const apiConfig = new Configuration({
  basePath: BASE_URL,
  baseOptions: {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  },
});

// HACK: Remove o cabeçalho User-Agent para evitar o aviso "Refused to set unsafe header"
if (apiConfig.baseOptions?.headers) {
  const headers = apiConfig.baseOptions.headers as Record<string, string>;
  delete headers["User-Agent"];
}
