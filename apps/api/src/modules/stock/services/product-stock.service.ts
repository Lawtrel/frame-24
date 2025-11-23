import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStockRepository } from '../repositories/product-stock.repository';
import { ProductStockResponseDto } from '../dto/product-stock-response.dto';
import { ProductRepository } from 'src/modules/catalog/products/repositories/product.repository';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Injectable()
export class ProductStockService {
  constructor(
    private readonly productStockRepository: ProductStockRepository,
    private readonly productsRepository: ProductRepository,
  ) {}

  async findAll(
    user: RequestUser,
    complex_id?: string,
  ): Promise<ProductStockResponseDto[]> {
    const stocks = complex_id
      ? await this.productStockRepository.findByComplexId(
          complex_id,
          user.company_id,
        )
      : [];

    return stocks.map((stock) => this.mapToDto(stock));
  }

  async findOne(
    product_id: string,
    complex_id: string,
    user: RequestUser,
  ): Promise<ProductStockResponseDto> {
    const stock = await this.productStockRepository.findById(
      product_id,
      complex_id,
    );

    if (!stock) {
      // Validar que o produto existe
      const product = await this.productsRepository.findById(
        product_id,
        user.company_id,
      );
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      // Retornar estoque zerado
      return {
        id: '',
        product_id,
        complex_id,
        current_quantity: 0,
        minimum_quantity: product.minimum_stock || 10,
        maximum_quantity: 100,
        location: undefined,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_low_stock: true,
      };
    }

    return this.mapToDto(stock);
  }

  async findLowStock(
    user: RequestUser,
    complex_id?: string,
  ): Promise<ProductStockResponseDto[]> {
    const stocks = await this.productStockRepository.findLowStock(
      user.company_id,
      complex_id,
    );

    return stocks.map((stock) => this.mapToDto(stock));
  }

  private mapToDto(stock: any): ProductStockResponseDto {
    const currentQuantity = stock.current_quantity || 0;
    const minimumQuantity = stock.minimum_quantity || 0;

    return {
      id: stock.id,
      product_id: stock.product_id,
      complex_id: stock.complex_id,
      current_quantity: currentQuantity,
      minimum_quantity: minimumQuantity,
      maximum_quantity: stock.maximum_quantity || 100,
      location: stock.location ?? undefined,
      active: stock.active !== false,
      created_at: stock.created_at?.toISOString() || new Date().toISOString(),
      updated_at: stock.updated_at?.toISOString() || new Date().toISOString(),
      is_low_stock: currentQuantity <= minimumQuantity,
    };
  }
}
