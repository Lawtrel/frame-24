import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { ZodValidationPipe } from 'nestjs-zod';
import { CashFlowReportsService } from '../services/cash-flow-reports.service';
import { CashFlowReportQueryDto } from '../dto/cash-flow-report.dto';

@ApiTags('Fluxo de Caixa - Relatórios')
@ApiBearerAuth()
@Controller({ path: 'finance/cash-flow/reports', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class CashFlowReportsController {
  constructor(private readonly service: CashFlowReportsService) { }

  @Get('daily')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get daily cash flow report' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  async getDailyReport(
    @CurrentUser() user: RequestUser,
    @Query(new ZodValidationPipe()) query: CashFlowReportQueryDto,
  ) {
    return this.service.getDailyReport(user.company_id, query);
  }

  @Get('period')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cash flow report by period' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  async getPeriodReport(
    @CurrentUser() user: RequestUser,
    @Query(new ZodValidationPipe()) query: CashFlowReportQueryDto,
  ) {
    return this.service.getPeriodReport(user.company_id, query);
  }

  @Get('projection')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cash flow projection' })
  @ApiResponse({
    status: 200,
    description: 'Projection retrieved successfully',
  })
  async getProjection(
    @CurrentUser() user: RequestUser,
    @Query(new ZodValidationPipe()) query: CashFlowReportQueryDto,
  ) {
    return this.service.getProjection(user.company_id, query);
  }

  @Get('summary')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cash flow summary by category' })
  @ApiResponse({ status: 200, description: 'Summary retrieved successfully' })
  async getCategorySummary(
    @CurrentUser() user: RequestUser,
    @Query(new ZodValidationPipe()) query: CashFlowReportQueryDto,
  ) {
    return this.service.getCategorySummary(user.company_id, query);
  }
}
