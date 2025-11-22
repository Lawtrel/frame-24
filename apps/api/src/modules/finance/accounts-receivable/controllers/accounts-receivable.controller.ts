import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsReceivableService } from '../services/accounts-receivable.service';
import { CreateAccountReceivableDto } from '../dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from '../dto/update-account-receivable.dto';
import { AccountReceivableQueryDto } from '../dto/account-receivable-query.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Controller('v1/finance/receivables')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AccountsReceivableController {
  constructor(private readonly service: AccountsReceivableService) {}

  @Post()
  @RequirePermission('finance_receivables', 'create')
  create(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateAccountReceivableDto,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('finance_receivables', 'read')
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() query: AccountReceivableQueryDto,
  ) {
    return this.service.findAll(user.company_id, query);
  }

  @Get(':id')
  @RequirePermission('finance_receivables', 'read')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.findOne(id, user.company_id);
  }

  @Patch(':id')
  @RequirePermission('finance_receivables', 'update')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountReceivableDto,
  ) {
    return this.service.update(id, user.company_id, dto);
  }
}
