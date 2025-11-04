import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@repo/db';
import { MovieRepository } from '../repositories/movie.repository';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { LoggerService } from 'src/common/services/logger.service';
import { SupplierRepository } from 'src/modules/inventory/suppliers/repositories/supplier.repository';

@Injectable()
export class MoviesService {
  constructor(
    private readonly repository: MovieRepository,
    private readonly suppliers: SupplierRepository,
    private readonly logger: LoggerService,
  ) {}

  private async validateDistributor(
    distributor_id: string,
    company_id: string,
  ) {
    const supplier = await this.suppliers.findById(distributor_id);
    if (!supplier) throw new NotFoundException('Distribuidor não encontrado.');
    if (supplier.company_id !== company_id) {
      throw new BadRequestException('Distribuidor de outra empresa.');
    }
    if (!supplier.active || !supplier.is_film_distributor) {
      throw new BadRequestException('Distribuidor inativo ou inválido.');
    }
    return supplier;
  }

  async create(dto: CreateMovieDto, company_id: string) {
    await this.validateDistributor(dto.distributor_id, company_id);

    const slug = await this.repository.uniqueSlugForTitle(dto.original_title);

    const data: Prisma.moviesCreateInput = {
      company_id,
      distributor_id: dto.distributor_id,
      original_title: dto.original_title,
      brazil_title: dto.brazil_title,
      duration_minutes: dto.duration_minutes,
      country_of_origin: dto.country_of_origin,
      production_year: dto.production_year,
      national: dto.national ?? false,
      synopsis: dto.synopsis,
      short_synopsis: dto.short_synopsis,
      website: dto.website,
      original_language: dto.original_language,
      worldwide_release_date: dto.worldwide_release_date
        ? new Date(dto.worldwide_release_date)
        : undefined,
      slug,
      ...(dto.age_rating && {
        age_rating: { connect: { id: dto.age_rating } },
      }),
      category_links: dto.category_ids
        ? {
            create: dto.category_ids.map((id) => ({
              category: { connect: { id } },
            })),
          }
        : undefined,
      active: true,
    };

    const created = await this.repository.create(data);

    if (Array.isArray(dto.cast) && dto.cast.length > 0) {
      await this.repository.replaceCast(created.id, dto.cast);
    }
    if (Array.isArray(dto.media) && dto.media.length > 0) {
      await this.repository.replaceMedia(created.id, dto.media);
    }

    return this.repository.findByIdLite(created.id);
  }

  async findAll(company_id: string) {
    return this.repository.findByCompanyLite(company_id);
  }

  async findOne(id: string) {
    const movie = await this.repository.findByIdLite(id);
    if (!movie) throw new NotFoundException('Filme não encontrado');
    return movie;
  }

  async update(id: string, dto: UpdateMovieDto, company_id: string) {
    const existing = await this.repository.findByIdLite(id);
    if (!existing || existing.company_id !== company_id) {
      throw new NotFoundException('Filme não encontrado.');
    }

    if (dto.distributor_id) {
      await this.validateDistributor(dto.distributor_id, company_id);
    }

    let slugUpdate: string | undefined;
    if (
      typeof dto.original_title === 'string' &&
      dto.original_title !== existing.original_title
    ) {
      slugUpdate = await this.repository.uniqueSlugForTitle(
        dto.original_title,
        id,
      );
    }

    const data: Prisma.moviesUpdateInput = {
      ...(dto.distributor_id !== undefined && {
        distributor_id: dto.distributor_id,
      }),
      ...(dto.original_title !== undefined && {
        original_title: dto.original_title,
      }),
      ...(dto.brazil_title !== undefined && { brazil_title: dto.brazil_title }),
      ...(dto.duration_minutes !== undefined && {
        duration_minutes: dto.duration_minutes,
      }),
      ...(dto.country_of_origin !== undefined && {
        country_of_origin: dto.country_of_origin,
      }),
      ...(dto.production_year !== undefined && {
        production_year: dto.production_year,
      }),
      ...(dto.national !== undefined && { national: dto.national }),
      ...(dto.synopsis !== undefined && { synopsis: dto.synopsis }),
      ...(dto.short_synopsis !== undefined && {
        short_synopsis: dto.short_synopsis,
      }),
      ...(dto.website !== undefined && { website: dto.website }),
      ...(dto.tmdb_id !== undefined && { tmdb_id: dto.tmdb_id }),
      ...(dto.imdb_id !== undefined && { imdb_id: dto.imdb_id }),
      ...(dto.tags_json !== undefined && { tags_json: dto.tags_json }),
      ...(dto.original_language !== undefined && {
        original_language: dto.original_language,
      }),
      ...(dto.worldwide_release_date !== undefined && {
        worldwide_release_date: dto.worldwide_release_date
          ? new Date(dto.worldwide_release_date)
          : null,
      }),
      ...(slugUpdate !== undefined && { slug: slugUpdate }),
      ...(dto.age_rating !== undefined && {
        age_rating: dto.age_rating
          ? { connect: { id: dto.age_rating } }
          : { disconnect: true },
      }),
      ...(dto.active !== undefined && { active: dto.active }),
    };

    await this.repository.update(id, data);

    if (Array.isArray(dto.category_ids)) {
      await this.repository.setCategories(id, dto.category_ids);
    }
    if (Array.isArray(dto.cast)) {
      await this.repository.replaceCast(id, dto.cast);
    }
    if (Array.isArray(dto.media)) {
      await this.repository.replaceMedia(id, dto.media);
    }

    return this.repository.findByIdLite(id);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async getCastTypes(company_id: string) {
    return this.repository.findCastTypes(company_id);
  }

  async getMediaTypes(company_id: string) {
    return this.repository.findMediaTypes(company_id);
  }

  async getAgeRatings(company_id: string) {
    return this.repository.findAgeRatings(company_id);
  }
}
