import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountReceivableDto } from '../dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from '../dto/update-account-receivable.dto';
import { AccountReceivableQueryDto } from '../dto/account-receivable-query.dto';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class AccountsReceivableRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async create(company_id: string, dto: CreateAccountReceivableDto) {
    const remaining_amount =
      dto.original_amount +
      (dto.interest_amount || 0) +
      (dto.penalty_amount || 0) -
      (dto.discount_amount || 0);

    return this.prisma.accounts_receivable.create({
      data: {
        id: this.snowflake.generate(),
        company_id,
        ...(dto as any),
        issue_date: new Date(dto.issue_date),
        due_date: new Date(dto.due_date),
        competence_date: new Date(dto.competence_date),
        remaining_amount,
        status: 'pending',
      },
    });
  }

  async findAll(company_id: string, query: AccountReceivableQueryDto) {
    const where: any = { company_id };

    if (query.cinema_complex_id) {
      where.cinema_complex_id = query.cinema_complex_id;
    }

    if (query.customer_id) {
      where.customer_id = query.customer_id;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.start_due_date && query.end_due_date) {
      where.due_date = {
        gte: new Date(query.start_due_date),
        lte: new Date(query.end_due_date),
      };
    }

    const skip = (query.page - 1) * query.per_page;

    const [total, data] = await Promise.all([
      this.prisma.accounts_receivable.count({ where }),
      this.prisma.accounts_receivable.findMany({
        where,
        skip,
        take: query.per_page,
        orderBy: { due_date: 'asc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page: query.page,
        per_page: query.per_page,
        last_page: Math.ceil(total / query.per_page),
      },
    };
  }

  async findById(id: string, company_id: string) {
    return this.prisma.accounts_receivable.findFirst({
      where: { id, company_id },
      include: { transactions: true },
    });
  }

  async update(
    id: string,
    company_id: string,
    dto: UpdateAccountReceivableDto,
  ) {
    const data: any = { ...dto };

    if (dto.issue_date) data.issue_date = new Date(dto.issue_date);
    if (dto.due_date) data.due_date = new Date(dto.due_date);
    if (dto.competence_date)
      data.competence_date = new Date(dto.competence_date);

    return this.prisma.accounts_receivable.update({
      where: { id },
      data: data as any,
    });
  }

  async updateStatus(
    id: string,
    status: string,
    paid_amount: number,
    remaining_amount: number,
  ) {
    return this.prisma.accounts_receivable.update({
      where: { id },
      data: { status, paid_amount, remaining_amount },
    });
  }
}
