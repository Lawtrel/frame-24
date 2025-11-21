import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { ContractTypesService } from '../services/contract-types.service';
import { CreateContractTypeDto } from '../dto/create-contract-type.dto';
import { UpdateContractTypeDto } from '../dto/update-contract-type.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller({ path: 'contracts/types', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ContractTypesController {
  constructor(private readonly service: ContractTypesService) {}

  @Post()
  @RequirePermission('contracts', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar tipo de contrato de exibição' })
  async create(
    @Body() dto: CreateContractTypeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(user.company_id, dto);
  }

  @Get()
  @RequirePermission('contracts', 'read')
  @ApiOperation({ summary: 'Listar tipos de contrato' })
  async list(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('contracts', 'read')
  @ApiOperation({ summary: 'Buscar tipo de contrato por ID' })
  @ApiParam({ name: 'id', description: 'Identificador do tipo' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(user.company_id, id);
  }

  @Put(':id')
  @RequirePermission('contracts', 'update')
  @ApiOperation({ summary: 'Atualizar tipo de contrato' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContractTypeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(user.company_id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('contracts', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover tipo de contrato' })
  @ApiResponse({ status: 204, description: 'Tipo removido.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.service.delete(user.company_id, id);
  }
}
