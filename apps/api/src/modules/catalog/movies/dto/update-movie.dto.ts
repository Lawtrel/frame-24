import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CastItemSchema = z.object({
  cast_type: z.string(),
  artist_name: z.string().min(1),
  character_name: z.string().optional(),
  credit_order: z.number().int().min(0).optional(),
  photo_url: z.string().url().optional(),
});

const MediaItemSchema = z.object({
  media_type: z.string(),
  media_url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const UpdateMovieSchema = z.object({
  distributor_id: z.string().optional(),
  original_title: z.string().optional(),
  brazil_title: z.string().optional(),
  duration_minutes: z.number().int().min(1).optional(),
  country_of_origin: z.string().optional(),
  production_year: z.number().int().min(1900).max(2100).optional(),
  national: z.boolean().optional(),
  synopsis: z.string().optional(),
  short_synopsis: z.string().max(500).optional(),
  website: z.string().url().optional(),
  age_rating: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
  tmdb_id: z.string().optional(),
  imdb_id: z.string().optional(),
  tags_json: z.string().optional(),
  original_language: z.string().optional(),
  worldwide_release_date: z.string().datetime().optional(),
  active: z.boolean().optional(),

  cast: z.array(CastItemSchema).optional(),
  media: z.array(MediaItemSchema).optional(),
});

export class UpdateMovieDto extends createZodDto(UpdateMovieSchema) {
  @ApiPropertyOptional({
    description: 'ID do distribuidor (supplier) do filme',
  })
  distributor_id?: string;

  @ApiPropertyOptional({
    description:
      'Título original. Se alterado, o slug único será recalculado automaticamente.',
  })
  original_title?: string;

  @ApiPropertyOptional({ description: 'Título local (Brasil)' })
  brazil_title?: string;

  @ApiPropertyOptional({
    description: 'Duração do filme em minutos',
    minimum: 1,
  })
  duration_minutes?: number;

  @ApiPropertyOptional({ description: 'País de origem da produção' })
  country_of_origin?: string;

  @ApiPropertyOptional({
    description: 'Ano de produção',
    minimum: 1900,
    maximum: 2100,
  })
  production_year?: number;

  @ApiPropertyOptional({ description: 'Indica se é produção nacional' })
  national?: boolean;

  @ApiPropertyOptional({ description: 'Sinopse completa do filme' })
  synopsis?: string;

  @ApiPropertyOptional({
    description: 'Sinopse resumida (até 500 caracteres)',
    maxLength: 500,
  })
  short_synopsis?: string;

  @ApiPropertyOptional({ description: 'Website oficial do filme' })
  website?: string;

  @ApiPropertyOptional({
    description: 'ID da classificação indicativa (age_ratings.id)',
  })
  age_rating?: string;

  @ApiPropertyOptional({
    description:
      'Lista de IDs de categorias do filme (N:N). Ao enviar, sincroniza.',
    example: ['CAT-DRAMA', 'CAT-FICCAO'],
  })
  category_ids?: string[];

  @ApiPropertyOptional({ description: 'Identificador no TMDB' })
  tmdb_id?: string;

  @ApiPropertyOptional({ description: 'Identificador no IMDB' })
  imdb_id?: string;

  @ApiPropertyOptional({ description: 'Campo de tags em JSON (string)' })
  tags_json?: string;

  @ApiPropertyOptional({ description: 'Idioma original da obra' })
  original_language?: string;

  @ApiPropertyOptional({
    description: 'Data de estreia mundial (ISO 8601)',
  })
  worldwide_release_date?: string;

  @ApiPropertyOptional({ description: 'Ativo/inativo' })
  active?: boolean;

  @ApiPropertyOptional({
    description:
      'Elenco completo para substituição. Se enviado, apaga o elenco anterior e recria conforme itens.',
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
      'Mídias completas para substituição. Se enviado, apaga as mídias anteriores e recria conforme itens.',
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
