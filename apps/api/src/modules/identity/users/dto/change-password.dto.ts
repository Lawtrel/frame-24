import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'As senhas não conferem',
    path: ['confirm_password'],
  });

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {
  @ApiProperty({ description: 'Senha atual', example: 'SenhaAntiga123' })
  current_password!: string;

  @ApiProperty({ description: 'Nova senha', example: 'SenhaNova456' })
  new_password!: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'SenhaNova456',
  })
  confirm_password!: string;
}
