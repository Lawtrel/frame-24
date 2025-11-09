import { Injectable } from '@nestjs/common';
import { Prisma, seat_status as SeatStatus } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeatStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<SeatStatus | null> {
    return this.prisma.seat_status.findUnique({
      where: {
        company_id_name: {
          company_id,
          name,
        },
      },
    });
  }

  async findDefaultByCompany(company_id: string): Promise<SeatStatus | null> {
    return this.prisma.seat_status.findFirst({
      where: {
        company_id,
        is_default: true,
      },
    });
  }
  async findAllByCompany(company_id: string): Promise<SeatStatus[]> {
    return this.prisma.seat_status.findMany({
      where: { company_id },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<SeatStatus | null> {
    return this.prisma.seat_status.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.seat_statusCreateInput): Promise<SeatStatus> {
    return this.prisma.seat_status.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.seat_statusUpdateInput,
  ): Promise<SeatStatus> {
    return this.prisma.seat_status.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<SeatStatus> {
    return this.prisma.seat_status.delete({
      where: { id },
    });
  }
}
