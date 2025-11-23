import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAccountPayableSchema = z.object({
  cinema_complex_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  source_type: z.enum(['distributor_settlement', 'tax', 'manual']).optional(),
  source_id: z.string().optional(),

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

export class CreateAccountPayableDto extends createZodDto(
  CreateAccountPayableSchema,
) {}
