import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Converte uma string para um formato de slug básico (lowercase, sem acentos, hifenizado)
   */
  generateBase(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Gera um slug único consultando o banco de dados.
   * @param model Prisma model delegate (ex: this.prisma.movies)
   * @param text Texto base para o slug
   * @param excludeId Opcional ID para ignorar na busca (útil em updates)
   * @param slugField Nome do campo de slug no modelo (default: 'slug')
   * @param extraCriteria Critérios extras para a busca (ex: { company_id: '...' })
   */
  async createUniqueSlug(
    model: any,
    text: string,
    excludeId?: string,
    slugField: string = 'slug',
    extraCriteria?: Record<string, any>,
  ): Promise<string> {
    const base = this.generateBase(text);

    const existsBase = await model.findFirst({
      where: {
        [slugField]: base,
        ...(excludeId && { id: { not: excludeId } }),
        ...extraCriteria,
      },
      select: { id: true },
    });
    if (!existsBase) return base;

    for (let i = 1; i <= 1000; i++) {
      const candidate = `${base}-${i}`;
      const exists = await model.findFirst({
        where: {
          [slugField]: candidate,
          ...(excludeId && { id: { not: excludeId } }),
          ...extraCriteria,
        },
        select: { id: true },
      });
      if (!exists) return candidate;
    }

    throw new Error(
      'Não foi possível gerar um slug único após várias tentativas.',
    );
  }
}
