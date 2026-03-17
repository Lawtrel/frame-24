import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { TicketsRepository } from '../repositories/tickets.repository';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller({ path: 'tickets', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class TicketsController {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  @Get(':id')
  @RequirePermission('tickets', 'read')
  @ApiOperation({ summary: 'Buscar ingresso por ID' })
  async findOne(@Param('id') id: string): Promise<any> {
    const ticket = await this.ticketsRepository.findById(id);
    if (!ticket) {
      throw new Error('Ingresso não encontrado');
    }
    return ticket;
  }

  @Put(':id/use')
  @RequirePermission('tickets', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar ingresso como usado' })
  async markAsUsed(@Param('id') id: string): Promise<any> {
    return await this.ticketsRepository.markAsUsed(id, new Date());
  }
}
