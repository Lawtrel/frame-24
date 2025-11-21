import {
  Controller,
  Get,
  Post,
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

import { StockMovementsService } from '../services/stock-movements.service';
import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';
import { StockMovementResponseDto } from '../dto/stock-movement-response.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Stock Movements')
@ApiBearerAuth()
@Controller({ path: 'stock/movements', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @RequirePermission('stock', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar movimentação de estoque' })
  async create(
    @Body() dto: CreateStockMovementDto,
    @CurrentUser() user: RequestUser,
  ): Promise<StockMovementResponseDto> {
    return await this.stockMovementsService.create(dto, user);
  }

  @Get()
  @RequirePermission('stock', 'read')
  @ApiOperation({ summary: 'Listar movimentações de estoque' })
  async findAll(
    @Query('product_id') product_id?: string,
    @Query('complex_id') complex_id?: string,
    @Query('movement_type') movement_type?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<StockMovementResponseDto[]> {
    const filters: any = {};
    if (product_id) filters.product_id = product_id;
    if (complex_id) filters.complex_id = complex_id;
    if (movement_type) filters.movement_type = movement_type;
    if (start_date) filters.start_date = new Date(start_date);
    if (end_date) filters.end_date = new Date(end_date);

    return await this.stockMovementsService.findAll(user!, filters);
  }

  @Get(':id')
  @RequirePermission('stock', 'read')
  @ApiOperation({ summary: 'Buscar movimentação por ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<StockMovementResponseDto> {
    return await this.stockMovementsService.findOne(id, user);
  }
}
