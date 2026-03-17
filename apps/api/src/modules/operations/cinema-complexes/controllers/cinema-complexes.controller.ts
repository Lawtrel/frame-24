import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SecuredController } from 'src/common/decorators/secured-controller.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { CreateCinemaComplexDto } from '../dto/create-cinema-complex.dto';
import { UpdateCinemaComplexDto } from '../dto/update-cinema-complex.dto';
import { CinemaComplexesService } from '../service/cinema-complexes.service';

@ApiTags('Cinema Complexes')
@SecuredController({ path: 'cinema-complexes', version: '1' })
export class CinemaComplexesController {
  constructor(private readonly service: CinemaComplexesService) {}

  @Post()
  @RequirePermission('cinema_complexes', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um novo complexo de cinema',
    description:
      'Cria um novo complexo de cinema associado à empresa do usuário autenticado.',
  })
  @ApiResponse({ status: 201, description: 'Complexo criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  @ApiConflictResponse({
    description: 'Um complexo com o mesmo código já existe.',
  })
  async create(
    @Body() dto: CreateCinemaComplexDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(dto, user.company_id, user.company_user_id);
  }

  @Get()
  @RequirePermission('cinema_complexes', 'read')
  @ApiOperation({ summary: 'Listar todos os complexos de cinema da empresa' })
  @ApiOkResponse({
    description: 'Lista de complexos retornada com sucesso.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('cinema_complexes', 'read')
  @ApiOperation({ summary: 'Buscar um complexo de cinema por ID' })
  @ApiResponse({ status: 200, description: 'Complexo encontrado.' })
  @ApiNotFoundResponse({ description: 'Complexo não encontrado.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('cinema_complexes', 'update')
  @ApiOperation({ summary: 'Atualizar um complexo de cinema' })
  @ApiResponse({ status: 200, description: 'Complexo atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Complexo não encontrado.' })
  @ApiConflictResponse({ description: 'O código fornecido já está em uso.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCinemaComplexDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(id, dto, user.company_id, user.company_user_id);
  }

  @Delete(':id')
  @RequirePermission('cinema_complexes', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir um complexo de cinema' })
  @ApiResponse({ status: 200, description: 'Complexo excluído com sucesso.' })
  @ApiNotFoundResponse({ description: 'Complexo não encontrado.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.delete(id, user.company_id, user.company_user_id);
  }
}
