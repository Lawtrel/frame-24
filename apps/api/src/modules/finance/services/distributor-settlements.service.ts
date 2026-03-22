import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TenantContextService } from 'src/common/services/tenant-context.service';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { todayISO } from 'src/common/utils/date.util';
import { CreateDistributorSettlementDto } from '../dto/create-distributor-settlement.dto';

import { AccountsPayableService } from '../accounts-payable/services/accounts-payable.service';

type FindDistributorSettlementsForCompanyInput = {
  companyId: string;
  cinemaComplexId?: string;
};

type CreateDistributorSettlementForCompanyInput = {
  companyId: string;
  dto: CreateDistributorSettlementDto;
};

@Injectable()
export class DistributorSettlementsService {
  private readonly logger = new Logger(DistributorSettlementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
    private readonly accountsPayableService: AccountsPayableService,
    private readonly tenantContext: TenantContextService,
  ) {}

  private async ensureComplexBelongsToCompany(
    cinemaComplexId: string,
    companyId: string,
  ) {
    const complex = await this.prisma.cinema_complexes.findFirst({
      where: { id: cinemaComplexId, company_id: companyId },
    });

    if (!complex) {
      throw new NotFoundException('Complexo não pertence à empresa');
    }
  }

  private async ensureContractBelongsToCompany(
    contractId: string,
    companyId: string,
  ) {
    const contract = await this.prisma.exhibition_contracts.findFirst({
      where: { id: contractId },
      select: { cinema_complex_id: true },
    });

    if (!contract) {
      throw new NotFoundException('Contrato não pertence à empresa');
    }

    await this.ensureComplexBelongsToCompany(
      contract.cinema_complex_id,
      companyId,
    );
  }

  private async ensureDistributorBelongsToCompany(
    distributorId: string,
    companyId: string,
  ) {
    const distributor = await this.prisma.suppliers.findFirst({
      where: { id: distributorId, company_id: companyId },
    });

    if (!distributor) {
      throw new NotFoundException('Distribuidor não pertence à empresa');
    }
  }

  private async getCompanyComplexIds(companyId: string): Promise<string[]> {
    const complexes = await this.prisma.cinema_complexes.findMany({
      where: { company_id: companyId },
      select: { id: true },
    });
    return complexes.map((c) => c.id);
  }

  private async getCompanyContractIds(companyId: string): Promise<string[]> {
    const complexIds = await this.getCompanyComplexIds(companyId);

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

  async findAll(cinemaComplexId?: string) {
    return this.findAllForCompany({
      companyId: this.tenantContext.getCompanyId(),
      cinemaComplexId,
    });
  }

  async findAllForCompany(input: FindDistributorSettlementsForCompanyInput) {
    const { companyId, cinemaComplexId } = input;
    const complexIds = await this.getCompanyComplexIds(companyId);
    const contractIds = await this.getCompanyContractIds(companyId);

    return this.prisma.distributor_settlements.findMany({
      where: {
        cinema_complex_id: cinemaComplexId || { in: complexIds },
        contract_id: { in: contractIds },
      },
      orderBy: {
        competence_start_date: 'desc',
      },
    });
  }

  async create(dto: CreateDistributorSettlementDto) {
    return this.createForCompany({
      companyId: this.tenantContext.getCompanyId(),
      dto,
    });
  }

  async createForCompany(input: CreateDistributorSettlementForCompanyInput) {
    const { companyId, dto } = input;
    await this.ensureContractBelongsToCompany(dto.contract_id, companyId);
    await this.ensureDistributorBelongsToCompany(dto.distributor_id, companyId);
    await this.ensureComplexBelongsToCompany(dto.cinema_complex_id, companyId);

    const gross = dto.gross_box_office_revenue;
    const distributorPercentage = dto.distributor_percentage / 100;
    const calculatedAmount = Number((gross * distributorPercentage).toFixed(2));
    const deductions = dto.deductions_amount || 0;
    const taxes = dto.taxes_deducted_amount || 0;
    const finalAmount = Math.max(calculatedAmount - deductions, 0);
    const netAmount = Math.max(finalAmount - taxes, 0);

    const settlement = await this.prisma.distributor_settlements.create({
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
      },
    });

    // Create Account Payable
    try {
      if (netAmount > 0) {
        await this.accountsPayableService.createForCompany({
          companyId,
          dto: {
            cinema_complex_id: dto.cinema_complex_id,
            supplier_id: dto.distributor_id,
            source_type: 'distributor_settlement',
            source_id: settlement.id,
            document_number: `SETT-${settlement.id.substring(0, 8)}`,
            description: `Acerto Distribuidor - Contrato ${dto.contract_id}`,
            issue_date: todayISO(),
            due_date: new Date(dto.competence_end_date)
              .toISOString()
              .split('T')[0], // Assuming due date is end of competence
            competence_date: new Date(dto.competence_start_date)
              .toISOString()
              .split('T')[0],
            original_amount: netAmount,
            interest_amount: 0,
            penalty_amount: 0,
            discount_amount: 0,
          },
        });
      }
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error('Erro ao criar conta a pagar para acerto', stack);
      // Não falha a criação do acerto em caso de erro no contas a pagar
    }

    return settlement;
  }
}
