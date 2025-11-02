import { Injectable } from '@nestjs/common';
import { company_users, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class CompanyUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findByIdentityAndCompany(
    identity_id: string,
    company_id?: string,
  ): Promise<company_users | null> {
    return this.prisma.company_users.findFirst({
      where: {
        identity_id,
        ...(company_id && { company_id }),
        active: true,
      },
      include: { custom_roles: true },
    });
  }

  async create(data: Prisma.company_usersCreateInput): Promise<company_users> {
    return this.prisma.company_users.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.company_usersUpdateInput,
  ): Promise<company_users> {
    return this.prisma.company_users.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<company_users> {
    return this.prisma.company_users.delete({
      where: { id },
    });
  }
}
