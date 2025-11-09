import { Injectable } from '@nestjs/common';
import { seats, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    data: Prisma.seatsCreateManyInput[],
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.seats.createMany({
      data,
      skipDuplicates: false,
    });
  }

  async findById(id: string): Promise<seats | null> {
    return this.prisma.seats.findUnique({
      where: { id },
    });
  }
  async findByRoomId(room_id: string) {
    return this.prisma.seats.findMany({
      where: { room_id },
      orderBy: [{ row_code: 'asc' }, { column_number: 'asc' }],
    });
  }

  async findManyWithOwnership(
    seatIds: string[],
    companyId: string,
  ): Promise<seats[]> {
    return this.prisma.seats.findMany({
      where: {
        id: { in: seatIds },
        rooms: {
          cinema_complexes: {
            company_id: companyId,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.seatsUpdateInput): Promise<seats> {
    return this.prisma.seats.update({
      where: { id },
      data,
    });
  }

  async updateMany(
    where: Prisma.seatsWhereInput,
    data: Prisma.seatsUpdateInput,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.seats.updateMany({
      where,
      data,
    });
  }

  async deleteMany(
    where: Prisma.seatsWhereInput,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.seats.deleteMany({
      where,
    });
  }
}
