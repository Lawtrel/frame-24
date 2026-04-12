import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const baseHeaders = {
  'Content-Type': 'application/json',
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: baseHeaders,
});

apiClient.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;

    if (!config.baseURL) {
      config.baseURL = BASE_URL;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const apiConfig = {
  basePath: BASE_URL,
  baseOptions: {
    withCredentials: true,
    headers: baseHeaders,
  },
};

export type ApiPayload = Record<string, unknown>;
