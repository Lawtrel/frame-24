import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { ChartOfAccountsService } from '../services/chart-of-accounts.service';
import {
  CreateChartAccountDto,
  UpdateChartAccountDto,
} from '../dto/create-chart-account.dto';

@ApiTags('Plano de Contas')
@ApiBearerAuth()
@Controller({ path: 'finance/chart-of-accounts', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class ChartOfAccountsController {
  constructor(private readonly chartService: ChartOfAccountsService) {}

  @Post()
  @RequirePermission('finance_accounts', 'create')
  @ApiOperation({ summary: 'Criar conta do plano contábil' })
  async create(
    @Body() dto: CreateChartAccountDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.chartService.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('finance_accounts', 'read')
  @ApiOperation({ summary: 'Listar contas do plano contábil' })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.chartService.findAll(user.company_id);
  }

  @Put(':id')
  @RequirePermission('finance_accounts', 'update')
  @ApiOperation({ summary: 'Atualizar conta contábil' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateChartAccountDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.chartService.update(user.company_id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('finance_accounts', 'delete')
  @ApiOperation({ summary: 'Inativar conta contábil' })
  @ApiResponse({ status: 200, description: 'Conta inativada com sucesso' })
  async remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.chartService.remove(user.company_id, id);
  }
}
