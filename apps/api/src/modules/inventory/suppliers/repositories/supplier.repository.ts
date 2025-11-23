import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { suppliers, supplier_types, Prisma } from '@repo/db';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class SupplierRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findById(id: string): Promise<suppliers | null> {
    return this.prisma.suppliers.findUnique({
      where: { id },
      include: {
        supplier_type: true,
      },
    });
  }

  async findByCnpj(
    cnpj: string,
    company_id: string,
  ): Promise<suppliers | null> {
    return this.prisma.suppliers.findFirst({
      where: {
        company_id,
        cnpj,
      },
      include: {
        supplier_type: true,
      },
    });
  }

  async findByCompany(
    company_id: string,
    onlyDistributors = false,
  ): Promise<suppliers[]> {
    return this.prisma.suppliers.findMany({
      where: {
        company_id,
        ...(onlyDistributors && { is_film_distributor: true }),
      },
      include: {
        supplier_type: true,
      },
      orderBy: {
        corporate_name: 'asc',
      },
    });
  }

  async findDistributors(company_id: string): Promise<suppliers[]> {
    return this.findByCompany(company_id, true);
  }

  async findTypes(company_id: string): Promise<supplier_types[]> {
    return this.prisma.supplier_types.findMany({
      where: { company_id },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(data: Prisma.suppliersCreateInput): Promise<suppliers> {
    return this.prisma.suppliers.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
      include: {
        supplier_type: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.suppliersUpdateInput,
  ): Promise<suppliers> {
    return this.prisma.suppliers.update({
      where: { id },
      data,
      include: {
        supplier_type: true,
      },
    });
  }

  async delete(id: string): Promise<suppliers> {
    return this.prisma.suppliers.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<suppliers> {
    return this.update(id, { active: false, updated_at: new Date() });
  }
}
