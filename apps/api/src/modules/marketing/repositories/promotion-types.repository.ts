import { Injectable } from '@nestjs/common';
import { Prisma, promotion_types as PromotionType } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromotionTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByCompany(company_id: string): Promise<PromotionType[]> {
    return this.prisma.promotion_types.findMany({
      where: { company_id },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  async findByCode(
    company_id: string,
    code: string,
  ): Promise<PromotionType | null> {
    return this.prisma.promotion_types.findFirst({
      where: {
        company_id,
        code,
      },
    });
  }

  async create(
    data: Prisma.promotion_typesUncheckedCreateInput,
  ): Promise<PromotionType> {
    return this.prisma.promotion_types.create({ data });
  }
}

