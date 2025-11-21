import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FinanceReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseMonth(month: string): {
    start: Date;
    end: Date;
    year: number;
    monthNumber: number;
  } {
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNumber = parseInt(monthStr, 10);
    if (
      isNaN(year) ||
      isNaN(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      throw new BadRequestException('Formato de mês inválido. Use YYYY-MM.');
    }
    const start = new Date(Date.UTC(year, monthNumber - 1, 1));
    const end = new Date(Date.UTC(year, monthNumber, 0, 23, 59, 59, 999));
    return { start, end, year, monthNumber };
  }

  private async getCompanyComplexIds(company_id: string): Promise<string[]> {
    const complexes = await this.prisma.cinema_complexes.findMany({
      where: { company_id },
      select: { id: true },
    });
    return complexes.map((c) => c.id);
  }

  async getIncomeStatement(company_id: string, month: string) {
    const { start, end, year, monthNumber } = this.parseMonth(month);
    const complexIds = await this.getCompanyComplexIds(company_id);

    if (complexIds.length === 0) {
      return {
        period: `${year}-${String(monthNumber).padStart(2, '0')}`,
        gross_revenue: 0,
        discounts: 0,
        net_revenue: 0,
        distributor_payouts: 0,
        taxes: 0,
        operational_result: 0,
      };
    }

    const salesAggregate = await this.prisma.sales.aggregate({
      _sum: {
        total_amount: true,
        discount_amount: true,
        net_amount: true,
      },
      where: {
        cinema_complex_id: { in: complexIds },
        sale_date: {
          gte: start,
          lte: end,
        },
      },
    });

    const settlementsAggregate =
      await this.prisma.distributor_settlements.aggregate({
        _sum: {
          net_payment_amount: true,
        },
        where: {
          cinema_complex_id: { in: complexIds },
          competence_start_date: { lte: end },
          competence_end_date: { gte: start },
        },
      });

    const taxAggregate = await this.prisma.tax_entries.aggregate({
      _sum: {
        iss_amount: true,
        pis_amount_payable: true,
        cofins_amount_payable: true,
      },
      where: {
        cinema_complex_id: { in: complexIds },
        competence_date: {
          gte: start,
          lte: end,
        },
      },
    });

    const grossRevenue = Number(salesAggregate._sum.total_amount || 0);
    const discounts = Number(salesAggregate._sum.discount_amount || 0);
    const netRevenue = Number(salesAggregate._sum.net_amount || 0);
    const distributorPayouts = Number(
      settlementsAggregate._sum.net_payment_amount || 0,
    );
    const taxes =
      Number(taxAggregate._sum.iss_amount || 0) +
      Number(taxAggregate._sum.pis_amount_payable || 0) +
      Number(taxAggregate._sum.cofins_amount_payable || 0);

    return {
      period: `${year}-${String(monthNumber).padStart(2, '0')}`,
      gross_revenue: grossRevenue,
      discounts,
      net_revenue: netRevenue,
      distributor_payouts: distributorPayouts,
      taxes,
      operational_result: netRevenue - distributorPayouts - taxes,
    };
  }
}
