import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { movie_categories, Prisma } from '@repo/db';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class MovieCategoryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findAll(company_id: string): Promise<movie_categories[]> {
    return this.prisma.movie_categories.findMany({
      where: { company_id, active: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<movie_categories | null> {
    return this.prisma.movie_categories.findUnique({
      where: { id },
    });
  }

  async create(
    data: Prisma.movie_categoriesCreateInput,
  ): Promise<movie_categories> {
    return this.prisma.movie_categories.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.movie_categoriesUpdateInput,
  ): Promise<movie_categories> {
    return this.prisma.movie_categories.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<movie_categories> {
    return this.prisma.movie_categories.delete({
      where: { id },
    });
  }

  async uniqueSlugForName(
    name: string,
    company_id: string,
    excludeId?: string,
  ): Promise<string> {
    const base = toSlugBase(name);

    const existsBase = await this.prisma.movie_categories.findFirst({
      where: {
        slug: base,
        company_id,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
    if (!existsBase) return base;

    for (let i = 1; i <= 1000; i++) {
      const candidate = `${base}-${i}`;
      const exists = await this.prisma.movie_categories.findFirst({
        where: {
          slug: candidate,
          company_id,
          ...(excludeId && { id: { not: excludeId } }),
        },
        select: { id: true },
      });
      if (!exists) return candidate;
    }
    throw new Error('Não foi possível gerar slug único para categoria.');
  }
}

function toSlugBase(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
