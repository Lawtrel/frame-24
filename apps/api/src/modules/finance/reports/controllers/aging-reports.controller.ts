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

@Controller('v1/finance/reports')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AgingReportsController {
  constructor(
    private readonly agingService: AgingReportsService,
    private readonly positionService: PositionReportsService,
  ) {}

  @Get('aging/receivables')
  @RequirePermission('finance_reports', 'read')
  getReceivablesAging(
    @CurrentUser() user: RequestUser,
    @Query() query: AgingReportQueryDto,
  ) {
    return this.agingService.getReceivablesAging(user.company_id, query);
  }

  @Get('aging/payables')
  @RequirePermission('finance_reports', 'read')
  getPayablesAging(
    @CurrentUser() user: RequestUser,
    @Query() query: AgingReportQueryDto,
  ) {
    return this.agingService.getPayablesAging(user.company_id, query);
  }

  @Get('customer-position')
  @RequirePermission('finance_reports', 'read')
  getCustomerPosition(
    @CurrentUser() user: RequestUser,
    @Query() query: CustomerPositionQueryDto,
  ) {
    return this.positionService.getCustomerPosition(user.company_id, query);
  }

  @Get('customer-position/:customer_id')
  @RequirePermission('finance_reports', 'read')
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
  getSupplierPosition(
    @CurrentUser() user: RequestUser,
    @Query() query: SupplierPositionQueryDto,
  ) {
    return this.positionService.getSupplierPosition(user.company_id, query);
  }

  @Get('supplier-position/:supplier_id')
  @RequirePermission('finance_reports', 'read')
  getSupplierPositionById(
    @CurrentUser() user: RequestUser,
    @Param('supplier_id') supplier_id: string,
  ) {
    return this.positionService.getSupplierPositionById(
      user.company_id,
      supplier_id,
    );
  }
}
