import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { DistributorSettlementsService } from '../services/distributor-settlements.service';
import { CreateDistributorSettlementDto } from '../dto/create-distributor-settlement.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller({ path: 'finance/distributor-settlements', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
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
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('cinema_complex_id') cinema_complex_id?: string,
  ) {
    return this.settlementsService.findAll(user.company_id, cinema_complex_id);
  }

  @Post()
  @RequirePermission('finance_settlements', 'create')
  @ApiOperation({ summary: 'Criar/acertar repasse para distribuidor' })
  async create(
    @Body() dto: CreateDistributorSettlementDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.settlementsService.create(user.company_id, dto);
  }
}
