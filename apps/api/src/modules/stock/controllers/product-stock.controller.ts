import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { ProductStockService } from '../services/product-stock.service';
import { ProductStockResponseDto } from '../dto/product-stock-response.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Product Stock')
@ApiBearerAuth()
@Controller({ path: 'stock/products', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ProductStockController {
  constructor(private readonly productStockService: ProductStockService) {}

  @Get()
  @RequirePermission('stock', 'read')
  @ApiOperation({ summary: 'Listar estoque de produtos' })
  async findAll(
    @Query('complex_id') complex_id?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<ProductStockResponseDto[]> {
    return await this.productStockService.findAll(user!, complex_id);
  }

  @Get('low-stock')
  @RequirePermission('stock', 'read')
  @ApiOperation({ summary: 'Listar produtos com estoque baixo' })
  async findLowStock(
    @Query('complex_id') complex_id?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<ProductStockResponseDto[]> {
    return await this.productStockService.findLowStock(user!, complex_id);
  }

  @Get(':product_id/:complex_id')
  @RequirePermission('stock', 'read')
  @ApiOperation({ summary: 'Buscar estoque de produto específico' })
  async findOne(
    @Param('product_id') product_id: string,
    @Param('complex_id') complex_id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<ProductStockResponseDto> {
    return await this.productStockService.findOne(product_id, complex_id, user);
  }
}
