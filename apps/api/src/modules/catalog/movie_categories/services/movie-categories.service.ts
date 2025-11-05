import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { MovieCategoryRepository } from '../repositories/movie-category.repository';
import { CreateMovieCategoryDto } from '../dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from '../dto/update-movie-category.dto';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class MovieCategoriesService {
  constructor(
    private readonly repository: MovieCategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateMovieCategoryDto, company_id: string) {
    const slug = await this.repository.uniqueSlugForName(dto.name, company_id);

    const data: Prisma.movie_categoriesCreateInput = {
      company_id,
      name: dto.name,
      description: dto.description ?? null,
      minimum_age: dto.minimum_age ?? 0,
      slug,
      active: dto.active ?? true,
    };

    return this.repository.create(data);
  }

  async findAll(company_id: string) {
    return this.repository.findAll(company_id);
  }

  async findOne(id: string, company_id: string) {
    const category = await this.repository.findById(id);
    if (!category || category.company_id !== company_id) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return category;
  }

  async update(id: string, dto: UpdateMovieCategoryDto, company_id: string) {
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== company_id) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const updateData: Partial<Prisma.movie_categoriesUpdateInput> = {};

    if (dto.name && dto.name !== existing.name) {
      updateData.name = dto.name;
      updateData.slug = await this.repository.uniqueSlugForName(
        dto.name,
        company_id,
        id,
      );
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description ?? null;
    }

    if (dto.minimum_age !== undefined) {
      updateData.minimum_age = dto.minimum_age;
    }

    if (dto.active !== undefined) {
      updateData.active = dto.active;
    }

    return this.repository.update(
      id,
      updateData as Prisma.movie_categoriesUpdateInput,
    );
  }

  async delete(id: string, company_id: string) {
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== company_id) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return this.repository.delete(id);
  }
}
