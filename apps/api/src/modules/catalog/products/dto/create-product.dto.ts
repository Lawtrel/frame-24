import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CreateProductSchema = z.object({
  category_id: z.string(),
  name: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  image_url: z.string().url().max(500).optional(),
  ncm_code: z.string().max(10).optional(),
  unit: z.string().max(10).default('UN'),
  minimum_stock: z.number().int().min(0).default(0).optional(),
  supplier_id: z.string().optional(),
  barcode: z.string().max(50).optional(),
  is_available_online: z.boolean().default(false).optional(),
  active: z.boolean().default(true).optional(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {
  @ApiProperty({
    description: 'ID da categoria',
    example: '243244130367442946',
  })
  category_id!: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Coca-Cola 500ml',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Refrigerante Coca-Cola lata 500ml gelada',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL da imagem do produto',
    example: 'https://cdn.example.com/products/coca-cola-500ml.jpg',
  })
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Código NCM (fiscal)',
    example: '2202.10.00',
  })
  ncm_code?: string;

  @ApiProperty({
    description: 'Unidade de medida',
    example: 'UN',
    default: 'UN',
  })
  unit!: string;

  @ApiPropertyOptional({
    description: 'Estoque mínimo recomendado',
    example: 50,
    default: 0,
  })
  minimum_stock?: number;

  @ApiPropertyOptional({
    description: 'ID do fornecedor',
    example: '243244130367442999',
  })
  supplier_id?: string;

  @ApiPropertyOptional({
    description: 'Código de barras (EAN13)',
    example: '7894900011517',
  })
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Disponível para venda online',
    example: true,
    default: false,
  })
  is_available_online?: boolean;
  @ApiPropertyOptional({
    description: 'Produto ativo',
    example: true,
    default: true,
  })
  active?: boolean;
}
