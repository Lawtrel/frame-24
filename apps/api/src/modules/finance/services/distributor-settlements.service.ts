import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateDistributorSettlementDto } from '../dto/create-distributor-settlement.dto';

@Injectable()
export class DistributorSettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  private async ensureComplexBelongsToCompany(
    cinema_complex_id: string,
    company_id: string,
  ) {
    const complex = await this.prisma.cinema_complexes.findFirst({
      where: { id: cinema_complex_id, company_id },
    });

    if (!complex) {
      throw new NotFoundException('Complexo não pertence à empresa');
    }
  }

  private async ensureContractBelongsToCompany(
    contract_id: string,
    company_id: string,
  ) {
    const contract = await this.prisma.exhibition_contracts.findFirst({
      where: { id: contract_id },
      select: { cinema_complex_id: true },
    });

    if (!contract) {
      throw new NotFoundException('Contrato não pertence à empresa');
    }

    await this.ensureComplexBelongsToCompany(
      contract.cinema_complex_id,
      company_id,
    );
  }

  private async ensureDistributorBelongsToCompany(
    distributor_id: string,
    company_id: string,
  ) {
    const distributor = await this.prisma.suppliers.findFirst({
      where: { id: distributor_id, company_id },
    });

    if (!distributor) {
      throw new NotFoundException('Distribuidor não pertence à empresa');
    }
  }

  private async getCompanyComplexIds(company_id: string): Promise<string[]> {
    const complexes = await this.prisma.cinema_complexes.findMany({
      where: { company_id },
      select: { id: true },
    });
    return complexes.map((c) => c.id);
  }

  private async getCompanyContractIds(company_id: string): Promise<string[]> {
    const complexIds = await this.getCompanyComplexIds(company_id);

    if (!complexIds.length) {
      return [];
    }

    const contracts = await this.prisma.exhibition_contracts.findMany({
      where: {
        cinema_complex_id: {
          in: complexIds,
        },
      },
      select: { id: true },
    });
    return contracts.map((c) => c.id);
  }

  async findAll(company_id: string, cinema_complex_id?: string) {
    const complexIds = await this.getCompanyComplexIds(company_id);
    const contractIds = await this.getCompanyContractIds(company_id);

    return this.prisma.distributor_settlements.findMany({
      where: {
        cinema_complex_id: cinema_complex_id || { in: complexIds },
        contract_id: { in: contractIds },
      },
      orderBy: {
        competence_start_date: 'desc',
      },
    });
  }

  async create(company_id: string, dto: CreateDistributorSettlementDto) {
    await this.ensureContractBelongsToCompany(dto.contract_id, company_id);
    await this.ensureDistributorBelongsToCompany(
      dto.distributor_id,
      company_id,
    );
    await this.ensureComplexBelongsToCompany(dto.cinema_complex_id, company_id);

    const gross = dto.gross_box_office_revenue;
    const distributorPercentage = dto.distributor_percentage / 100;
    const calculatedAmount = Number((gross * distributorPercentage).toFixed(2));
    const deductions = dto.deductions_amount || 0;
    const taxes = dto.taxes_deducted_amount || 0;
    const finalAmount = Math.max(calculatedAmount - deductions, 0);
    const netAmount = Math.max(finalAmount - taxes, 0);

    return this.prisma.distributor_settlements.create({
      data: {
        id: this.snowflake.generate(),
        contract_id: dto.contract_id,
        distributor_id: dto.distributor_id,
        cinema_complex_id: dto.cinema_complex_id,
        competence_start_date: new Date(dto.competence_start_date),
        competence_end_date: new Date(dto.competence_end_date),
        gross_box_office_revenue: gross,
        distributor_percentage: dto.distributor_percentage,
        calculated_settlement_amount: calculatedAmount,
        deductions_amount: deductions,
        taxes_deducted_amount: taxes,
        final_settlement_amount: finalAmount,
        net_payment_amount: netAmount,
        settlement_base_amount: finalAmount,
        net_settlement_amount: netAmount,
        notes: dto.notes,
        calculation_date: new Date(),
        status: undefined,
      },
    });
  }
}
