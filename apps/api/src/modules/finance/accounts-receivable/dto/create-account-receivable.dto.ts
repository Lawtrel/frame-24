import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAccountReceivableSchema = z.object({
  cinema_complex_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  sale_id: z.string().uuid().optional(),

  document_number: z.string().min(1).max(50),
  description: z.string().min(1),

  issue_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  competence_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),

  original_amount: z.number().positive(),
  interest_amount: z.number().min(0).default(0),
  penalty_amount: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
});

export class CreateAccountReceivableDto extends createZodDto(
  CreateAccountReceivableSchema,
) {}
