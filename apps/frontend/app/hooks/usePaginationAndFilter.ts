import { useState, useEffect, useCallback } from 'react';

interface PaginationResult<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    refetch: () => void;
}

interface Service<T> {
    getAll: (token: string, params?: any) => Promise<{ data: T[], total: number }>;
}

interface FilterParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: any;
}

export function usePaginationAndFilter<T>(
    service: Service<T>,
    token: string | null,
    initialPageSize: number = 10,
    initialFilters: Record<string, any> = {}
): PaginationResult<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(initialFilters);
    const [refreshToggle, setRefreshToggle] = useState(false);

    const fetchData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const params: FilterParams = {
            page: currentPage,
            limit: pageSize,
            search: searchTerm || undefined,
            ...filters,
        };

        try {
            // Assumindo que o backend retorna { data: T[], total: number }
            const response = await service.getAll(token, params);
            setData(response.data);
            setTotalItems(response.total);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Falha ao carregar dados.');
            setData([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [token, service, currentPage, pageSize, searchTerm, filters, refreshToggle]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const refetch = () => {
        setRefreshToggle(prev => !prev);
    };

    return {
        data,
        loading,
        error,
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        searchTerm,
        setSearchTerm,
        setPage,
        setPageSize,
        refetch,
    };
}
