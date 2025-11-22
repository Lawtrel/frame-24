import {
  Controller,
  Get,
  Post,
  Patch,
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
import { BankAccountsService } from '../services/bank-accounts.service';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';

@ApiTags('Cash Flow - Bank Accounts')
@ApiBearerAuth()
@Controller({ path: 'finance/bank-accounts', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class BankAccountsController {
  constructor(private readonly service: BankAccountsService) {}

  @Post()
  @RequirePermission('bank_accounts', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({
    status: 201,
    description: 'Bank account created successfully',
  })
  async create(
    @CurrentUser() user: RequestUser,
    @Body(new ZodValidationPipe()) dto: CreateBankAccountDto,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('bank_accounts', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Bank accounts retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('active_only') activeOnly?: boolean,
  ) {
    return this.service.findAll(user.company_id, activeOnly !== false);
  }

  @Get(':id')
  @RequirePermission('bank_accounts', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bank account details' })
  @ApiResponse({
    status: 200,
    description: 'Bank account retrieved successfully',
  })
  async findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.findOne(id, user.company_id);
  }

  @Get(':id/balance')
  @RequirePermission('bank_accounts', 'read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bank account current balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.getBalance(id, user.company_id);
  }

  @Patch(':id')
  @RequirePermission('bank_accounts', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update bank account' })
  @ApiResponse({
    status: 200,
    description: 'Bank account updated successfully',
  })
  async update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) dto: UpdateBankAccountDto,
  ) {
    return this.service.update(id, user.company_id, dto);
  }

  @Delete(':id')
  @RequirePermission('bank_accounts', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate bank account' })
  @ApiResponse({
    status: 200,
    description: 'Bank account deactivated successfully',
  })
  async delete(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.delete(id, user.company_id);
  }
}
