import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';

@Injectable()
export class JournalEntriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  private async getCompanyComplexIds(company_id: string): Promise<string[]> {
    const complexes = await this.prisma.cinema_complexes.findMany({
      where: { company_id },
      select: { id: true },
    });
    return complexes.map((c) => c.id);
  }

  private async ensureComplexBelongsToCompany(
    cinema_complex_id: string,
    company_id: string,
  ) {
    const complex = await this.prisma.cinema_complexes.findFirst({
      where: { id: cinema_complex_id, company_id },
    });

    if (!complex) {
      throw new NotFoundException('Complexo de cinema não pertence à empresa.');
    }
  }

  private async ensureAccountsBelongToCompany(
    company_id: string,
    items: CreateJournalEntryDto['items'],
  ) {
    const accountIds = [...new Set(items.map((item) => item.account_id))];
    const accounts = await this.prisma.chart_of_accounts.findMany({
      where: {
        id: { in: accountIds },
        company_id,
      },
      select: { id: true },
    });

    if (accounts.length !== accountIds.length) {
      throw new BadRequestException(
        'Uma ou mais contas não pertencem à empresa',
      );
    }
  }

  private async generateEntryNumber(company_id: string): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const prefix = `JE-${year}${month}${day}`;

    const complexIds = await this.getCompanyComplexIds(company_id);

    const count = await this.prisma.journal_entries.count({
      where: {
        cinema_complex_id: { in: complexIds },
        entry_number: { startsWith: prefix },
      },
    });

    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }

  async create(company_id: string, dto: CreateJournalEntryDto) {
    await this.ensureComplexBelongsToCompany(dto.cinema_complex_id, company_id);
    await this.ensureAccountsBelongToCompany(company_id, dto.items);

    const debitTotal = dto.items
      .filter((i) => i.movement_type === 'DEBIT')
      .reduce((sum, item) => sum + item.amount, 0);
    const creditTotal = dto.items
      .filter((i) => i.movement_type === 'CREDIT')
      .reduce((sum, item) => sum + item.amount, 0);

    if (debitTotal.toFixed(2) !== creditTotal.toFixed(2)) {
      throw new BadRequestException(
        'Lançamento contábil desequilibrado: débitos precisam ser iguais aos créditos.',
      );
    }

    const entryId = this.snowflake.generate();
    const entryNumber = await this.generateEntryNumber(company_id);

    await this.prisma.journal_entries.create({
      data: {
        id: entryId,
        cinema_complex_id: dto.cinema_complex_id,
        entry_number: entryNumber,
        entry_date: new Date(dto.entry_date),
        description: dto.description,
        origin_type: dto.origin_type,
        origin_id: dto.origin_id,
        total_amount: debitTotal,
        journal_entry_items: {
          create: dto.items.map((item) => ({
            id: this.snowflake.generate(),
            account_id: item.account_id,
            movement_type: item.movement_type,
            amount: item.amount,
            item_description: item.item_description,
          })),
        },
      },
    });

    return this.prisma.journal_entries.findUnique({
      where: { id: entryId },
      include: { journal_entry_items: true },
    });
  }

  async findAll(
    company_id: string,
    filters?: {
      cinema_complex_id?: string;
      start_date?: string;
      end_date?: string;
    },
  ) {
    const complexIds = await this.getCompanyComplexIds(company_id);

    const where: any = {
      cinema_complex_id: {
        in: complexIds,
      },
    };

    if (filters?.cinema_complex_id) {
      where.cinema_complex_id = filters.cinema_complex_id;
    }

    if (filters?.start_date && filters?.end_date) {
      where.entry_date = {
        gte: new Date(filters.start_date),
        lte: new Date(filters.end_date),
      };
    }

    return this.prisma.journal_entries.findMany({
      where,
      include: { journal_entry_items: true },
      orderBy: { entry_date: 'desc' },
    });
  }
}
