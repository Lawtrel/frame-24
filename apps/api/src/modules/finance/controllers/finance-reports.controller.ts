import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
import { FinanceReportsService } from '../services/finance-reports.service';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller({ path: 'finance', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class FinanceReportsController {
  constructor(private readonly financeReports: FinanceReportsService) {}

  @Get('income-statement')
  @RequirePermission('finance_reports', 'read')
  @ApiOperation({ summary: 'Obter DRE mensal' })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Período no formato YYYY-MM',
    example: '2025-11',
  })
  async getIncomeStatement(
    @CurrentUser() user: RequestUser,
    @Query('month') month: string,
  ) {
    return this.financeReports.getIncomeStatement(user.company_id, month);
  }
}
