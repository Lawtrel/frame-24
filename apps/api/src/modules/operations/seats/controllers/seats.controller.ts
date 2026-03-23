import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParseEntityIdPipe } from 'src/common/pipes/parse-entity-id.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

import { SeatsService } from '../services/seats.service';
import { UpdateSeatStatusDto } from '../dto/update-seat-status.dto';
import { UpdateSeatsStatusBatchDto } from '../dto/update-seats-status-batch.dto';

@ApiTags('Seats')
@ApiBearerAuth()
@Controller({ path: 'seats', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class SeatsController {
  constructor(private readonly service: SeatsService) {}

  @Patch(':id/status')
  @RequirePermission('seats', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ativar ou desativar um assento físico (para manutenção)',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do assento atualizado com sucesso.',
  })
  @ApiNotFoundResponse({ description: 'Assento não encontrado.' })
  @ApiForbiddenResponse({ description: 'Acesso negado ao recurso.' })
  async updateSeatStatus(
    @Param('id', ParseEntityIdPipe) id: string,
    @Body() dto: UpdateSeatStatusDto,
  ) {
    return this.service.updateStatus(id, dto.active);
  }

  @Patch('status/batch')
  @RequirePermission('seats', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ativar ou desativar múltiplos assentos em lote',
    description:
      'Permite enviar uma lista de assentos para ativar e/ou desativar em uma única requisição.',
  })
  @ApiResponse({
    status: 200,
    description: 'Operação em lote concluída.',
    schema: { example: { updated: 9 } },
  })
  @ApiForbiddenResponse({
    description:
      'Acesso negado. Um ou mais assentos não foram encontrados ou não pertencem à sua empresa.',
  })
  async updateStatusBatch(@Body() dto: UpdateSeatsStatusBatchDto) {
    return this.service.updateStatusBatch(dto);
  }
}
