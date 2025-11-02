import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateCompanySchema = z.object({
  corporate_name: z
    .string()
    .min(3, 'Nome corporativo deve ter no mínimo 3 caracteres')
    .max(200),
  trade_name: z.string().max(200).optional(),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),

  state_registration: z.string().max(20).optional(),
  municipal_registration: z.string().max(20).optional(),

  tax_regime: z.string().optional(),
  pis_cofins_regime: z.string().optional(),

  recine_opt_in: z.boolean().optional(),
  recine_join_date: z.coerce.date().optional(),

  logo_url: z.string().url().max(500).optional(),

  max_complexes: z.number().int().positive().optional(),
  max_employees: z.number().int().positive().optional(),
  max_storage_gb: z.number().int().positive().optional(),
  plan_type: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']).optional(),
  plan_expires_at: z.coerce.date().optional(),
});

export class CreateCompanyDto extends createZodDto(CreateCompanySchema) {
  corporate_name!: string;
  cnpj!: string;
  trade_name?: string;

  state_registration?: string;
  municipal_registration?: string;

  tax_regime?: string;
  pis_cofins_regime?: string;

  recine_opt_in?: boolean;
  recine_join_date?: Date;

  logo_url?: string;

  max_complexes?: number;
  max_employees?: number;
  max_storage_gb?: number;
  plan_type?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  plan_expires_at?: Date;
}
