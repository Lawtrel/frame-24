import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  company_id: z.string().optional(),
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

  @ApiHideProperty()
  company_id?: string;
}
