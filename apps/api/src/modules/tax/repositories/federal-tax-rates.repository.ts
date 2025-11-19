import { Injectable } from '@nestjs/common';
import { federal_tax_rates } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FederalTaxRatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByCompany(
    companyId: string,
    date: Date,
  ): Promise<federal_tax_rates | null> {
    return this.prisma.federal_tax_rates.findFirst({
      where: {
        company_id: companyId,
        active: true,
        validity_start: { lte: date },
        OR: [{ validity_end: { gte: date } }, { validity_end: null }],
      },
      orderBy: { validity_start: 'desc' },
    });
  }
}
