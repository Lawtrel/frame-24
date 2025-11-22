import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateReceivableTransactionSchema = z.object({
    account_receivable_id: z.string().uuid(),
    amount: z.number().positive(),
    transaction_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    bank_account_id: z.string().uuid(),
    payment_method: z.string().optional(),
    notes: z.string().optional(),

    // Optional: Interest and penalty applied during settlement
    interest_amount: z.number().min(0).default(0),
    penalty_amount: z.number().min(0).default(0),
    discount_amount: z.number().min(0).default(0),
});

export class CreateReceivableTransactionDto extends createZodDto(CreateReceivableTransactionSchema) { }
