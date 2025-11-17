import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter maiúscula, minúscula e número',
    ),
  full_name: z.string().min(3, 'Nome muito curto'),
  company_id: z.string().min(1, 'Company ID é obrigatório'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {
  @ApiProperty({
    description: 'Email do novo usuário',
    example: 'funcionario@cineestrela.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha (mín. 8 caracteres, maiúscula, minúscula e número)',
    example: 'SenhaSegura123',
    minLength: 8,
  })
  password!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Carlos Santos',
    minLength: 3,
  })
  full_name!: string;

  @ApiProperty({
    description: 'ID da empresa à qual o usuário será vinculado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  company_id!: string;
}
