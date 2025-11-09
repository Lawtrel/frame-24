import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Products')
@ApiBearerAuth()
@Controller({ path: 'products', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermission('products', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar produto' })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('products', 'read')
  @ApiOperation({ summary: 'Listar produtos' })
  async findAll(
    @Query('active') active?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<ProductResponseDto[]> {
    const activeFilter =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return await this.productsService.findAll(user!.company_id, activeFilter);
  }

  @Get('category/:category_id')
  @RequirePermission('products', 'read')
  @ApiOperation({ summary: 'Listar produtos por categoria' })
  async findByCategory(
    @Param('category_id') category_id: string,
    @Query('active') active?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<ProductResponseDto[]> {
    const activeFilter =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return await this.productsService.findByCategory(
      category_id,
      user!.company_id,
      activeFilter,
    );
  }

  @Get('search/:term')
  @RequirePermission('products', 'read')
  @ApiOperation({ summary: 'Buscar produtos por nome/código/barcode' })
  async search(
    @Param('term') searchTerm: string,
    @Query('active') active?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<ProductResponseDto[]> {
    const activeFilter =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return await this.productsService.search(
      user!.company_id,
      searchTerm,
      activeFilter,
    );
  }

  @Get(':id')
  @RequirePermission('products', 'read')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('products', 'update')
  @ApiOperation({ summary: 'Atualizar produto' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, dto, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('products', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar produto (soft delete)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.productsService.delete(id, user.company_id, true);
  }
}
