import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { DistributorSettlementsService } from '../services/distributor-settlements.service';
import { CreateDistributorSettlementDto } from '../dto/create-distributor-settlement.dto';

@ApiTags('Conciliações com Distribuidoras')
@ApiBearerAuth()
@Controller({ path: 'finance/distributor-settlements', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class DistributorSettlementsController {
  constructor(
    private readonly settlementsService: DistributorSettlementsService,
  ) {}

  @Get()
  @RequirePermission('finance_settlements', 'read')
  @ApiOperation({ summary: 'Listar repasses para distribuidoras' })
  @ApiQuery({
    name: 'cinema_complex_id',
    required: false,
    description: 'Filtrar por complexo',
  })
  async findAll(@Query('cinema_complex_id') cinema_complex_id?: string) {
    return this.settlementsService.findAll(cinema_complex_id);
  }

  @Post()
  @RequirePermission('finance_settlements', 'create')
  @ApiOperation({ summary: 'Criar/acertar repasse para distribuidor' })
  async create(@Body() dto: CreateDistributorSettlementDto) {
    return this.settlementsService.create(dto);
  }
}
