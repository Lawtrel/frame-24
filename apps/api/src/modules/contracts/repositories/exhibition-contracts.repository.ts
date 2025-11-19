import { Injectable } from '@nestjs/common';
import { exhibition_contracts, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExhibitionContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveContract(
    movieId: string,
    cinemaComplexId: string,
    date: Date,
  ): Promise<exhibition_contracts | null> {
    return this.prisma.exhibition_contracts.findFirst({
      where: {
        movie_id: movieId,
        cinema_complex_id: cinemaComplexId,
        active: true,
        start_date: { lte: date },
        OR: [{ end_date: { gte: date } }, { end_date: undefined }],
      },
      include: {
        contract_types: true,
      },
    });
  }

  async findById(id: string): Promise<exhibition_contracts | null> {
    return this.prisma.exhibition_contracts.findUnique({
      where: { id },
      include: {
        contract_types: true,
      },
    });
  }

  async findAll(
    where: Prisma.exhibition_contractsWhereInput,
  ): Promise<exhibition_contracts[]> {
    return this.prisma.exhibition_contracts.findMany({ where });
  }
}
