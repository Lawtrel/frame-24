import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AccountsPayableRepository } from '../repositories/accounts-payable.repository';
import { CreateAccountPayableDto } from '../dto/create-account-payable.dto';
import { UpdateAccountPayableDto } from '../dto/update-account-payable.dto';
import { AccountPayableQueryDto } from '../dto/account-payable-query.dto';

@Injectable()
export class AccountsPayableService {
  constructor(private readonly repository: AccountsPayableRepository) {}

  async create(company_id: string, dto: CreateAccountPayableDto) {
    return this.repository.create(company_id, dto);
  }

  async findAll(company_id: string, query: AccountPayableQueryDto) {
    return this.repository.findAll(company_id, query);
  }

  async findOne(id: string, company_id: string) {
    const account = await this.repository.findById(id, company_id);
    if (!account) {
      throw new NotFoundException('Account payable not found');
    }
    return account;
  }

  async update(id: string, company_id: string, dto: UpdateAccountPayableDto) {
    const account = await this.findOne(id, company_id);

    if (account.status === 'paid' || account.status === 'cancelled') {
      throw new BadRequestException('Cannot update paid or cancelled accounts');
    }

    return this.repository.update(id, company_id, dto);
  }
}
