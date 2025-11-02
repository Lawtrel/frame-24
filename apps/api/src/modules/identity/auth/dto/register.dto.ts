import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(3),
  company_id: z.string(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {
  @ApiProperty({
    description: 'Email do novo usuário',
    example: 'funcionario@cineestrela.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha do novo usuário',
    example: 'SenhaSegura123',
    minLength: 6,
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
    example: '1234567890123456789',
  })
  company_id!: string;
}
