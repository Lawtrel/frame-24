import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from '../services/transactions.service';
import { CreateReceivableTransactionDto } from '../dto/create-receivable-transaction.dto';
import { CreatePayableTransactionDto } from '../dto/create-payable-transaction.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('finance/transactions')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post('receivables/settle')
  @RequirePermission('finance_receivables', 'update')
  @ApiOperation({
    summary: 'Liquidar conta a receber',
    description:
      'Liquida (baixa) uma conta a receber, registrando a entrada de dinheiro no fluxo de caixa. Permite pagamentos parciais e aplicação de juros/multas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação de recebimento registrada com sucesso.',
  })
  settleReceivable(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateReceivableTransactionDto,
  ) {
    return this.service.settleReceivable(
      user.company_id,
      user.company_user_id,
      dto,
    );
  }

  @Post('payables/settle')
  @RequirePermission('finance_payables', 'update')
  @ApiOperation({
    summary: 'Liquidar conta a pagar',
    description:
      'Liquida (baixa) uma conta a pagar, registrando a saída de dinheiro do fluxo de caixa. Permite pagamentos parciais e aplicação de juros/multas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação de pagamento registrada com sucesso.',
  })
  settlePayable(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreatePayableTransactionDto,
  ) {
    return this.service.settlePayable(
      user.company_id,
      user.company_user_id,
      dto,
    );
  }
}
