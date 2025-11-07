import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Por favor, forneça um e-mail válido.' })
    .nonempty({ message: 'O e-mail não pode estar vazio.' }),
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {
  @ApiProperty({
    description: 'E-mail associado à conta para recuperação de senha',
    example: 'usuario@empresa.com',
    format: 'email',
  })
  email!: string;
}

const ResetPasswordSchema = z.object({
  token: z.string().nonempty({ message: 'O token é obrigatório.' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .nonempty({ message: 'A senha não pode estar vazia.' }),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
  @ApiProperty({
    description:
      'Token de validação enviado por e-mail para redefinição de senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'NovaSenhaSegura123',
    minLength: 8,
  })
  password!: string;
}
