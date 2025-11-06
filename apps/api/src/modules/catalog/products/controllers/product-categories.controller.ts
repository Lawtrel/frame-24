import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { ProductCategoriesService } from '../services/product-categories.service';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { ProductCategoryResponseDto } from '../dto/product-category-response.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Product Categories')
@ApiBearerAuth()
@Controller('admin/product-categories')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ProductCategoriesController {
  constructor(private readonly categoriesService: ProductCategoriesService) {}

  @Post()
  @RequirePermission('product_categories', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar categoria de produto' })
  async create(
    @Body() dto: CreateProductCategoryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductCategoryResponseDto> {
    return await this.categoriesService.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('product_categories', 'read')
  @ApiOperation({ summary: 'Listar categorias de produtos' })
  async findAll(
    @CurrentUser() user: RequestUser,
  ): Promise<ProductCategoryResponseDto[]> {
    return await this.categoriesService.findAll(user.company_id, true);
  }

  @Get(':id')
  @RequirePermission('product_categories', 'read')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductCategoryResponseDto> {
    return await this.categoriesService.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('product_categories', 'update')
  @ApiOperation({ summary: 'Atualizar categoria' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductCategoryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductCategoryResponseDto> {
    return await this.categoriesService.update(id, dto, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('product_categories', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar categoria' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.categoriesService.delete(id, user.company_id);
  }
}
