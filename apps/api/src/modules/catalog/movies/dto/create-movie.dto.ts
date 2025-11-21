import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CastItemSchema = z.object({
  cast_type: z.string().min(1, 'Tipo de elenco é obrigatório'),
  artist_name: z.string().min(1, 'Nome do artista é obrigatório'),
  character_name: z.string().optional(),
  credit_order: z.number().int('Ordem deve ser um número inteiro').min(0, 'Ordem deve ser positiva').optional(),
  photo_url: z.string().url('URL da foto inválida').optional(),
});

const MediaItemSchema = z.object({
  media_type: z.string().min(1, 'Tipo de mídia é obrigatório'),
  media_url: z.string().url('URL da mídia inválida'),
  title: z.string().optional(),
  description: z.string().optional(),
  width: z.number().int('Largura deve ser um número inteiro').positive('Largura deve ser positiva').optional(),
  height: z.number().int('Altura deve ser um número inteiro').positive('Altura deve ser positiva').optional(),
});

const CreateMovieSchema = z.object({
  distributor_id: z.string().min(1, 'ID do distribuidor é obrigatório'),
  original_title: z.string().min(1, 'Título original é obrigatório'),
  brazil_title: z.string().optional(),
  duration_minutes: z.number().int('Duração deve ser um número inteiro').min(1, 'Duração deve ser no mínimo 1 minuto'),
  country_of_origin: z.string().optional(),
  production_year: z.number().int('Ano deve ser um número inteiro').min(1900, 'Ano deve ser maior que 1900').max(2100, 'Ano deve ser menor que 2100').optional(),
  national: z.boolean().default(false),
  synopsis: z.string().optional(),
  short_synopsis: z.string().max(500, 'Sinopse resumida deve ter no máximo 500 caracteres').optional(),
  website: z.string().url('URL do site inválida').optional(),
  age_rating: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
  original_language: z.string().optional(),
  worldwide_release_date: z.string().datetime('Data de estreia inválida').optional(),

  cast: z.array(CastItemSchema).optional(),
  media: z.array(MediaItemSchema).optional(),
});

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {
  @ApiProperty({
    description: 'ID do distribuidor (supplier) do filme',
    example: '243254863696236545',
  })
  distributor_id!: string;

  @ApiProperty({
    description: 'Título original (slug único é gerado a partir deste campo)',
    example: 'Dune: Part Two',
  })
  original_title!: string;

  @ApiPropertyOptional({
    description: 'Título local (Brasil)',
    example: 'Duna: Parte Dois',
  })
  brazil_title?: string;

  @ApiProperty({
    description: 'Duração do filme em minutos',
    example: 166,
    minimum: 1,
  })
  duration_minutes!: number;

  @ApiPropertyOptional({
    description: 'País de origem da produção',
    example: 'USA',
  })
  country_of_origin?: string;

  @ApiPropertyOptional({
    description: 'Ano de produção',
    example: 2024,
    minimum: 1900,
    maximum: 2100,
  })
  production_year?: number;

  @ApiProperty({
    description: 'Indica se é produção nacional',
    example: false,
    default: false,
  })
  national!: boolean;

  @ApiPropertyOptional({
    description: 'Sinopse completa do filme',
  })
  synopsis?: string;

  @ApiPropertyOptional({
    description: 'Sinopse resumida (até 500 caracteres)',
    maxLength: 500,
  })
  short_synopsis?: string;

  @ApiPropertyOptional({
    description: 'Website oficial do filme',
    example: 'https://dunemovie.com',
  })
  website?: string;

  @ApiPropertyOptional({
    description: 'ID da classificação indicativa (age_ratings.id)',
    example: 'AGE-12',
  })
  age_rating?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs de categorias do filme (N:N)',
    example: ['CAT-ACAO', 'CAT-FICCAO'],
  })
  category_ids?: string[];

  @ApiPropertyOptional({
    description: 'Idioma original da obra',
    example: 'en',
  })
  original_language?: string;

  @ApiPropertyOptional({
    description: 'Data de estreia mundial (ISO 8601)',
    example: '2024-11-03T00:00:00.000Z',
  })
  worldwide_release_date?: string;

  @ApiPropertyOptional({
    description:
      'Elenco inicial (opcional). Se enviado, cria os registros de elenco para o filme.',
    example: [
      { cast_type: 'DIR', artist_name: 'Denis Villeneuve' },
      {
        cast_type: 'ACT',
        artist_name: 'Timothée Chalamet',
        character_name: 'Paul Atreides',
        credit_order: 1,
      },
    ],
  })
  cast?: Array<{
    cast_type: string;
    artist_name: string;
    character_name?: string;
    credit_order?: number;
    photo_url?: string;
  }>;

  @ApiPropertyOptional({
    description:
      'Mídias iniciais (opcional). Se enviado, cria os registros de mídia do filme.',
    example: [
      {
        media_type: 'POSTER',
        media_url: 'https://img/poster.jpg',
        title: 'Poster oficial',
      },
      {
        media_type: 'TRAILER',
        media_url: 'https://youtube.com/...',
        title: 'Trailer 1',
      },
    ],
  })
  media?: Array<{
    media_type: string;
    media_url: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
  }>;
}
