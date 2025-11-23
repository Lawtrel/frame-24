import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BankAccountsRepository } from '../repositories/bank-accounts.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly repository: BankAccountsRepository,
    private readonly snowflake: SnowflakeService,
  ) {}

  async create(companyId: string, dto: CreateBankAccountDto) {
    const id = this.snowflake.generate().toString();

    return this.repository.create({
      id,
      company_id: companyId,
      bank_name: dto.bank_name,
      bank_code: dto.bank_code,
      agency: dto.agency,
      agency_digit: dto.agency_digit,
      account_number: dto.account_number,
      account_digit: dto.account_digit,
      account_type: dto.account_type,
      initial_balance: dto.initial_balance || 0,
      current_balance: dto.initial_balance || 0,
      description: dto.description,
      active: true,
    });
  }

  async findAll(companyId: string, activeOnly = true) {
    return this.repository.findAll(companyId, activeOnly);
  }

  async findOne(id: string, companyId: string) {
    const account = await this.repository.findById(id, companyId);

    if (!account) {
      throw new NotFoundException('Bank account not found');
    }

    return account;
  }

  async update(id: string, companyId: string, dto: UpdateBankAccountDto) {
    const account = await this.findOne(id, companyId);

    const result = await this.repository.update(id, companyId, {
      ...(dto.bank_name && { bank_name: dto.bank_name }),
      ...(dto.bank_code !== undefined && { bank_code: dto.bank_code }),
      ...(dto.agency && { agency: dto.agency }),
      ...(dto.agency_digit !== undefined && { agency_digit: dto.agency_digit }),
      ...(dto.account_number && { account_number: dto.account_number }),
      ...(dto.account_digit !== undefined && {
        account_digit: dto.account_digit,
      }),
      ...(dto.account_type && { account_type: dto.account_type }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.active !== undefined && { active: dto.active }),
    });

    if (result.count === 0) {
      throw new BadRequestException('Failed to update bank account');
    }

    return this.findOne(id, companyId);
  }

  async delete(id: string, companyId: string) {
    await this.findOne(id, companyId);

    return this.repository.update(id, companyId, {
      active: false,
    });
  }

  async getBalance(id: string, companyId: string) {
    await this.findOne(id, companyId);

    const balance = await this.repository.getBalance(id);

    return {
      bank_account_id: id,
      current_balance: balance,
    };
  }
}
