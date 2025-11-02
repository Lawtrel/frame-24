import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const LoginUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  company_id: z.string(),
  role_id: z.string(),
  employee_id: z.string(),
});

const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: LoginUserSchema,
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123456789' },
      email: { type: 'string', example: 'maria@cineestrela.com' },
      company_id: { type: 'string', example: '987654321' },
      role_id: { type: 'string', example: 'role-admin' },
      employee_id: { type: 'string', example: 'ADM-12345678' },
    },
  })
  user!: {
    id: string;
    email: string;
    company_id: string;
    role_id: string;
    employee_id: string;
  };
}

const RegisterResponseSchema = z.object({
  success: z.boolean(),
  user_id: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {
  @ApiProperty({
    description: 'Status de sucesso da operação',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'ID do usuário criado',
    example: '243244130367442946',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'maria@cineestrela.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Conta criada com sucesso!',
  })
  message!: string;
}

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
