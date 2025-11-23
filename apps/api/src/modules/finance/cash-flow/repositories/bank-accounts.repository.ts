import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@repo/db';

@Injectable()
export class BankAccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.bank_accountsCreateInput) {
    return this.prisma.bank_accounts.create({ data });
  }

  async findAll(companyId: string, activeOnly = true) {
    return this.prisma.bank_accounts.findMany({
      where: {
        company_id: companyId,
        ...(activeOnly && { active: true }),
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string, companyId: string) {
    return this.prisma.bank_accounts.findFirst({
      where: {
        id,
        company_id: companyId,
      },
    });
  }

  async update(
    id: string,
    companyId: string,
    data: Prisma.bank_accountsUpdateInput,
  ) {
    return this.prisma.bank_accounts.updateMany({
      where: {
        id,
        company_id: companyId,
      },
      data,
    });
  }

  async updateBalance(id: string, newBalance: number) {
    return this.prisma.bank_accounts.update({
      where: { id },
      data: { current_balance: newBalance },
    });
  }

  async getBalance(id: string) {
    const account = await this.prisma.bank_accounts.findUnique({
      where: { id },
      select: { current_balance: true },
    });
    return account?.current_balance || 0;
  }
}
