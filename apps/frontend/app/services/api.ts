const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export const movieService = {
    getAll: () => fetchAPI('/api/movies'),
    getById: (id: number) => fetchAPI(`/api/movies/${id}`),
    create: (data: any) => fetchAPI('/api/movies', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchAPI(`/api/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI(`/api/movies/${id}`, {
        method: 'DELETE',
    }),
};

export const employeeService = {
    getAll: () => fetchAPI('/api/employees'),
    create: (data: any) => fetchAPI('/api/employees', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

export const customerService = {
    getAll: () => fetchAPI('/api/customers'),
    create: (data: any) => fetchAPI('/api/customers', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};