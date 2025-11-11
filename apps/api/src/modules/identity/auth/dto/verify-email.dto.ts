import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {
  @ApiProperty({
    description: 'Token de verificação enviado por email',
    example: 'a1b2c3d4e5f6...',
  })
  token!: string;
}
