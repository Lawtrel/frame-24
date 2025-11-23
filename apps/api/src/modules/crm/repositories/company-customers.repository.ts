import { Injectable } from '@nestjs/common';
import { company_customers, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class CompanyCustomersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findByCompanyAndCustomer(
    company_id: string,
    customer_id: string,
  ): Promise<company_customers | null> {
    return this.prisma.company_customers.findUnique({
      where: {
        company_id_customer_id: {
          company_id,
          customer_id,
        },
      },
    });
  }

  async create(
    data: Prisma.company_customersCreateInput,
  ): Promise<company_customers> {
    return this.prisma.company_customers.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
    });
  }

  async update(
    company_id: string,
    customer_id: string,
    data: Prisma.company_customersUpdateInput,
  ): Promise<company_customers> {
    return this.prisma.company_customers.update({
      where: {
        company_id_customer_id: {
          company_id,
          customer_id,
        },
      },
      data,
    });
  }
}
