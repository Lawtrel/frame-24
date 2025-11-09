import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { seat_types as SeatType } from '@repo/db';

@Injectable()
export class SeatTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SeatType | null> {
    return this.prisma.seat_types.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: string[], company_id: string): Promise<SeatType[]> {
    return this.prisma.seat_types.findMany({
      where: {
        id: {
          in: ids,
        },
        company_id: company_id,
      },
    });
  }

  async findAllByCompany(company_id: string): Promise<SeatType[]> {
    return this.prisma.seat_types.findMany({
      where: { company_id },
    });
  }
}
