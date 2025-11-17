import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

const SelectCompanySchema = z.object({
  company_id: z.string().min(1, 'Company ID é obrigatório'),
});

export class SelectCompanyDto extends createZodDto(SelectCompanySchema) {
  @ApiProperty({
    description: 'ID da empresa selecionada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  company_id!: string;
}
