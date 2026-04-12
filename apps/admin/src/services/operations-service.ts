import { apiClient, ApiPayload } from './api-config';

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[]';
  }
}

export const OperationsService = {
  // --- Complexos ---
  async getComplexes() {
    const response = await apiClient.get('/v1/cinema-complexes');
    return (response.data ?? []) as unknown[];
  },

  async createComplex(data: ApiPayload) {
    return await apiClient.post('/v1/cinema-complexes', data);
  },

  async getSessionLanguages() {
    const response = await apiClient.get('/v1/session-languages');
    return (response.data ?? []) as unknown[];
  },

  async getSessionStatuses() {
    const response = await apiClient.get('/v1/session-status');
    return (response.data ?? []) as unknown[];
  },

  // --- Salas ---
  async getRooms(complexId: string) {
    const response = await apiClient.get(`/v1/cinema-complexes/${complexId}/rooms`);
    return (response.data ?? []) as unknown[];
  },

  async createRoom(
    cinemaComplexId: string,
    data: { capacity: number | string; room_number: string; name: string },
  ) {
    // 1. Lógica para Gerar Layout de Assentos Automático
    // Cria uma matriz simples (ex: 50 lugares = 5 fileiras de 10)
    const capacity = Number(data.capacity);
    const cols = 10; // Fixo em 10 colunas por simplicidade
    const rowsCount = Math.ceil(capacity / cols);

    const seatLayout = [];
    let seatsGenerated = 0;

    for (let r = 0; r < rowsCount; r++) {
      const rowCode = String.fromCharCode(65 + r); // Gera A, B, C, D...
      const seatsInThisRow = [];

      for (let c = 1; c <= cols; c++) {
        if (seatsGenerated >= capacity) break;

        seatsInThisRow.push({
          column_number: c,
          accessible: r === 0, // Define a primeira fileira (A) como acessível
          seat_type_id: null, // Usa o padrão do sistema
        });
        seatsGenerated++;
      }

      if (seatsInThisRow.length > 0) {
        seatLayout.push({
          row_code: rowCode,
          seats: seatsInThisRow,
        });
      }
    }

    // 2. Preparação do Payload (Correção do Bug do Multipart)
    // A API espera um array de objetos, mas o client gerado quebra a formatação em multipart.
    // Solução: Enviamos um array contendo uma única string JSON. O backend (Zod) fará o parse.
    return await apiClient.post(`/v1/cinema-complexes/${cinemaComplexId}/rooms`, {
      room_number: data.room_number,
      name: data.name,
      capacity,
      seat_layout: safeStringify(seatLayout),
      active: true,
    });
  },
  async getProjectionTypes() {
    // Busca tipos de projeção (2D, 3D, IMAX...)
    const response = await apiClient.get('/v1/projection-types');
    return (response.data ?? []) as unknown[];
  },

  async getAudioTypes() {
    // Busca tipos de áudio (Dolby, Atmos...)
    const response = await apiClient.get('/v1/audio-types');
    return (response.data ?? []) as unknown[];
  },
};
