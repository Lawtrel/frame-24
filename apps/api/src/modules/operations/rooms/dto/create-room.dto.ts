import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRoomSchema } from './create-room.schema';

class SeatLayoutItemDto {
  @ApiPropertyOptional()
  seat_type_id?: string | null;
  @ApiProperty()
  column_number!: number;
  @ApiPropertyOptional({ default: false })
  accessible?: boolean;
}

class SeatLayoutRowDto {
  @ApiProperty()
  row_code!: string;
  @ApiProperty({ type: [SeatLayoutItemDto] })
  seats!: SeatLayoutItemDto[];
}

export class CreateRoomDto extends createZodDto(CreateRoomSchema) {
  @ApiProperty({ description: 'Número/identificador da sala', example: '1' })
  room_number!: string;

  @ApiPropertyOptional({
    description: 'Nome descritivo da sala',
    example: 'Sala IMAX',
  })
  name?: string | null;

  @ApiProperty({
    description: 'Capacidade total de assentos da sala',
    example: 120,
  })
  capacity!: number;

  @ApiPropertyOptional({ description: 'ID do tipo de projeção' })
  projection_type_id?: string | null;

  @ApiPropertyOptional({ description: 'ID do tipo de áudio' })
  audio_type_id?: string | null;

  @ApiPropertyOptional({ default: true })
  active?: boolean;

  @ApiProperty({
    description: 'Array com as fileiras e assentos da sala',
    type: [SeatLayoutRowDto],
  })
  seat_layout!: SeatLayoutRowDto[];

  @ApiPropertyOptional({
    description: 'Design da sala (ex: stadium, flat)',
    example: 'stadium',
  })
  room_design?: string | null;

  @ApiPropertyOptional({ description: 'URL para uma imagem do layout' })
  layout_image?: string | null;
}
