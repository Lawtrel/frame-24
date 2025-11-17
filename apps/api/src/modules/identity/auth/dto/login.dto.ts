import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export class LoginDto extends createZodDto(LoginSchema) {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'maria@cineestrela.com',
    format: 'email',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura123',
    minLength: 6,
  })
  password!: string;
}
