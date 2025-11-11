import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { SessionLanguagesService } from '../services/session-languages.service';

@ApiTags('Session Languages')
@ApiBearerAuth()
@Controller({ path: 'session-languages', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class SessionLanguagesController {
  constructor(private readonly service: SessionLanguagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as linguagens de sessão disponíveis para a empresa',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user);
  }
}
