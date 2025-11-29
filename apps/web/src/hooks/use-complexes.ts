import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api-client';

export const useComplexes = (tenantSlug: string) => {
    return useQuery({
        queryKey: ['complexes', tenantSlug],
        queryFn: async () => {
            const response = await publicApi.publicControllerGetComplexesV1({
                tenantSlug,
            });
            return response.data;
        },
        enabled: !!tenantSlug,
    });
};
