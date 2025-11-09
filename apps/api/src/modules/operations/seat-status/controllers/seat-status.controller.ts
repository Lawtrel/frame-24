import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { SeatStatusService } from '../services/seat-status.service';

@ApiTags('Seat Status')
@ApiBearerAuth()
@Controller('seat-status')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class SeatStatusController {
  constructor(private readonly service: SeatStatusService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os status de assento disponíveis para a empresa',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user);
  }
}
