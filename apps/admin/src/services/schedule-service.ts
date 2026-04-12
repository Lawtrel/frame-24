import { apiClient, ApiPayload } from './api-config';

interface ComplexItem {
  id: string;
  [key: string]: unknown;
}

interface RoomItem {
  [key: string]: unknown;
}

type CreateShowtimePayload = ApiPayload & {
  start_time: string | Date;
};

export const ScheduleService = {
  // Listar sessões
  async getShowtimes() {
    // Passamos uma data antiga para satisfazer o filtro obrigatório
    const response = await apiClient.get('/v1/showtimes', {
      params: {
        start_time: new Date(0).toISOString(),
      },
    });
    return (response.data ?? []) as unknown[];
  },

  // Criar sessão
  async createShowtime(data: CreateShowtimePayload) {
    const payload: CreateShowtimePayload = {
      ...data,
      start_time: new Date(data.start_time).toISOString(),
    };
    return await apiClient.post('/v1/showtimes', payload);
  },

  // Deletar sessão
  async deleteShowtime(id: string) {
    return await apiClient.delete(`/v1/showtimes/${id}`);
  },

  // Buscar todas as salas (de todos os complexos)
  async getRooms() {
    try {
      // 1. Busca os complexos primeiro
      const complexesResponse = await apiClient.get('/v1/cinema-complexes');
      const complexes = (complexesResponse.data ?? []) as ComplexItem[];

      if (!complexes || complexes.length === 0) {
        return [];
      }

      // 2. Busca as salas de CADA complexo em paralelo
      const roomsPromises = complexes.map(async (complex) => {
        try {
          const roomsResponse = await apiClient.get(`/v1/cinema-complexes/${complex.id}/rooms`);

          // Injetamos o objeto do complexo dentro da sala para o UI exibir o nome corretamente
          return ((roomsResponse.data ?? []) as RoomItem[]).map((room) => ({
            ...room,
            cinema_complexes: complex, // Garante que {room.cinema_complexes.name} funcione no select
          }));
        } catch (error: unknown) {
          console.warn(`Não foi possível buscar salas do complexo ${complex.id}`, error);
          return [];
        }
      });

      // 3. Junta tudo em um array só
      const results = await Promise.all(roomsPromises);
      return results.flat();
    } catch (error: unknown) {
      console.error('Erro ao carregar salas:', error);
      throw error;
    }
  },
};
