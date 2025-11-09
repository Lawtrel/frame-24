import { z } from 'zod';

export const CreateShowtimeSchema = z.object({
  movie_id: z.string().refine((val) => val.length > 0, {
    message: 'O ID do filme é obrigatório.',
  }),

  room_id: z.string().refine((val) => val.length > 0, {
    message: 'O ID da sala é obrigatório.',
  }),

  start_time: z
    .string({
      error: 'A data e hora de início são obrigatórias.',
    })
    .datetime({
      message: 'Formato de data e hora inválido. Use o padrão ISO 8601.',
    })
    .pipe(z.coerce.date()),

  projection_type: z.string().optional().nullable(),

  audio_type: z.string().optional().nullable(),

  session_language: z.string().refine((val) => val.length > 0, {
    message: 'O idioma da sessão é obrigatório.',
  }),

  base_ticket_price: z.number().refine((val) => val > 0, {
    message: 'O preço base deve ser um valor positivo.',
  }),

  status: z.string().optional(),
});
