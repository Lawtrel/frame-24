import {
  Controller,
  Get,
  Post,
  Put,
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

import { TaxEntriesService } from '../services/tax-entries.service';
import { CreateTaxEntryDto } from '../dto/create-tax-entry.dto';
import { TaxEntryResponseDto } from '../dto/tax-entry-response.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller({ path: 'tax/entries', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class TaxEntriesController {
  constructor(private readonly taxEntriesService: TaxEntriesService) {}

  @Post()
  @RequirePermission('tax', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar lançamento fiscal' })
  async create(
    @Body() dto: CreateTaxEntryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<TaxEntryResponseDto> {
    return await this.taxEntriesService.create(dto, user);
  }

  @Get()
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Listar lançamentos fiscais' })
  async findAll(
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('source_type') source_type?: string,
    @Query('source_id') source_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('processed') processed?: string,
    @CurrentUser() user?: RequestUser,
  ): Promise<TaxEntryResponseDto[]> {
    const filters: any = {};
    if (cinema_complex_id) filters.cinema_complex_id = cinema_complex_id;
    if (source_type) filters.source_type = source_type;
    if (source_id) filters.source_id = source_id;
    if (start_date) filters.start_date = new Date(start_date);
    if (end_date) filters.end_date = new Date(end_date);
    if (processed !== undefined)
      filters.processed = processed === 'true' ? true : false;

    return await this.taxEntriesService.findAll(user!, filters);
  }

  @Get(':id')
  @RequirePermission('tax', 'read')
  @ApiOperation({ summary: 'Buscar lançamento fiscal por ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<TaxEntryResponseDto> {
    return await this.taxEntriesService.findOne(id, user);
  }

  @Put(':id/process')
  @RequirePermission('tax', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar lançamento fiscal como processado' })
  async markAsProcessed(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<TaxEntryResponseDto> {
    return await this.taxEntriesService.markAsProcessed(id, user);
  }
}
