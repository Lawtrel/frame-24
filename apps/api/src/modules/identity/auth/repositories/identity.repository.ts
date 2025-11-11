import { Injectable } from '@nestjs/common';
import { identities, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class IdentityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findById(id: string): Promise<identities | null> {
    return this.prisma.identities.findUnique({
      where: { id },
      include: { persons: true },
    });
  }

  async findByEmail(email: string): Promise<identities | null> {
    return this.prisma.identities.findFirst({
      where: { email },
      include: { persons: true },
    });
  }

  async findByEmailAndCompany(
    email: string,
    company_id?: string,
    identityType?: 'EMPLOYEE' | 'CUSTOMER' | 'SYSTEM',
  ): Promise<identities | null> {
    const companyUser = await this.prisma.company_users.findFirst({
      where: {
        ...(company_id && { company_id }),
        identities: {
          email,
          ...(identityType && { identity_type: identityType }),
        },
      },
      include: {
        identities: {
          include: { persons: true },
        },
      },
    });

    return companyUser?.identities ?? null;
  }

  async findByVerificationToken(token: string) {
    return this.prisma.identities.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expires_at: {
          gte: new Date(),
        },
      },
    });
  }

  async findByPasswordResetToken(token: string) {
    return this.prisma.identities.findFirst({
      where: {
        reset_token: token,
        reset_token_expires_at: {
          gte: new Date(),
        },
      },
    });
  }

  async create(data: Prisma.identitiesCreateInput): Promise<identities> {
    return this.prisma.identities.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
      include: { persons: true },
    });
  }

  async update(
    id: string,
    data: Prisma.identitiesUpdateInput,
  ): Promise<identities> {
    return this.prisma.identities.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<identities> {
    return this.prisma.identities.delete({
      where: { id },
    });
  }
}
