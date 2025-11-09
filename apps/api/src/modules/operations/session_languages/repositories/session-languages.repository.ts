import { Injectable } from '@nestjs/common';
import { Prisma, session_languages as SessionLanguage } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionLanguagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNameAndCompany(
    name: string,
    company_id: string,
  ): Promise<SessionLanguage | null> {
    return this.prisma.session_languages.findUnique({
      where: {
        company_id_name: {
          company_id,
          name,
        },
      },
    });
  }

  async findAllByCompany(company_id: string): Promise<SessionLanguage[]> {
    return this.prisma.session_languages.findMany({
      where: { company_id },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<SessionLanguage | null> {
    return this.prisma.session_languages.findUnique({
      where: { id },
    });
  }

  async create(
    data: Prisma.session_languagesCreateInput,
  ): Promise<SessionLanguage> {
    return this.prisma.session_languages.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.session_languagesUpdateInput,
  ): Promise<SessionLanguage> {
    return this.prisma.session_languages.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<SessionLanguage> {
    return this.prisma.session_languages.delete({
      where: { id },
    });
  }
}
