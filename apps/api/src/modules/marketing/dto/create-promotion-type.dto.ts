import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePromotionTypeDto {
  @ApiProperty({
    description: 'Código único do tipo de promoção por empresa',
    example: 'PERCENTUAL',
    maxLength: 30,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  code!: string;

  @ApiProperty({
    description: 'Nome amigável apresentado no dashboard',
    example: 'Desconto percentual',
    maxLength: 100,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do tipo de promoção',
    example:
      'Aplica um desconto baseado em percentual sobre o valor do pedido.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Define se o tipo está ativo para novas campanhas',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class PromotionTypeResponseDto {
  @ApiProperty({
    description: 'Identificador do tipo',
    example: '01JAB1234XYZ',
  })
  id!: string;

  @ApiProperty({ description: 'Código interno único', example: 'PERCENTUAL' })
  code!: string;

  @ApiProperty({
    description: 'Nome apresentado no dashboard',
    example: 'Desconto percentual',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada',
    example: 'Aplica um desconto baseado em percentual sobre o subtotal.',
  })
  description?: string | null;

  @ApiProperty({
    description: 'Status do tipo de promoção',
    example: true,
    default: true,
  })
  active!: boolean | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-10T12:00:00.000Z',
  })
  created_at!: Date | null;
}
