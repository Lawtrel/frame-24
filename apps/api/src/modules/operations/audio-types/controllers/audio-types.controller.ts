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

import { AudioTypesService } from '../services/audio-types.service';

@ApiTags('Audio Types')
@ApiBearerAuth()
@Controller({ path: 'audio-types', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class AudioTypesController {
  constructor(private readonly service: AudioTypesService) {}

  @Get()
  @RequirePermission('audio_types', 'read')
  @ApiOperation({ summary: 'Listar todos os tipos de áudio da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de áudio retornada com sucesso.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }
}
