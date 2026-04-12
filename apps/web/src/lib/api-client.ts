import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ApiResponse<T = unknown> = { data: T };
type ApiObject = Record<string, unknown>;
type ApiList = unknown[];

type TenantParams = {
  tenantSlug: string;
};

export const publicApi = {
  publicControllerGetCompaniesV1: (): Promise<ApiResponse<ApiList>> =>
    apiInstance.get('/v1/public/companies'),

  publicControllerGetCompanyBySlugV1: ({
    tenantSlug,
  }: TenantParams): Promise<ApiResponse<ApiObject>> =>
    apiInstance.get(`/v1/public/companies/${tenantSlug}`),

  publicControllerGetComplexesV1: ({ tenantSlug }: TenantParams): Promise<ApiResponse<ApiList>> =>
    apiInstance.get(`/v1/public/companies/${tenantSlug}/complexes`),

  publicControllerGetMoviesV1: ({ tenantSlug }: TenantParams): Promise<ApiResponse<ApiList>> =>
    apiInstance.get(`/v1/public/companies/${tenantSlug}/movies`),

  publicControllerGetShowtimesV1: ({
    tenantSlug,
    complexId,
    movieId,
    date,
  }: TenantParams & {
    complexId?: string;
    movieId?: string;
    date?: string;
  }): Promise<ApiResponse<ApiList>> =>
    apiInstance.get(`/v1/public/companies/${tenantSlug}/showtimes`, {
      params: {
        complex_id: complexId,
        movie_id: movieId,
        date,
      },
    }),

  publicControllerGetSeatsMapV1: ({ id }: { id: string }): Promise<ApiResponse<ApiObject>> =>
    apiInstance.get(`/v1/public/showtimes/${id}/seats`),

  publicControllerGetProductsV1: ({
    tenantSlug,
    complexId,
  }: TenantParams & {
    complexId?: string;
  }): Promise<ApiResponse<ApiList>> =>
    apiInstance.get(`/v1/public/companies/${tenantSlug}/products`, {
      params: {
        complex_id: complexId,
      },
    }),
};

export const customerApi = {
  customerPurchasesControllerFindAllV1: (): Promise<ApiResponse<ApiList>> =>
    apiInstance.get('/v1/customer/purchases'),
};

export const customerAuthApi = {
  post: apiInstance.post.bind(apiInstance),
};

export const authApi = {
  post: apiInstance.post.bind(apiInstance),
};

export const resolveCustomerProfile = async (tenantSlug?: string | null) => {
  const response = await apiInstance.get('/v1/customer/profile/resolve', {
    headers: tenantSlug
      ? {
          'x-tenant-slug': tenantSlug,
        }
      : undefined,
  });
  const data = response.data as { profile?: unknown } | null | undefined;

  if (data && typeof data === 'object' && 'profile' in data) {
    return data.profile ?? null;
  }

  return data ?? null;
};

// Helper para extrair dados da resposta
export const unwrapResponse = <T>(response: { data: T }): T => response.data;
