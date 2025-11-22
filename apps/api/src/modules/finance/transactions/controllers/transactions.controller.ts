import {
    Controller,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from '../services/transactions.service';
import { CreateReceivableTransactionDto } from '../dto/create-receivable-transaction.dto';
import { CreatePayableTransactionDto } from '../dto/create-payable-transaction.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@Controller('v1/finance/transactions')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class TransactionsController {
    constructor(private readonly service: TransactionsService) { }

    @Post('receivables/settle')
    @RequirePermission('finance_receivables', 'update')
    settleReceivable(
        @CurrentUser() user: RequestUser,
        @Body() dto: CreateReceivableTransactionDto,
    ) {
        return this.service.settleReceivable(user.company_id, user.company_user_id, dto);
    }

    @Post('payables/settle')
    @RequirePermission('finance_payables', 'update')
    settlePayable(
        @CurrentUser() user: RequestUser,
        @Body() dto: CreatePayableTransactionDto,
    ) {
        return this.service.settlePayable(user.company_id, user.company_user_id, dto);
    }
}
