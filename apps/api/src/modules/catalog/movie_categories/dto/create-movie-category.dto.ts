import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CreateMovieCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da categoria é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
  minimum_age: z
    .number()
    .int('Idade mínima deve ser um número inteiro')
    .min(0, 'Idade mínima não pode ser negativa')
    .default(0),
  active: z.boolean().default(true),
});

export class CreateMovieCategoryDto extends createZodDto(
  CreateMovieCategorySchema,
) {
  @ApiProperty({ description: 'Nome da categoria', example: 'Ação' })
  name!: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Idade mínima recomendada',
    example: 0,
    default: 0,
  })
  minimum_age!: number;

  @ApiPropertyOptional({
    description: 'Categoria ativa?',
    example: true,
    default: true,
  })
  active!: boolean;
}
