const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
    token?: string;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
    const { token, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API error' }));
        throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
}

// ==================== AUTH SERVICE ====================
export const authService = {
    register: (data: any) => fetchAPI('/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    login: (data: any) => fetchAPI('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    verifyEmail: (data: any) => fetchAPI('/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    forgotPassword: (data: any) => fetchAPI('/v1/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    resetPassword: (data: any) => fetchAPI('/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    selectCompany: (data: any, token: string) => fetchAPI('/v1/auth/select-company', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
};

// ==================== USERS SERVICE ====================
export const usersService = {
    getAll: (token: string) => fetchAPI('/v1/users', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/users/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/users', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/users/${id}`, {
        method: 'DELETE',
        token,
    }),
    changePassword: (id: string, data: any, token: string) => fetchAPI(`/v1/users/${id}/change-password`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
};

// ==================== ROLES SERVICE ====================
export const rolesService = {
    getAll: (token: string) => fetchAPI('/v1/roles', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/roles/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/roles', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/roles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/roles/${id}`, {
        method: 'DELETE',
        token,
    }),
};

export const permissionsService = {
    getAll: (token: string) => fetchAPI('/v1/permissions', { token }),
};

// ==================== MOVIES SERVICE ====================
export const moviesService = {
    getAll: (token: string) => fetchAPI('/v1/movies', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/movies/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/movies', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/movies/${id}`, {
        method: 'DELETE',
        token,
    }),
    getCastTypes: (token: string) => fetchAPI('/v1/movies/cast-types', { token }),
    getMediaTypes: (token: string) => fetchAPI('/v1/movies/media-types', { token }),
    getAgeRatings: (token: string) => fetchAPI('/v1/movies/age-ratings', { token }),
};

// ==================== MOVIE CATEGORIES SERVICE ====================
export const movieCategoriesService = {
    getAll: (token: string) => fetchAPI('/v1/movie-categories', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/movie-categories/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/movie-categories', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/movie-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/movie-categories/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== PRODUCTS SERVICE ====================
export const productsService = {
    getAll: (token: string) => fetchAPI('/v1/products', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/products/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/products', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/products/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== PRODUCT CATEGORIES SERVICE ====================
export const productCategoriesService = {
    getAll: (token: string) => fetchAPI('/v1/product-categories', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/product-categories/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/product-categories', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/product-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/product-categories/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== SUPPLIERS SERVICE ====================
export const suppliersService = {
    getAll: (token: string) => fetchAPI('/v1/suppliers', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/suppliers/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/suppliers', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/suppliers/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== CINEMA COMPLEXES SERVICE ====================
export const cinemaComplexesService = {
    getAll: (token: string) => fetchAPI('/v1/cinema-complexes', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/cinema-complexes/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/cinema-complexes', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/cinema-complexes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/cinema-complexes/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== ROOMS SERVICE ====================
export const roomsService = {
    getAll: (token: string) => fetchAPI('/v1/rooms', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/rooms/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/rooms', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/rooms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/rooms/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== SEATS SERVICE ====================
export const seatsService = {
    getAll: (token: string) => fetchAPI('/v1/seats', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/seats/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/seats', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/seats/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/seats/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== SHOWTIMES SERVICE ====================
export const showtimesService = {
    getAll: (token: string) => fetchAPI('/v1/showtimes', { token }),
    getById: (id: string, token: string) => fetchAPI(`/v1/showtimes/${id}`, { token }),
    create: (data: any, token: string) => fetchAPI('/v1/showtimes', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
    }),
    update: (id: string, data: any, token: string) => fetchAPI(`/v1/showtimes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
    }),
    delete: (id: string, token: string) => fetchAPI(`/v1/showtimes/${id}`, {
        method: 'DELETE',
        token,
    }),
};

// ==================== AUXILIARY TYPES SERVICES ====================
export const audioTypesService = {
    getAll: (token: string) => fetchAPI('/v1/audio-types', { token }),
};

export const projectionTypesService = {
    getAll: (token: string) => fetchAPI('/v1/projection-types', { token }),
};

export const sessionLanguagesService = {
    getAll: (token: string) => fetchAPI('/v1/session-languages', { token }),
};

export const sessionStatusService = {
    getAll: (token: string) => fetchAPI('/v1/session-status', { token }),
};

export const seatTypesService = {
    getAll: (token: string) => fetchAPI('/v1/seat-types', { token }),
};

export const seatStatusService = {
    getAll: (token: string) => fetchAPI('/v1/seat-status', { token }),
};
