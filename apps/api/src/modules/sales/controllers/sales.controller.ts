import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleResponseDto } from '../dto/sale-response.dto';

@ApiTags('Sales')
@ApiBearerAuth()
@Controller({ path: 'sales', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @RequirePermission('sales', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova venda' })
  async create(@Body() dto: CreateSaleDto): Promise<SaleResponseDto> {
    return await this.salesService.create(dto);
  }

  @Get()
  @RequirePermission('sales', 'read')
  @ApiOperation({ summary: 'Listar vendas' })
  async findAll(
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('customer_id') customer_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('status') status?: string,
  ): Promise<SaleResponseDto[]> {
    const filters: {
      cinema_complex_id?: string;
      customer_id?: string;
      start_date?: Date;
      end_date?: Date;
      status?: string;
    } = {};
    if (cinema_complex_id) filters.cinema_complex_id = cinema_complex_id;
    if (customer_id) filters.customer_id = customer_id;
    if (start_date) filters.start_date = new Date(start_date);
    if (end_date) filters.end_date = new Date(end_date);
    if (status) filters.status = status;

    return await this.salesService.findAll(filters);
  }

  @Get(':id')
  @RequirePermission('sales', 'read')
  @ApiOperation({ summary: 'Buscar venda por ID' })
  async findOne(@Param('id') id: string): Promise<SaleResponseDto> {
    return await this.salesService.findOne(id);
  }

  @Delete(':id/cancel')
  @RequirePermission('sales', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar venda' })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<void> {
    return await this.salesService.cancel(id, reason);
  }
}
