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

import { ProjectionTypesService } from '../services/projection-types.service';

@ApiTags('Projection Types')
@ApiBearerAuth()
@Controller('projection-types')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ProjectionTypesController {
  constructor(private readonly service: ProjectionTypesService) {}

  @Get()
  @RequirePermission('projection_types', 'read')
  @ApiOperation({ summary: 'Listar todos os tipos de projeção da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de projeção retornada com sucesso.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }
}
