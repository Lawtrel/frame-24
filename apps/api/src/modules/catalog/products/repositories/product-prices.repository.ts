import { Injectable } from '@nestjs/common';
import { product_prices, Prisma } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductPricesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActivePrice(
    product_id: string,
    complex_id: string | null,
    company_id: string,
    date: Date = new Date(),
  ): Promise<product_prices | null> {
    // Primeiro tenta buscar preço específico do complexo
    if (complex_id) {
      const complexPrice = await this.prisma.product_prices.findFirst({
        where: {
          product_id,
          complex_id,
          company_id,
          active: true,
          valid_from: { lte: date },
          OR: [{ valid_to: null }, { valid_to: { gte: date } }],
        },
        orderBy: {
          valid_from: 'desc',
        },
      });

      if (complexPrice) {
        return complexPrice;
      }
    }

    // Se não encontrou preço específico, busca preço geral (complex_id = null)
    return this.prisma.product_prices.findFirst({
      where: {
        product_id,
        complex_id: null,
        company_id,
        active: true,
        valid_from: { lte: date },
        OR: [{ valid_to: null }, { valid_to: { gte: date } }],
      },
      orderBy: {
        valid_from: 'desc',
      },
    });
  }
}
