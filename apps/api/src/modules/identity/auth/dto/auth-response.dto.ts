import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CompanySelectionSchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  tenant_slug: z.string(),
  role_name: z.string(),
});

export class CompanySelectionDto extends createZodDto(CompanySelectionSchema) {
  @ApiProperty({
    description: 'ID da empresa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  company_id!: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa',
    example: 'Cine Estrela',
  })
  company_name!: string;

  @ApiProperty({
    description: 'Slug único da empresa',
    example: 'cine-estrela',
  })
  tenant_slug!: string;

  @ApiProperty({
    description: 'Nome da role do usuário nesta empresa',
    example: 'Administrador',
  })
  role_name!: string;
}

const LoginUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  company_id: z.string(),
  role_id: z.string(),
  employee_id: z.string(),
});

const LoginResponseSchema = z.object({
  access_token: z.string().optional(),
  user: LoginUserSchema,
  companies: z.array(CompanySelectionSchema).optional(),
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {
  @ApiPropertyOptional({
    description:
      'JWT access token (retornado quando usuário tem apenas 1 empresa)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token?: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
  })
  user!: {
    id: string;
    email: string;
    company_id: string;
    role_id: string;
    employee_id: string;
  };

  @ApiPropertyOptional({
    description:
      'Lista de empresas (retornado quando usuário tem múltiplas empresas)',
    type: [CompanySelectionDto],
  })
  companies?: CompanySelectionDto[];
}

const SelectCompanyResponseSchema = z.object({
  access_token: z.string(),
  user: LoginUserSchema,
});

export class SelectCompanyResponseDto extends createZodDto(
  SelectCompanyResponseSchema,
) {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
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
    example: 'Conta criada com sucesso! Verifique seu email para ativar.',
  })
  message!: string;
}

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SelectCompanyResponse = z.infer<typeof SelectCompanyResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
