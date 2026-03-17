import { Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SecuredController } from 'src/common/decorators/secured-controller.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { OperationTypeResponseDto } from '../../shared/dto/operation-type-response.dto';

import { ProjectionTypesService } from '../services/projection-types.service';

@ApiTags('Projection Types')
@SecuredController({ path: 'projection-types', version: '1' })
export class ProjectionTypesController {
  constructor(private readonly service: ProjectionTypesService) {}

  @Get()
  @RequirePermission('projection_types', 'read')
  @ApiOperation({ summary: 'Listar todos os tipos de projeção da empresa' })
  @ApiOkResponse({
    description: 'Lista de tipos de projeção retornada com sucesso.',
    type: OperationTypeResponseDto,
    isArray: true,
  })
  async findAll(
    @CurrentUser() user: RequestUser,
  ): Promise<OperationTypeResponseDto[]> {
    return this.service.findAll(user.company_id);
  }
}
