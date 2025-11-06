import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Prisma, product_categories } from '@repo/db';
import { ProductCategoryRepository } from '../repositories/product-category.repository';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { ProductCategoryResponseDto } from '../dto/product-category-response.dto';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private readonly categoryRepo: ProductCategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(
    dto: CreateProductCategoryDto,
    company_id: string,
  ): Promise<ProductCategoryResponseDto> {
    const existing = await this.categoryRepo.findByName(company_id, dto.name);
    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = await this.categoryRepo.create({
      company_id,
      name: dto.name,
      description: dto.description,
    } as Prisma.product_categoriesCreateInput);

    this.logger.log(
      `Product category created: ${category.name}`,
      ProductCategoriesService.name,
    );

    return this.mapToDto(category);
  }

  async findAll(
    company_id: string,
    includeProductCount = false,
  ): Promise<ProductCategoryResponseDto[]> {
    if (includeProductCount) {
      const categories =
        await this.categoryRepo.findAllWithProductCount(company_id);
      return categories.map((cat) => this.mapToDto(cat, cat.product_count));
    }

    const categories = await this.categoryRepo.findAll(company_id);
    return categories.map((cat) => this.mapToDto(cat));
  }

  async findOne(
    id: string,
    company_id: string,
  ): Promise<ProductCategoryResponseDto> {
    const category = await this.categoryRepo.findById(id, company_id);

    if (!category) {
      throw new NotFoundException('Product category not found');
    }

    const productCount = await this.categoryRepo.countProducts(id);

    return this.mapToDto(category, productCount);
  }

  @Transactional()
  async update(
    id: string,
    dto: UpdateProductCategoryDto,
    company_id: string,
  ): Promise<ProductCategoryResponseDto> {
    const category = await this.categoryRepo.findById(id, company_id);

    if (!category) {
      throw new NotFoundException('Product category not found');
    }

    if (dto.name && dto.name !== category.name) {
      const existing = await this.categoryRepo.findByName(company_id, dto.name);
      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const updated = await this.categoryRepo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
    });

    this.logger.log(
      `Product category updated: ${updated.name}`,
      ProductCategoriesService.name,
    );

    return this.mapToDto(updated);
  }

  @Transactional()
  async delete(id: string, company_id: string): Promise<void> {
    const category = await this.categoryRepo.findById(id, company_id);

    if (!category) {
      throw new NotFoundException('Product category not found');
    }

    const productCount = await this.categoryRepo.countProducts(id);

    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category: ${productCount} products are using it`,
      );
    }

    await this.categoryRepo.delete(id);

    this.logger.log(
      `Product category deleted: ${category.name}`,
      ProductCategoriesService.name,
    );
  }

  private mapToDto(
    category: product_categories,
    productCount?: number,
  ): ProductCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      ...(productCount !== undefined && { product_count: productCount }),
    };
  }
}
