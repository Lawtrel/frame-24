import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateBankAccountSchema = z.object({
  bank_name: z.string().min(1).max(100),
  bank_code: z.string().max(10).optional(),
  agency: z.string().min(1).max(20),
  agency_digit: z.string().max(2).optional(),
  account_number: z.string().min(1).max(20),
  account_digit: z.string().max(2).optional(),
  account_type: z.enum(['checking', 'savings', 'investment']),
  initial_balance: z.number().default(0),
  description: z.string().optional(),
});

export class CreateBankAccountDto extends createZodDto(
  CreateBankAccountSchema,
) {}
