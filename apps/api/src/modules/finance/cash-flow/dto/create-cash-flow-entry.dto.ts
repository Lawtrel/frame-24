import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCashFlowEntrySchema = z.object({
  bank_account_id: z.string().min(1),
  cinema_complex_id: z.string().optional(),
  entry_type: z.enum(['receipt', 'payment']),
  category: z.string().min(1).max(50),
  amount: z.number().positive(),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  competence_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  description: z.string().min(1),
  document_number: z.string().max(50).optional(),
  source_type: z.string().max(50).optional(),
  source_id: z.string().optional(),
  counterpart_type: z.string().max(50).optional(),
  counterpart_id: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'reconciled']).default('pending'),
});

export class CreateCashFlowEntryDto extends createZodDto(
  CreateCashFlowEntrySchema,
) {}
