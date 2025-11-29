import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AgingReportsService } from '../services/aging-reports.service';
import { PositionReportsService } from '../services/position-reports.service';
import { AgingReportQueryDto } from '../dto/aging-report-query.dto';
import {
  CustomerPositionQueryDto,
  SupplierPositionQueryDto,
} from '../dto/position-report-query.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FinanceReportsService } from '../../services/finance-reports.service';

@ApiTags('Relatórios Financeiros')
@ApiBearerAuth()
@Controller('finance/reports')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AgingReportsController {
  constructor(
    private readonly agingService: AgingReportsService,
    private readonly positionService: PositionReportsService,
    private readonly financeService: FinanceReportsService,
  ) { }

  @Get('aging/receivables')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Relatório de Aging de Contas a Receber',
    description:
      'Gera relatório de inadimplência de clientes (Aging List), agrupando títulos por faixas de atraso (0-30, 31-60, etc).',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  getReceivablesAging(
    @CurrentUser() user: RequestUser,
    @Query() query: AgingReportQueryDto,
  ) {
    return this.agingService.getReceivablesAging(user.company_id, query);
  }

  @Get('aging/payables')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Relatório de Aging de Contas a Pagar',
    description:
      'Gera relatório de contas a pagar em aberto (Aging List), agrupando títulos por faixas de vencimento.',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  getPayablesAging(
    @CurrentUser() user: RequestUser,
    @Query() query: AgingReportQueryDto,
  ) {
    return this.agingService.getPayablesAging(user.company_id, query);
  }

  @Get('customer-position')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Relatório de Posição de Clientes',
    description:
      'Visão consolidada da situação financeira de todos os clientes (total devido, vencido, ticket médio).',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  getCustomerPosition(
    @CurrentUser() user: RequestUser,
    @Query() query: CustomerPositionQueryDto,
  ) {
    return this.positionService.getCustomerPosition(user.company_id, query);
  }

  @Get('customer-position/:customer_id')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Posição Detalhada de Cliente',
    description:
      'Extrato detalhado de um cliente específico, listando todos os títulos e histórico de pagamentos.',
  })
  @ApiResponse({ status: 200, description: 'Detalhes retornados com sucesso.' })
  getCustomerPositionById(
    @CurrentUser() user: RequestUser,
    @Param('customer_id') customer_id: string,
  ) {
    return this.positionService.getCustomerPositionById(
      user.company_id,
      customer_id,
    );
  }

  @Get('supplier-position')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Relatório de Posição de Fornecedores',
    description:
      'Visão consolidada da situação financeira de todos os fornecedores (total a pagar, vencido).',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  getSupplierPosition(
    @CurrentUser() user: RequestUser,
    @Query() query: SupplierPositionQueryDto,
  ) {
    return this.positionService.getSupplierPosition(user.company_id, query);
  }

  @Get('supplier-position/:supplier_id')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'Posição Detalhada de Fornecedor',
    description:
      'Extrato detalhado de um fornecedor específico, listando todos os títulos e histórico de pagamentos.',
  })
  @ApiResponse({ status: 200, description: 'Detalhes retornados com sucesso.' })
  getSupplierPositionById(
    @CurrentUser() user: RequestUser,
    @Param('supplier_id') supplier_id: string,
  ) {
    return this.positionService.getSupplierPositionById(
      user.company_id,
      supplier_id,
    );
  }

  @Get('income-statement')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({
    summary: 'DRE - Demonstrativo de Resultado do Exercício',
    description:
      'Gera a DRE (Demonstrativo de Resultado do Exercício) consolidada para o mês informado, calculando Receita, Custos, Despesas e Lucro Líquido.',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    example: '2025-11',
    description: 'Mês de competência (YYYY-MM)',
  })
  @ApiResponse({ status: 200, description: 'DRE gerada com sucesso.' })
  getIncomeStatement(
    @CurrentUser() user: RequestUser,
    @Query('month') month: string,
  ) {
    return this.financeService.getIncomeStatement(user.company_id, month);
  }
}
