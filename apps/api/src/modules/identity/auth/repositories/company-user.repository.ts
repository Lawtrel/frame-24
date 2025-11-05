import { Injectable } from '@nestjs/common';
import { company_users, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

export type CompanyUserWithRelations = Prisma.company_usersGetPayload<{
  include: {
    identities: {
      include: {
        persons: true;
      };
    };
    custom_roles: true;
  };
}>;

@Injectable()
export class CompanyUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findByIdentityAndCompany(
    identity_id: string,
    company_id?: string,
  ): Promise<CompanyUserWithRelations | null> {
    return this.prisma.company_users.findFirst({
      where: {
        identity_id,
        ...(company_id && { company_id }),
        active: true,
      },
      include: {
        custom_roles: true,
        identities: {
          include: {
            persons: true,
          },
        },
      },
    });
  }

  async findByEmployeeIdAndCompany(
    employee_id: string,
    company_id: string,
  ): Promise<CompanyUserWithRelations | null> {
    return this.prisma.company_users.findFirst({
      where: {
        employee_id,
        company_id,
        identities: {
          identity_type: 'EMPLOYEE',
        },
      },
      include: {
        custom_roles: true,
        identities: {
          include: {
            persons: true,
          },
        },
      },
    });
  }

  async findAllByCompany(
    company_id: string,
  ): Promise<CompanyUserWithRelations[]> {
    return this.prisma.company_users.findMany({
      where: { company_id },
      include: {
        custom_roles: true,
        identities: {
          include: {
            persons: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async create(
    data: Prisma.company_usersCreateInput,
  ): Promise<CompanyUserWithRelations> {
    return this.prisma.company_users.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
      include: {
        custom_roles: true,
        identities: {
          include: {
            persons: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.company_usersUpdateInput,
  ): Promise<CompanyUserWithRelations> {
    return this.prisma.company_users.update({
      where: { id },
      data,
      include: {
        custom_roles: true,
        identities: {
          include: {
            persons: true,
          },
        },
      },
    });
  }

  async softDelete(id: string): Promise<CompanyUserWithRelations> {
    return this.update(id, {
      active: false,
      end_date: new Date(),
    });
  }

  async delete(id: string): Promise<company_users> {
    return this.prisma.company_users.delete({
      where: { id },
    });
  }
}
