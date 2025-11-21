import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const UpdateMovieCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').optional(),
  description: z.string().optional(),
  minimum_age: z.number().int('Idade mínima deve ser um número inteiro').min(0, 'Idade mínima não pode ser negativa').optional(),
  active: z.boolean().optional(),
});

export class UpdateMovieCategoryDto extends createZodDto(
  UpdateMovieCategorySchema,
) {
  @ApiPropertyOptional({ description: 'Nome da categoria' })
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria' })
  description?: string;

  @ApiPropertyOptional({ description: 'Idade mínima recomendada' })
  minimum_age?: number;

  @ApiPropertyOptional({ description: 'Categoria ativa?' })
  active?: boolean;
}
