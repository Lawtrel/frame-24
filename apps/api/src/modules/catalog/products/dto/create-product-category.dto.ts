import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CreateProductCategorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

export class CreateProductCategoryDto extends createZodDto(
  CreateProductCategorySchema,
) {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Bebidas',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Refrigerantes, sucos e águas',
  })
  description?: string;
}
