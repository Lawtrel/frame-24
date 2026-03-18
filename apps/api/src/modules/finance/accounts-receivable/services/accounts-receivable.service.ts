import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { accounts_receivable, Prisma } from '@repo/db';
import { ClsService } from 'nestjs-cls';
import { AccountsReceivableRepository } from '../repositories/accounts-receivable.repository';
import { CreateAccountReceivableDto } from '../dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from '../dto/update-account-receivable.dto';
import { AccountReceivableQueryDto } from '../dto/account-receivable-query.dto';

type AccountsReceivableWithTransactions = Prisma.accounts_receivableGetPayload<{
  include: { transactions: true };
}>;

type AccountsReceivableListResponse = {
  data: accounts_receivable[];
  meta: { total: number; page: number; per_page: number; last_page: number };
};

type CreateAccountReceivableForCompanyInput = {
  companyId: string;
  dto: CreateAccountReceivableDto;
};

@Injectable()
export class AccountsReceivableService {
  constructor(
    private readonly repository: AccountsReceivableRepository,
    private readonly cls: ClsService,
  ) {}

  private getCompanyId(): string {
    const companyId = this.cls.get<string>('companyId');
    if (!companyId) {
      throw new ForbiddenException('Contexto da empresa não encontrado.');
    }
    return companyId;
  }

  async create(dto: CreateAccountReceivableDto): Promise<accounts_receivable> {
    return this.createForCompany({ companyId: this.getCompanyId(), dto });
  }

  async createForCompany(
    input: CreateAccountReceivableForCompanyInput,
  ): Promise<accounts_receivable> {
    const { companyId, dto } = input;
    return this.repository.create(companyId, dto);
  }

  async findAll(
    query: AccountReceivableQueryDto,
  ): Promise<AccountsReceivableListResponse> {
    return this.repository.findAll(this.getCompanyId(), query);
  }

  private async findOneByCompany(
    companyId: string,
    id: string,
  ): Promise<AccountsReceivableWithTransactions> {
    const account = await this.repository.findById(id, companyId);
    if (!account) {
      throw new NotFoundException('Account receivable not found');
    }
    return account;
  }

  async findOne(id: string): Promise<AccountsReceivableWithTransactions> {
    return this.findOneByCompany(this.getCompanyId(), id);
  }

  async update(
    id: string,
    payload: UpdateAccountReceivableDto,
  ): Promise<accounts_receivable> {
    const companyId = this.getCompanyId();
    const account = await this.findOneByCompany(companyId, id);

    if (account.status === 'paid' || account.status === 'cancelled') {
      throw new BadRequestException('Cannot update paid or cancelled accounts');
    }

    return this.repository.update(id, payload);
  }
}
