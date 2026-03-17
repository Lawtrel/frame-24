import { Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SecuredController } from 'src/common/decorators/secured-controller.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { OperationTypeResponseDto } from '../../shared/dto/operation-type-response.dto';

import { SeatTypesService } from '../services/seat-types.service';

@ApiTags('Seat Types')
@SecuredController({ path: 'seat-types', version: '1' })
export class SeatTypesController {
  constructor(private readonly service: SeatTypesService) {}

  @Get()
  @RequirePermission('seat_types', 'read')
  @ApiOperation({ summary: 'Listar todos os tipos de assento da empresa' })
  @ApiOkResponse({
    description: 'Lista de tipos de assento retornada com sucesso.',
    type: OperationTypeResponseDto,
    isArray: true,
  })
  async findAll(
    @CurrentUser() user: RequestUser,
  ): Promise<OperationTypeResponseDto[]> {
    return this.service.findAll(user.company_id);
  }
}
