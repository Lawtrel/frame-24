import { z } from 'zod';

const SeatLayoutItemSchema = z.object({
  seat_type_id: z.string().optional().nullable(),
  column_number: z
    .number()
    .int('Número da coluna deve ser inteiro')
    .positive('Número da coluna deve ser positivo'),
  accessible: z.boolean().default(false).optional(),
});

const SeatLayoutRowSchema = z.object({
  row_code: z
    .string()
    .min(1, 'Código da fileira é obrigatório')
    .max(5, 'Código da fileira deve ter no máximo 5 caracteres'),
  seats: z
    .array(SeatLayoutItemSchema)
    .min(1, 'A fileira deve ter pelo menos um assento'),
});

export const CreateRoomSchema = z.object({
  room_number: z
    .string()
    .min(1, 'Número da sala é obrigatório')
    .max(10, 'Número da sala deve ter no máximo 10 caracteres'),
  name: z
    .string()
    .max(100, 'Nome da sala deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),
  capacity: z
    .number()
    .int('Capacidade deve ser um número inteiro')
    .positive('Capacidade deve ser positiva'),
  projection_type_id: z.string().optional().nullable(),
  audio_type_id: z.string().optional().nullable(),
  active: z.boolean().default(true).optional(),

  seat_layout: z
    .array(SeatLayoutRowSchema)
    .min(1, 'Layout de assentos é obrigatório'),

  room_design: z
    .string()
    .max(30, 'Design da sala muito longo')
    .optional()
    .nullable(),
  layout_image: z
    .string()
    .max(255, 'URL da imagem muito longa')
    .optional()
    .nullable(),
});
