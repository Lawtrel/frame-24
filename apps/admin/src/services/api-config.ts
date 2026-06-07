import axios from 'axios';

const BASE_URL = typeof window !== "undefined"
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
const baseHeaders = {
  'Content-Type': 'application/json',
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: baseHeaders,
});

function getAdminTenantSlug(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3 && parts[0] !== 'admin' && parts[0] !== 'app' && parts[0] !== 'www' && parts[0] !== 'api') {
    return parts[0];
  }
  return process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || undefined;
}

apiClient.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;

    if (!config.baseURL) {
      config.baseURL = BASE_URL;
    }

    const tenantSlug = getAdminTenantSlug();
    if (tenantSlug && config.headers && !('x-tenant-slug' in (config.headers as Record<string, unknown>))) {
      (config.headers as Record<string, string>)['x-tenant-slug'] = tenantSlug;
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
