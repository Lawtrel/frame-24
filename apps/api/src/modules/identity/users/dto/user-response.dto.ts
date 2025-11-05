import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const UserResponseSchema = z.object({
  employee_id: z.string().uuid(),
  full_name: z.string(),
  email: z.string().email(),
  cpf: z.string().nullable(),
  mobile: z.string().nullable(),

  company_user: z.object({
    id: z.string().uuid(),
    employee_id: z.string(),
    role_id: z.string().uuid(),
    role_name: z.string(),
    department: z.string().nullable(),
    job_level: z.string().nullable(),
    active: z.boolean(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime().nullable(),
    last_access: z.string().datetime().nullable(),
  }),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {
  @ApiProperty({
    description: 'ID da identidade',
    example: 'EMP-8636962',
  })
  employee_id!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva Santos',
  })
  full_name!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@empresa.com',
  })
  email!: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário',
    example: '12345678900',
    nullable: true,
  })
  cpf!: string | null;

  @ApiPropertyOptional({
    description: 'Celular do usuário',
    example: '11987654321',
    nullable: true,
  })
  mobile!: string | null;

  @ApiProperty({
    description: 'Dados do vínculo com a empresa',
    example: {
      id: '243254863696236545',
      employee_id: '243254863696236546',
      role_id: '243254863696236547',
      role_name: 'Operador',
      department: 'TI',
      job_level: 'Senior',
      active: true,
      start_date: '2024-01-15T00:00:00.000Z',
      end_date: null,
      last_access: '2025-11-04T20:15:00.000Z',
    },
  })
  company_user!: {
    id: string;
    employee_id: string;
    role_id: string;
    role_name: string;
    department: string | null;
    job_level: string | null;
    active: boolean;
    start_date: string;
    end_date: string | null;
    last_access: string | null;
  };

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:00:00.000Z',
  })
  created_at!: string;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-11-04T15:30:00.000Z',
  })
  updated_at!: string;
}
