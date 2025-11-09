import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { SeatTypesService } from '../services/seat-types.service';

@ApiTags('Seat Types')
@ApiBearerAuth()
@Controller('seat-types')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class SeatTypesController {
  constructor(private readonly service: SeatTypesService) {}

  @Get()
  @RequirePermission('seat_types', 'read')
  @ApiOperation({ summary: 'Listar todos os tipos de assento da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de assento retornada com sucesso.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }
}
