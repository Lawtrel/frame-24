import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { movie_categories, Prisma } from '@repo/db';
import { MovieCategoryRepository } from '../repositories/movie-category.repository';
import { CreateMovieCategoryDto } from '../dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from '../dto/update-movie-category.dto';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';

@Injectable()
export class MovieCategoriesService {
  constructor(
    private readonly repository: MovieCategoryRepository,
    private readonly rabbitmq: RabbitMQPublisherService,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  private getUserId(): string | undefined {
    return this.cls.get<string>('userId');
  }

  async create(dto: CreateMovieCategoryDto): Promise<movie_categories> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();
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

    void this.rabbitmq.publish({
      pattern: 'audit.movie_category.created',
      data: {
        id: created.id,
        new_values: created,
      },
      metadata: {
        companyId: companyId,
        userId,
      },
    });
    return created;
  }

  async findAll(): Promise<movie_categories[]> {
    const companyId = this.getCompanyId();
    return this.repository.findAll(companyId);
  }

  async findOne(id: string): Promise<movie_categories> {
    const companyId = this.getCompanyId();
    const category = await this.repository.findById(id);
    if (!category || category.company_id !== companyId) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return category;
  }

  async update(
    id: string,
    dto: UpdateMovieCategoryDto,
  ): Promise<movie_categories> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== companyId) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    const updateData: Prisma.movie_categoriesUpdateInput = {};

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

    const updated = await this.repository.update(id, updateData);

    void this.rabbitmq.publish({
      pattern: 'audit.movie_category.updated',
      data: {
        id: updated.id,
        new_values: updated,
        old_values: existing,
      },
      metadata: {
        companyId: companyId,
        userId,
      },
    });

    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const companyId = this.getCompanyId();
    const userId = this.getUserId();
    const existing = await this.repository.findById(id);
    if (!existing || existing.company_id !== companyId) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.repository.delete(id);

    void this.rabbitmq.publish({
      pattern: 'audit.movie_category.deleted',
      data: {
        id: existing.id,
        old_values: existing,
      },
      metadata: {
        companyId: companyId,
        userId,
      },
    });

    return { message: 'Categoria deletada com sucesso' };
  }
}
