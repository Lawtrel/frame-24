import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateCustomerProfileSchema = z.object({
  full_name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional().nullable(),
});

export class UpdateCustomerProfileDto extends createZodDto(
  UpdateCustomerProfileSchema,
) {
  @ApiPropertyOptional({
    description: 'Nome completo do cliente',
    example: 'João da Silva',
  })
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento (YYYY-MM-DD)',
    example: '1990-01-01',
  })
  birth_date?: string | null;
}
