import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CreateUserSchema = z.object({
  full_name: z.string().min(3).max(200),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .optional(),
  birth_date: z.string().datetime().optional(),

  phone: z.string().max(20).optional(),
  mobile: z.string().max(20).optional(),
  email: z.string().email().max(100),

  zip_code: z.string().max(10).optional(),
  street_address: z.string().max(300).optional(),
  address_number: z.string().max(20).optional(),
  address_complement: z.string().max(100).optional(),
  neighborhood: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().length(2).optional(),
  country: z.string().length(2).default('BR'),

  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),

  role_id: z.string(),
  department: z.string().max(100).optional(),
  job_level: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  allowed_complexes: z.array(z.string()).optional(),
  ip_whitelist: z.array(z.string()).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().nullable().optional(),
  active: z.boolean().default(true),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva Santos',
    minLength: 3,
    maxLength: 200,
  })
  full_name!: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (formato: 000.000.000-00)',
    example: '123.456.789-00',
    pattern: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$',
  })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento (ISO 8601)',
    example: '1990-05-15T00:00:00.000Z',
  })
  birth_date?: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo',
    example: '(11) 3000-0000',
    maxLength: 20,
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Celular',
    example: '(11) 98765-4321',
    maxLength: 20,
  })
  mobile?: string;

  @ApiProperty({
    description: 'Email (será usado para login)',
    example: 'joao.silva@empresa.com',
    format: 'email',
    maxLength: 100,
  })
  email!: string;

  @ApiPropertyOptional({
    description: 'CEP',
    example: '01310-100',
    maxLength: 10,
  })
  zip_code?: string;

  @ApiPropertyOptional({
    description: 'Endereço (rua)',
    example: 'Av. Paulista',
    maxLength: 300,
  })
  street_address?: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '1578',
    maxLength: 20,
  })
  address_number?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Sala 501',
    maxLength: 100,
  })
  address_complement?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Bela Vista',
    maxLength: 100,
  })
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Cidade',
    example: 'São Paulo',
    maxLength: 100,
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Estado (UF)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  state?: string;

  @ApiProperty({
    description: 'País (código ISO 3166-1 alpha-2)',
    example: 'BR',
    default: 'BR',
    minLength: 2,
    maxLength: 2,
  })
  country!: string;

  @ApiProperty({
    description:
      'Senha (mín. 8 caracteres, deve conter maiúscula, minúscula e número)',
    example: 'SenhaForte123',
    minLength: 8,
  })
  password!: string;

  @ApiProperty({
    description: 'ID da role (custom_roles.id)',
    example: '243254863696236545',
  })
  role_id!: string;

  @ApiPropertyOptional({
    description: 'Departamento do funcionário',
    example: 'TI',
    maxLength: 100,
  })
  department?: string;

  @ApiPropertyOptional({
    description: 'Cargo/nível',
    example: 'Desenvolvedor Senior',
    maxLength: 50,
  })
  job_level?: string;

  @ApiPropertyOptional({
    description: 'Localização/unidade',
    example: 'Matriz - São Paulo',
    maxLength: 100,
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'IDs dos complexos/cinemas permitidos (JSON array)',
    example: ['COMPLEX-001', 'COMPLEX-005'],
    type: [String],
  })
  allowed_complexes?: string[];

  @ApiPropertyOptional({
    description: 'Lista de IPs permitidos para acesso',
    example: ['192.168.1.100', '10.0.0.50'],
    type: [String],
  })
  ip_whitelist?: string[];

  @ApiPropertyOptional({
    description: 'Data de início do vínculo (ISO 8601)',
    example: '2024-01-15T00:00:00.000Z',
  })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Data de término do vínculo (ISO 8601)',
    example: '2025-12-31T00:00:00.000Z',
  })
  end_date?: string;

  @ApiProperty({
    description: 'Se o usuário está ativo',
    example: true,
    default: true,
  })
  active!: boolean;
}
