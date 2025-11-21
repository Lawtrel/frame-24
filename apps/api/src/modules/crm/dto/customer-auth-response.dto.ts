import { ApiProperty } from '@nestjs/swagger';

export class CustomerAuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'Dados do cliente',
  })
  customer!: {
    id: string;
    email: string;
    name: string;
    company_id: string;
    tenant_slug: string;
    loyalty_level: string;
    accumulated_points: number;
  };
}
