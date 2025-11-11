import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@repo/db';
import { MovieCategoryRepository } from '../repositories/movie-category.repository';
import { CreateMovieCategoryDto } from '../dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from '../dto/update-movie-category.dto';
import { LoggerService } from 'src/common/services/logger.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Injectable()
export class MovieCategoriesService {
  constructor(
    private readonly repository: MovieCategoryRepository,
    private readonly logger: LoggerService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  async create(dto: CreateMovieCategoryDto, user: RequestUser) {
    const companyId = user.company_id;
    const slug = await this.repository.uniqueSlugForName(dto.name, companyId);

    const data: Prisma.movie_categoriesCreateInput = {
      company_id: companyId,
      name: dto.name,
      description: dto.description ?? null,
      minimum_age: dto.minimum_age ?? 0,
      slug,
      active: dto.active ?? true,
    };

    const created = await this.repository.create(data);

    this.rabbitmq.publish({
      pattern: 'audit.movie_category.created',
      data: {
        id: created.id,
        new_values: created,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
      },
    });
    return created;
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

  async update(id: string, dto: UpdateMovieCategoryDto, user: RequestUser) {
    const companyId = user.company_id;
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== companyId) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const updateData: Partial<Prisma.movie_categoriesUpdateInput> = {};

    if (dto.name && dto.name !== existing.name) {
      updateData.name = dto.name;
      updateData.slug = await this.repository.uniqueSlugForName(
        dto.name,
        companyId,
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

    const updated = await this.repository.update(
      id,
      updateData as Prisma.movie_categoriesUpdateInput,
    );

    this.rabbitmq.publish({
      pattern: 'audit.movie_category.updated',
      data: {
        id: updated.id,
        new_values: updated,
        old_values: existing,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
      },
    });

    return updated;
  }

  async delete(id: string, user: RequestUser) {
    const companyId = user.company_id;
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== companyId) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.repository.delete(id);

    this.rabbitmq.publish({
      pattern: 'audit.movie_category.deleted',
      data: {
        id: existing.id,
        old_values: existing,
      },
      metadata: {
        companyId: companyId,
        userId: user.company_user_id,
      },
    });

    return { message: 'Categoria deletada com sucesso' };
  }
}
