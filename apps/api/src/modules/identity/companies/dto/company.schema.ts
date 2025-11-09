import { z } from 'zod';
import { tax_regime_type } from '@repo/db';

export const CreateCompanySchema = z.object({
  corporate_name: z.string().min(3).max(200),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  tax_regime: z.nativeEnum(tax_regime_type).optional(),
  trade_name: z.string().max(200).optional(),
  state_registration: z.string().max(20).optional(),
  municipal_registration: z.string().max(20).optional(),
  recine_opt_in: z.boolean().optional(),
  recine_join_date: z.string().datetime().optional(),
  logo_url: z.string().url().max(500).optional(),
  max_complexes: z.number().int().positive().optional(),
  max_employees: z.number().int().positive().optional(),
  max_storage_gb: z.number().int().positive().optional(),
  plan_type: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  plan_expires_at: z.string().datetime().optional(),
});
