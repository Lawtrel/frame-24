import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { SessionStatusService } from '../services/session-status.service';

@ApiTags('Session Status')
@ApiBearerAuth()
@Controller({ path: 'session-status', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class SessionStatusController {
  constructor(private readonly service: SessionStatusService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os status de sessão (ex: Agendada, Cancelada)',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user);
  }
}
