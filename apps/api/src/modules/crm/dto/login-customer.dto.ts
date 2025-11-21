import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const LoginCustomerSchema = z.object({
  company_id: z.string().min(1, 'ID da empresa é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export class LoginCustomerDto extends createZodDto(LoginCustomerSchema) {
  @ApiProperty({
    description: 'ID da empresa',
    example: '243244130367442946',
  })
  company_id!: string;

  @ApiProperty({
    description: 'Email',
    example: 'joao@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha',
    example: 'senha123',
  })
  password!: string;
}
