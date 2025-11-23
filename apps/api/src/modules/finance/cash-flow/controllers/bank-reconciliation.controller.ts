import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
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
import { BankReconciliationService } from '../services/bank-reconciliation.service';
import {
  CreateBankReconciliationDto,
  UpdateBankReconciliationDto,
} from '../dto/bank-reconciliation.dto';

@ApiTags('Cash Flow - Reconciliation')
@ApiBearerAuth()
@Controller({ path: 'finance/bank-reconciliation', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class BankReconciliationController {
  constructor(private readonly service: BankReconciliationService) {}

  @Post()
  @RequirePermission('cash_flow', 'reconcile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start a new bank reconciliation' })
  @ApiResponse({
    status: 201,
    description: 'Reconciliation created successfully',
  })
  async create(
    @CurrentUser() user: RequestUser,
    @Body(new ZodValidationPipe()) dto: CreateBankReconciliationDto,
  ) {
    return this.service.create(user.company_id, user.company_user_id, dto);
  }

  @Get()
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List bank reconciliations' })
  @ApiResponse({
    status: 200,
    description: 'Reconciliations retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('bank_account_id') bankAccountId?: string,
  ) {
    return this.service.findAll(user.company_id, bankAccountId);
  }

  @Get(':id')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reconciliation details' })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('cash_flow', 'reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update reconciliation' })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) dto: UpdateBankReconciliationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Post(':id/complete')
  @RequirePermission('cash_flow', 'reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete reconciliation' })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation completed successfully',
  })
  async complete(@Param('id') id: string) {
    return this.service.complete(id);
  }
}
