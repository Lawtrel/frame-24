import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateProductSchema = z.object({
  category_id: z.string().optional(),
  product_code: z.string().max(50).optional(),
  name: z.string().min(3).max(200).optional(),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().max(500).optional().nullable(),
  ncm_code: z.string().max(10).optional(),
  unit: z.string().max(10).optional(),
  minimum_stock: z.number().int().min(0).optional(),
  supplier_id: z.string().optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  is_available_online: z.boolean().optional(),
  active: z.boolean().optional(),
});

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {
  @ApiPropertyOptional({
    description: 'ID da categoria',
  })
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Código do produto (pode editar)',
    example: 'BEB-0001',
  })
  product_code?: string; // ✅ Adicionar

  @ApiPropertyOptional({
    description: 'Nome do produto',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL da imagem',
  })
  image_url?: string | null;

  @ApiPropertyOptional({
    description: 'Código NCM',
  })
  ncm_code?: string;

  @ApiPropertyOptional({
    description: 'Unidade de medida',
  })
  unit?: string;

  @ApiPropertyOptional({
    description: 'Estoque mínimo',
  })
  minimum_stock?: number;

  @ApiPropertyOptional({
    description: 'ID do fornecedor',
  })
  supplier_id?: string | null;

  @ApiPropertyOptional({
    description: 'Código de barras',
  })
  barcode?: string | null;

  @ApiPropertyOptional({
    description: 'Disponível online',
  })
  is_available_online?: boolean;

  @ApiPropertyOptional({
    description: 'Ativo',
  })
  active?: boolean;
}
