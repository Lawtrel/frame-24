import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateSupplierSchema = z.object({
  supplier_type_id: z.string().optional(),

  corporate_name: z
    .string()
    .min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  trade_name: z.string().optional(),

  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{14}$/.test(val), 'CNPJ inválido'),

  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{10,11}$/.test(val), 'Telefone inválido'),

  email: z.string().email().optional(),
  address: z.string().optional(),

  contact_name: z.string().optional(),
  contact_phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{10,11}$/.test(val), 'Telefone de contato inválido')
    .optional(),

  delivery_days: z.number().int().min(0).default(7),
  is_film_distributor: z.boolean().default(false),
  active: z.boolean().default(true),
});

export class CreateSupplierDto extends createZodDto(CreateSupplierSchema) {
  @ApiProperty({
    description: 'Nome jurídico do fornecedor (razão social)',
    example: 'Paris Filmes LTDA',
  })
  corporate_name!: string;

  @ApiProperty({
    description: 'Nome fantasia (como o fornecedor é conhecido comercialmente)',
    example: 'Paris Filmes',
    required: false,
  })
  trade_name?: string;

  @ApiProperty({
    description: 'CNPJ do fornecedor, apenas números',
    example: '12345678000190',
  })
  cnpj!: string;

  @ApiProperty({
    description: 'Telefone principal do fornecedor (DDD + número)',
    example: '1133345566',
  })
  phone!: string;

  @ApiProperty({
    description: 'Email de contato principal do fornecedor',
    example: 'contato@parisfilmes.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Endereço comercial completo',
    example: 'Av. Paulista, 1000 - São Paulo/SP',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Nome do responsável ou pessoa de contato',
    example: 'João Silva',
    required: false,
  })
  contact_name?: string;

  @ApiProperty({
    description: 'Telefone do contato (DDD + número)',
    example: '11987654321',
    required: false,
  })
  contact_phone?: string;

  @ApiProperty({
    description: 'Dias médios para entrega',
    example: 7,
    default: 7,
  })
  delivery_days!: number;

  @ApiProperty({
    description: 'Indica se o fornecedor atua como distribuidor de filmes',
    example: true,
    default: false,
  })
  is_film_distributor!: boolean;

  @ApiProperty({
    description: 'Identificador do tipo de fornecedor (chave estrangeira)',
    example: '212121323242442',
    required: false,
  })
  supplier_type_id?: string;

  @ApiProperty({
    description: 'Status do fornecedor',
    example: true,
    default: true,
  })
  active!: boolean;
}
