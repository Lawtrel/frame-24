import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseUUIDPipe,
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
  async create(@Body() dto: CreateChartAccountDto) {
    return this.chartService.create(dto);
  }

  @Get()
  @RequirePermission('finance_accounts', 'read')
  @ApiOperation({ summary: 'Listar contas do plano contábil' })
  async findAll() {
    return this.chartService.findAll();
  }

  @Put(':id')
  @RequirePermission('finance_accounts', 'update')
  @ApiOperation({ summary: 'Atualizar conta contábil' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChartAccountDto,
  ) {
    return this.chartService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('finance_accounts', 'delete')
  @ApiOperation({ summary: 'Inativar conta contábil' })
  @ApiResponse({ status: 200, description: 'Conta inativada com sucesso' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chartService.remove(id);
  }
}
