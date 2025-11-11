import { z } from 'zod';

const SeatLayoutItemSchema = z.object({
  seat_type_id: z.string().optional().nullable(),
  column_number: z.number().int().positive(),
  accessible: z.boolean().default(false).optional(),
});

const SeatLayoutRowSchema = z.object({
  row_code: z.string().min(1).max(5),
  seats: z.array(SeatLayoutItemSchema).min(1),
});

export const CreateRoomSchema = z.object({
  room_number: z.string().min(1).max(10),
  name: z.string().max(100).optional().nullable(),
  capacity: z.number().int().positive(),
  projection_type_id: z.string().optional().nullable(),
  audio_type_id: z.string().optional().nullable(),
  active: z.boolean().default(true).optional(),

  seat_layout: z.array(SeatLayoutRowSchema).min(1),

  room_design: z.string().max(30).optional().nullable(),
  layout_image: z.string().max(255).optional().nullable(),
});
