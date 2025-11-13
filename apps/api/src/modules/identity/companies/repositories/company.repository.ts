import { Injectable } from '@nestjs/common';
import { companies, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CompanyMapper } from 'src/modules/identity/auth/infraestructure/mappers/company.mapper';
import { Company } from 'src/modules/identity/auth/domain/entities/company.entity';

@Injectable()
export class CompanyRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findById(id: string): Promise<Company | null> {
    const raw = await this.prisma.companies.findUnique({
      where: { id },
    });

    return raw ? CompanyMapper.toDomain(raw) : null;
  }

  async findByCnpj(cnpj: string): Promise<companies | null> {
    return this.prisma.companies.findUnique({
      where: { cnpj },
    });
  }

  async findAll(skip = 0, take = 10): Promise<companies[]> {
    return this.prisma.companies.findMany({
      skip,
      take,
      where: { active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(data: Prisma.companiesCreateInput): Promise<companies> {
    return this.prisma.companies.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.companiesUpdateInput,
  ): Promise<companies> {
    return this.prisma.companies.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<companies> {
    return this.prisma.companies.delete({
      where: { id },
    });
  }
}
