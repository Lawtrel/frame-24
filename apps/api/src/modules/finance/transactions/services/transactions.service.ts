import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { AccountsReceivableRepository } from 'src/modules/finance/accounts-receivable/repositories/accounts-receivable.repository';
import { AccountsPayableRepository } from 'src/modules/finance/accounts-payable/repositories/accounts-payable.repository';
import { CashFlowEntriesService } from 'src/modules/finance/cash-flow/services/cash-flow-entries.service';
import { CreateReceivableTransactionDto } from '../dto/create-receivable-transaction.dto';
import { CreatePayableTransactionDto } from '../dto/create-payable-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
    private readonly receivablesRepository: AccountsReceivableRepository,
    private readonly payablesRepository: AccountsPayableRepository,
    private readonly cashFlowService: CashFlowEntriesService,
  ) {}

  @Transactional()
  async settleReceivable(
    company_id: string,
    user_id: string,
    dto: CreateReceivableTransactionDto,
  ) {
    const account = await this.receivablesRepository.findById(
      dto.account_receivable_id,
      company_id,
    );

    if (!account) {
      throw new NotFoundException('Account receivable not found');
    }

    if (account.status === 'paid' || account.status === 'cancelled') {
      throw new BadRequestException('Account is already paid or cancelled');
    }

    // Create transaction record
    const transaction = await this.prisma.receivable_transactions.create({
      data: {
        id: this.snowflake.generate(),
        account_receivable_id: dto.account_receivable_id,
        transaction_date: new Date(dto.transaction_date),
        amount: dto.amount,
        bank_account_id: dto.bank_account_id,
        payment_method: dto.payment_method,
        notes: dto.notes,
      },
    });

    // Update account balance and status
    const newPaidAmount = Number(account.paid_amount) + dto.amount;
    const newRemainingAmount = Number(account.remaining_amount) - dto.amount;

    let newStatus = account.status;
    if (newRemainingAmount <= 0) {
      newStatus = 'paid';
    } else {
      newStatus = 'partially_paid';
    }

    await this.receivablesRepository.updateStatus(
      account.id,
      newStatus,
      newPaidAmount,
      newRemainingAmount > 0 ? newRemainingAmount : 0,
    );

    // Create Cash Flow Entry
    await this.cashFlowService.create(company_id, user_id, {
      bank_account_id: dto.bank_account_id,
      cinema_complex_id: account.cinema_complex_id || undefined,
      entry_type: 'receipt',
      category: 'receivable_settlement',
      amount: dto.amount,
      entry_date: dto.transaction_date,
      competence_date: account.competence_date.toISOString().split('T')[0],
      description: `Recebimento - Ref. ${account.document_number}`,
      document_number: account.document_number,
      source_type: 'ACCOUNT_RECEIVABLE',
      source_id: account.id,
      status: 'confirmed', // Settlement implies confirmed payment
      counterpart_type: 'CUSTOMER',
      counterpart_id: account.customer_id || undefined,
    });

    return transaction;
  }

  @Transactional()
  async settlePayable(
    company_id: string,
    user_id: string,
    dto: CreatePayableTransactionDto,
  ) {
    const account = await this.payablesRepository.findById(
      dto.account_payable_id,
      company_id,
    );

    if (!account) {
      throw new NotFoundException('Account payable not found');
    }

    if (account.status === 'paid' || account.status === 'cancelled') {
      throw new BadRequestException('Account is already paid or cancelled');
    }

    // Create transaction record
    const transaction = await this.prisma.payable_transactions.create({
      data: {
        id: this.snowflake.generate(),
        account_payable_id: dto.account_payable_id,
        transaction_date: new Date(dto.transaction_date),
        amount: dto.amount,
        bank_account_id: dto.bank_account_id,
        payment_method: dto.payment_method,
        notes: dto.notes,
      },
    });

    // Update account balance and status
    const newPaidAmount = Number(account.paid_amount) + dto.amount;
    const newRemainingAmount = Number(account.remaining_amount) - dto.amount;

    let newStatus = account.status;
    if (newRemainingAmount <= 0) {
      newStatus = 'paid';
    } else {
      newStatus = 'partially_paid';
    }

    await this.payablesRepository.updateStatus(
      account.id,
      newStatus,
      newPaidAmount,
      newRemainingAmount > 0 ? newRemainingAmount : 0,
    );

    // Create Cash Flow Entry
    await this.cashFlowService.create(company_id, user_id, {
      bank_account_id: dto.bank_account_id,
      cinema_complex_id: account.cinema_complex_id || undefined,
      entry_type: 'payment',
      category: 'payable_settlement',
      amount: dto.amount,
      entry_date: dto.transaction_date,
      competence_date: account.competence_date.toISOString().split('T')[0],
      description: `Pagamento - Ref. ${account.document_number}`,
      document_number: account.document_number,
      source_type: 'ACCOUNT_PAYABLE',
      source_id: account.id,
      status: 'confirmed',
      counterpart_type: 'SUPPLIER',
      counterpart_id: account.supplier_id || undefined,
    });

    return transaction;
  }
}
