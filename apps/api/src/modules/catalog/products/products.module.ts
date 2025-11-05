import { Module } from '@nestjs/common';

import { ProductsController } from './controllers/products.controller';
import { ProductCategoriesController } from './controllers/product-categories.controller';

import { ProductsService } from './services/products.service';
import { ProductCategoriesService } from './services/product-categories.service';

import { ProductRepository } from './repositories/product.repository';
import { ProductCategoryRepository } from './repositories/product-category.repository';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, ProductCategoriesController],
  providers: [
    ProductsService,
    ProductCategoriesService,
    ProductRepository,
    ProductCategoryRepository,
    SnowflakeService,
    LoggerService,
  ],
  exports: [ProductsService, ProductCategoriesService],
})
export class ProductsModule {}
