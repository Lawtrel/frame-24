import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api-client';

export const useSeatsMap = (showtimeId: string) => {
    return useQuery({
        queryKey: ['seats-map', showtimeId],
        queryFn: async () => {
            const response = await publicApi.publicControllerGetSeatsMapV1({
                id: showtimeId,
            });
            return response.data;
        },
        enabled: !!showtimeId,
        refetchInterval: false, // WebSocket will handle real-time updates
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnMount: true, // Always fetch fresh data when component mounts
        staleTime: 0, // Consider data immediately stale to ensure fresh seat status
    });
};
