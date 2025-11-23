import {
  Controller,
  Get,
  Post,
  Delete,
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
import { CashFlowEntriesService } from '../services/cash-flow-entries.service';
import { CreateCashFlowEntryDto } from '../dto/create-cash-flow-entry.dto';
import { CashFlowQueryDto } from '../dto/cash-flow-query.dto';

@ApiTags('Cash Flow - Entries')
@ApiBearerAuth()
@Controller({ path: 'finance/cash-flow', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class CashFlowEntriesController {
  constructor(private readonly service: CashFlowEntriesService) {}

  @Post()
  @RequirePermission('cash_flow', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new cash flow entry' })
  @ApiResponse({
    status: 201,
    description: 'Cash flow entry created successfully',
  })
  async create(
    @CurrentUser() user: RequestUser,
    @Body(new ZodValidationPipe()) dto: CreateCashFlowEntryDto,
  ) {
    return this.service.create(user.company_id, user.company_user_id, dto);
  }

  @Get()
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List cash flow entries with filters' })
  @ApiResponse({
    status: 200,
    description: 'Cash flow entries retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query(new ZodValidationPipe()) query: CashFlowQueryDto,
  ) {
    return this.service.findAll(user.company_id, query);
  }

  @Get(':id')
  @RequirePermission('cash_flow', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cash flow entry details' })
  @ApiResponse({
    status: 200,
    description: 'Cash flow entry retrieved successfully',
  })
  async findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.findOne(id, user.company_id);
  }

  @Post(':id/reconcile')
  @RequirePermission('cash_flow', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reconcile a cash flow entry' })
  @ApiResponse({ status: 200, description: 'Entry reconciled successfully' })
  async reconcile(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.reconcile(id, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('cash_flow', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a cash flow entry' })
  @ApiResponse({ status: 200, description: 'Entry deleted successfully' })
  async delete(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.delete(id, user.company_id);
  }
}
