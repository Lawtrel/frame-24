import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { audio_types as AudioType } from '@repo/db';

@Injectable()
export class AudioTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AudioType | null> {
    return this.prisma.audio_types.findUnique({
      where: { id },
    });
  }

  async findAllByCompany(company_id: string): Promise<AudioType[]> {
    return this.prisma.audio_types.findMany({
      where: { company_id },
    });
  }
}
