import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const UpdateSupplierSchema = z.object({
  supplier_type_id: z.string().optional(),

  corporate_name: z.string().min(3).optional(),
  trade_name: z.string().optional(),
  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{14}$/.test(val), 'CNPJ inválido')
    .optional(),
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{10,11}$/.test(val), 'Celular inválido')
    .optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),

  contact_name: z.string().optional(),
  contact_phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{10,11}$/.test(val), 'Celular inválido')
    .optional(),
  delivery_days: z.number().int().min(0).optional(),

  is_film_distributor: z.boolean().optional(),
  active: z.boolean().optional(),
});

export class UpdateSupplierDto extends createZodDto(UpdateSupplierSchema) {
  @ApiProperty({
    description: 'Razão social (opcional para atualização parcial)',
    example: 'Paris Filmes Distribuidora LTDA',
    required: false,
  })
  corporate_name?: string;

  @ApiProperty({
    description: 'Nome fantasia (opcional)',
    example: 'Paris Filmes',
    required: false,
  })
  trade_name?: string;

  @ApiProperty({
    description: 'CNPJ (somente se for atualizado)',
    example: '12345678000190',
    required: false,
  })
  cnpj?: string;

  @ApiProperty({
    description: 'Telefone atualizado do fornecedor',
    example: '1133345566',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Email de contato atualizado',
    example: 'contato@parisfilmes.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Endereço comercial atualizado',
    example: 'Av. Paulista, 1500 - SP',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Nome do contato atualizado',
    example: 'Carla Oliveira',
    required: false,
  })
  contact_name?: string;

  @ApiProperty({
    description: 'Telefone de contato atualizado',
    example: '11999998888',
    required: false,
  })
  contact_phone?: string;

  @ApiProperty({
    description: 'Dias médios de entrega atualizados',
    example: 5,
    required: false,
  })
  delivery_days?: number;

  @ApiProperty({
    description: 'Atualiza flag de distribuidor de filmes',
    example: true,
    required: false,
  })
  is_film_distributor?: boolean;

  @ApiProperty({
    description: 'Atualiza o tipo de fornecedor (UUID)',
    example: 'b13fd2a1-8b7f-4b33-8a91-7a3a72b1329e',
    required: false,
  })
  supplier_type_id?: string;

  @ApiProperty({
    description: 'Ativa ou desativa o fornecedor',
    example: false,
    required: false,
  })
  active?: boolean;
}
