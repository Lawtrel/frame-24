import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AccountsReceivableRepository } from '../repositories/accounts-receivable.repository';
import { CreateAccountReceivableDto } from '../dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from '../dto/update-account-receivable.dto';
import { AccountReceivableQueryDto } from '../dto/account-receivable-query.dto';

@Injectable()
export class AccountsReceivableService {
  constructor(private readonly repository: AccountsReceivableRepository) {}

  async create(company_id: string, dto: CreateAccountReceivableDto) {
    return this.repository.create(company_id, dto);
  }

  async findAll(company_id: string, query: AccountReceivableQueryDto) {
    return this.repository.findAll(company_id, query);
  }

  async findOne(id: string, company_id: string) {
    const account = await this.repository.findById(id, company_id);
    if (!account) {
      throw new NotFoundException('Account receivable not found');
    }
    return account;
  }

  async update(
    id: string,
    company_id: string,
    dto: UpdateAccountReceivableDto,
  ) {
    const account = await this.findOne(id, company_id);

    if (account.status === 'paid' || account.status === 'cancelled') {
      throw new BadRequestException('Cannot update paid or cancelled accounts');
    }

    return this.repository.update(id, company_id, dto);
  }
}
