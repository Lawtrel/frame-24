import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const SignupSchema = z.object({
  corporate_name: z.string().min(3, 'Razão social muito curta'),
  trade_name: z.string().optional(),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),

  company_zip_code: z.string().min(1, 'CEP é obrigatório'),
  company_street_address: z.string().min(3, 'Endereço muito curto'),
  company_address_number: z.string().min(1, 'Número é obrigatório'),
  company_address_complement: z.string().optional(),
  company_neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  company_city: z.string().min(2, 'Cidade é obrigatória'),
  company_state: z.string().length(2, 'Estado deve ter 2 letras (UF)'),

  company_phone: z.string().optional(),
  company_email: z.string().email('Email da empresa inválido').optional(),

  full_name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter maiúscula, minúscula e número',
    ),
  mobile: z.string().min(1, 'Celular é obrigatório'),

  plan_type: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']).default('BASIC'),
});

export class SignupDto extends createZodDto(SignupSchema) {
  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Cinema Estrela LTDA',
  })
  corporate_name!: string;

  @ApiProperty({
    description: 'Nome fantasia',
    example: 'CineEstrela',
    required: false,
  })
  trade_name?: string;

  @ApiProperty({
    description: 'CNPJ (pode conter formatação)',
    example: '98.765.432/0001-10',
  })
  cnpj!: string;

  @ApiProperty({
    description: 'CEP (pode conter formatação)',
    example: '01310-100',
  })
  company_zip_code!: string;

  @ApiProperty({
    description: 'Logradouro',
    example: 'Av. Paulista',
  })
  company_street_address!: string;

  @ApiProperty({
    description: 'Número',
    example: '1578',
  })
  company_address_number!: string;

  @ApiProperty({
    description: 'Complemento',
    example: 'Sala 501',
    required: false,
  })
  company_address_complement?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Bela Vista',
  })
  company_neighborhood!: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  company_city!: string;

  @ApiProperty({
    description: 'UF (2 letras)',
    example: 'SP',
    maxLength: 2,
  })
  company_state!: string;

  // Contato
  @ApiProperty({
    description: 'Telefone comercial (pode conter formatação)',
    example: '(11) 3333-4444',
    required: false,
  })
  company_phone?: string;

  @ApiProperty({
    description: 'Email institucional',
    example: 'contato@cineestrela.com',
    required: false,
  })
  company_email?: string;

  @ApiProperty({
    description: 'Nome completo do administrador',
    example: 'Maria Oliveira',
  })
  full_name!: string;

  @ApiProperty({
    description: 'Email do administrador',
    example: 'maria@cineestrela.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha (mín. 8 caracteres, maiúscula, minúscula e número)',
    example: 'SenhaSegura123',
    minLength: 8,
  })
  password!: string;

  @ApiProperty({
    description: 'Celular do administrador (pode conter formatação)',
    example: '(11) 98765-4321',
  })
  mobile!: string;

  @ApiProperty({
    description: 'Tipo de plano',
    enum: ['BASIC', 'PREMIUM', 'ENTERPRISE'],
    default: 'BASIC',
  })
  plan_type!: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}
