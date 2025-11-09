import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { projection_types as ProjectionType } from '@repo/db';

@Injectable()
export class ProjectionTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProjectionType | null> {
    return this.prisma.projection_types.findUnique({
      where: { id },
    });
  }

  async findAllByCompany(company_id: string): Promise<ProjectionType[]> {
    return this.prisma.projection_types.findMany({
      where: { company_id },
    });
  }
}
