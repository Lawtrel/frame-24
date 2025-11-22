import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { CashFlowEntriesRepository } from '../repositories/cash-flow-entries.repository';
import { BankAccountsRepository } from '../repositories/bank-accounts.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateCashFlowEntryDto } from '../dto/create-cash-flow-entry.dto';
import { CashFlowQueryType } from '../dto/cash-flow-query.dto';

@Injectable()
export class CashFlowEntriesService {
  constructor(
    private readonly repository: CashFlowEntriesRepository,
    private readonly bankAccountsRepository: BankAccountsRepository,
    private readonly snowflake: SnowflakeService,
  ) {}

  @Transactional()
  async create(
    companyId: string,
    createdBy: string,
    dto: CreateCashFlowEntryDto,
  ) {
    // Verify bank account exists and belongs to company
    const bankAccount = await this.bankAccountsRepository.findById(
      dto.bank_account_id,
      companyId,
    );

    if (!bankAccount) {
      throw new NotFoundException('Bank account not found');
    }

    if (!bankAccount.active) {
      throw new BadRequestException('Bank account is inactive');
    }

    const id = this.snowflake.generate().toString();

    const entry = await this.repository.create({
      id,
      company_id: companyId,
      cinema_complex_id: dto.cinema_complex_id,
      bank_accounts: {
        connect: { id: dto.bank_account_id },
      },
      entry_type: dto.entry_type,
      category: dto.category,
      amount: dto.amount,
      entry_date: new Date(dto.entry_date),
      competence_date: dto.competence_date
        ? new Date(dto.competence_date)
        : null,
      description: dto.description,
      document_number: dto.document_number,
      source_type: dto.source_type,
      source_id: dto.source_id,
      counterpart_type: dto.counterpart_type,
      counterpart_id: dto.counterpart_id,
      status: dto.status || 'pending',
      reconciled: false,
      created_by: createdBy,
    });

    // If status is confirmed, update bank balance
    if (dto.status === 'confirmed') {
      await this.updateBankBalance(dto.bank_account_id);
    }

    return entry;
  }

  async findAll(companyId: string, query: CashFlowQueryType) {
    const entries = await this.repository.findAll(companyId, {
      bank_account_id: query.bank_account_id,
      entry_type: query.entry_type,
      category: query.category,
      start_date: query.start_date ? new Date(query.start_date) : undefined,
      end_date: query.end_date ? new Date(query.end_date) : undefined,
      status: query.status,
      skip: query.skip,
      take: query.take,
    });

    return {
      entries,
      total: entries.length,
      skip: query.skip || 0,
      take: query.take || 20,
    };
  }

  async findOne(id: string, companyId: string) {
    const entry = await this.repository.findById(id, companyId);

    if (!entry) {
      throw new NotFoundException('Cash flow entry not found');
    }

    return entry;
  }

  @Transactional()
  async delete(id: string, companyId: string) {
    const entry = await this.findOne(id, companyId);

    if (entry.reconciled) {
      throw new BadRequestException('Cannot delete reconciled entry');
    }

    const result = await this.repository.delete(id, companyId);

    if (result.count === 0) {
      throw new BadRequestException('Failed to delete entry');
    }

    return { message: 'Entry deleted successfully' };
  }

  @Transactional()
  async reconcile(id: string, companyId: string) {
    const entry = await this.findOne(id, companyId);

    if (entry.reconciled) {
      throw new BadRequestException('Entry already reconciled');
    }

    await this.repository.reconcile(id, companyId);
    await this.updateBankBalance(entry.bank_account_id);

    return { message: 'Entry reconciled successfully' };
  }

  private async updateBankBalance(bankAccountId: string) {
    const account = await this.bankAccountsRepository.findById(
      bankAccountId,
      '', // Company check not needed here as we already validated
    );

    if (!account) {
      return;
    }

    const { net_balance } =
      await this.repository.calculateBalance(bankAccountId);
    const newBalance = Number(account.initial_balance) + net_balance;

    await this.bankAccountsRepository.updateBalance(bankAccountId, newBalance);
  }
}
