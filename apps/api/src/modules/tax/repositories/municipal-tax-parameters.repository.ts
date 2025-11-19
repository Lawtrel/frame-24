import { Injectable } from '@nestjs/common';
import { municipal_tax_parameters } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MunicipalTaxParametersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByCompanyAndIbge(
    companyId: string,
    ibgeCode: string,
    date: Date,
  ): Promise<municipal_tax_parameters | null> {
    return this.prisma.municipal_tax_parameters.findFirst({
      where: {
        company_id: companyId,
        ibge_municipality_code: ibgeCode,
        active: true,
        validity_start: { lte: date },
        OR: [{ validity_end: { gte: date } }, { validity_end: null }],
      },
      orderBy: { validity_start: 'desc' },
    });
  }
}
