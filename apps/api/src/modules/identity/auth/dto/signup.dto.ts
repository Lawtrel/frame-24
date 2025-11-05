import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const SignupSchema = z.object({
  corporate_name: z
    .string()
    .min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  trade_name: z.string().optional(),
  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{14}$/.test(val), 'CNPJ inválido'),

  company_zip_code: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{8}$/.test(val), 'CEP inválido'),
  company_street_address: z.string().min(3, 'Endereço inválido'),
  company_address_number: z.string(),
  company_address_complement: z.string().optional(),
  company_neighborhood: z.string(),
  company_city: z.string(),
  company_state: z.string().length(2, 'Estado deve ter 2 letras'),

  company_phone: z
    .string()
    .transform((val) => val?.replace(/\D/g, ''))
    .refine((val) => !val || /^\d{10,11}$/.test(val), 'Telefone inválido'),
  company_email: z.string().email().optional(),

  full_name: z.string().min(3, 'Nome completo inválido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  mobile: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^\d{10,11}$/.test(val), 'Celular inválido'),

  // ✅ CORRIGIDO: sem .optional() quando tem .default()
  plan_type: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']).default('BASIC'),
});

export class SignupDto extends createZodDto(SignupSchema) {}

export class SignupDtoSwagger extends SignupDto {
  @ApiProperty({
    description: 'Razão social da empresa (nome jurídico)',
    example: 'Cinema Estrela LTDA',
  })
  corporate_name!: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa',
    example: 'CineEstrela',
    required: false,
  })
  trade_name?: string;

  @ApiProperty({
    description: 'CNPJ no formato XX.XXX.XXX/XXXX-XX',
    example: '98.765.432/0001-10',
  })
  cnpj!: string;

  @ApiProperty({
    description: 'CEP no formato XXXXX-XXX',
    example: '01310-100',
  })
  company_zip_code!: string;

  @ApiProperty({
    description: 'Logradouro da empresa',
    example: 'Av. Paulista',
  })
  company_street_address!: string;

  @ApiProperty({ description: 'Número do endereço', example: '1578' })
  company_address_number!: string;

  @ApiProperty({
    description: 'Complemento do endereço (sala, bloco, etc.)',
    example: 'Sala 501',
    required: false,
  })
  company_address_complement?: string;

  @ApiProperty({ description: 'Bairro da empresa', example: 'Bela Vista' })
  company_neighborhood!: string;

  @ApiProperty({ description: 'Cidade da empresa', example: 'São Paulo' })
  company_city!: string;

  @ApiProperty({ description: 'UF da empresa (2 letras)', example: 'SP' })
  company_state!: string;

  @ApiProperty({
    description: 'Telefone fixo comercial',
    example: '(11) 3333-4444',
    required: false,
  })
  company_phone!: string;

  @ApiProperty({
    description: 'Email institucional da empresa',
    example: 'contato@cineestrela.com',
    required: false,
  })
  company_email?: string;

  @ApiProperty({
    description: 'Nome completo do administrador principal',
    example: 'Maria Oliveira',
  })
  full_name!: string;

  @ApiProperty({
    description: 'Email do administrador',
    example: 'maria@cineestrela.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo 6 caracteres)',
    example: 'SenhaSegura123',
  })
  password!: string;

  @ApiProperty({
    description: 'Celular do administrador no formato (XX) XXXXX-XXXX',
    example: '(11) 98765-4321',
  })
  mobile!: string;

  @ApiProperty({
    description: 'Tipo de plano contratado',
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
    example: 'BASIC',
    default: 'BASIC',
    required: false,
  })
  plan_type!: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}
