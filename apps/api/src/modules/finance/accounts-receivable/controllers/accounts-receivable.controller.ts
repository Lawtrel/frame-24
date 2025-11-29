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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Contas a Receber')
@ApiBearerAuth()
@Controller('finance/receivables')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AccountsReceivableController {
  constructor(private readonly service: AccountsReceivableService) { }

  @Post()
  @RequirePermission('finance_receivables', 'create')
  @ApiOperation({
    summary: 'Criar nova conta a receber',
    description:
      'Registra uma nova conta a receber (título). Geralmente criada automaticamente por vendas, mas pode ser lançada manualmente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conta a receber criada com sucesso.',
  })
  create(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateAccountReceivableDto,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('finance_receivables', 'read')
  @ApiOperation({
    summary: 'Listar contas a receber',
    description:
      'Retorna uma lista paginada de contas a receber, com filtros por data, status e cliente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contas a receber retornada com sucesso.',
  })
  findAll(
    @CurrentUser() user: RequestUser,
    @Query() query: AccountReceivableQueryDto,
  ) {
    return this.service.findAll(user.company_id, query);
  }

  @Get(':id')
  @RequirePermission('finance_receivables', 'read')
  @ApiOperation({
    summary: 'Buscar conta a receber por ID',
    description: 'Retorna os detalhes de uma conta a receber específica.',
  })
  @ApiResponse({ status: 200, description: 'Detalhes da conta a receber.' })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada.' })
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.service.findOne(id, user.company_id);
  }

  @Patch(':id')
  @RequirePermission('finance_receivables', 'update')
  @ApiOperation({
    summary: 'Atualizar conta a receber',
    description:
      'Atualiza os dados de uma conta a receber. Útil para correções manuais ou renegociações.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta a receber atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Conta a receber não encontrada.' })
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountReceivableDto,
  ) {
    return this.service.update(id, user.company_id, dto);
  }
}
