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
import { AccountsPayableService } from '../services/accounts-payable.service';
import { CreateAccountPayableDto } from '../dto/create-account-payable.dto';
import { UpdateAccountPayableDto } from '../dto/update-account-payable.dto';
import { AccountPayableQueryDto } from '../dto/account-payable-query.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Controller('v1/finance/payables')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AccountsPayableController {
    constructor(private readonly service: AccountsPayableService) { }

    @Post()
    @RequirePermission('finance_payables', 'create')
    create(@CurrentUser() user: RequestUser, @Body() dto: CreateAccountPayableDto) {
        return this.service.create(user.company_id, dto);
    }

    @Get()
    @RequirePermission('finance_payables', 'read')
    findAll(@CurrentUser() user: RequestUser, @Query() query: AccountPayableQueryDto) {
        return this.service.findAll(user.company_id, query);
    }

    @Get(':id')
    @RequirePermission('finance_payables', 'read')
    findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
        return this.service.findOne(id, user.company_id);
    }

    @Patch(':id')
    @RequirePermission('finance_payables', 'update')
    update(
        @CurrentUser() user: RequestUser,
        @Param('id') id: string,
        @Body() dto: UpdateAccountPayableDto,
    ) {
        return this.service.update(id, user.company_id, dto);
    }
}
