import { Injectable } from '@nestjs/common';
import { persons, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Injectable()
export class PersonRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snowflake: SnowflakeService,
  ) {}

  async findById(id: string): Promise<persons | null> {
    return this.prisma.persons.findUnique({
      where: { id },
    });
  }

  async findByCpf(cpf: string): Promise<persons | null> {
    return this.prisma.persons.findUnique({
      where: { cpf },
    });
  }

  async create(data: Prisma.personsCreateInput): Promise<persons> {
    return this.prisma.persons.create({
      data: {
        id: this.snowflake.generate(),
        ...data,
      },
    });
  }

  async update(id: string, data: Prisma.personsUpdateInput): Promise<persons> {
    return this.prisma.persons.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<persons> {
    return this.prisma.persons.delete({
      where: { id },
    });
  }
}
