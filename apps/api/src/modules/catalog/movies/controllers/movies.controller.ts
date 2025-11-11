import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { MoviesService } from '../services/movies.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller({ path: 'movies', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class MoviesController {
  constructor(private readonly service: MoviesService) {}

  @Get('cast-types')
  @RequirePermission('movies', 'read')
  @ApiOperation({ summary: 'Listar tipos de elenco' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de elenco.' })
  async getCastTypes(@CurrentUser() user: RequestUser) {
    return this.service.getCastTypes(user.company_id);
  }

  @Get('media-types')
  @RequirePermission('movies', 'read')
  @ApiOperation({ summary: 'Listar tipos de mídia' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de mídia.' })
  async getMediaTypes(@CurrentUser() user: RequestUser) {
    return this.service.getMediaTypes(user.company_id);
  }

  @Get('age-ratings')
  @RequirePermission('movies', 'read')
  @ApiOperation({ summary: 'Listar classificações indicativas' })
  @ApiResponse({ status: 200, description: 'Lista de classificações.' })
  async getAgeRatings(@CurrentUser() user: RequestUser) {
    return this.service.getAgeRatings(user.company_id);
  }

  @Post()
  @RequirePermission('movies', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar filme',
    description:
      'Cria um filme para a empresa do usuário. O slug único é gerado automaticamente a partir do título e categorias podem ser informadas por IDs.',
  })
  @ApiResponse({
    status: 201,
    description: 'Filme criado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou distribuidor inativo/de outra empresa.',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT ausente ou inválido.',
  })
  async create(@Body() dto: CreateMovieDto, @CurrentUser() user: RequestUser) {
    return this.service.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('movies', 'read')
  @ApiOperation({
    summary: 'Listar filmes',
    description: 'Lista filmes ativos da empresa do usuário.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso.',
  })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('movies', 'read')
  @ApiOperation({
    summary: 'Buscar filme por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme encontrado.',
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado.',
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermission('movies', 'update')
  @ApiOperation({
    summary: 'Atualizar filme',
    description:
      'Atualiza dados do filme. Se o título for alterado, o slug é recalculado automaticamente para um valor único.',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme atualizado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Distribuidor inválido/inativo ou payload inválido.',
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(id, dto, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('movies', 'delete')
  @ApiOperation({
    summary: 'Excluir filme',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme excluído com sucesso.',
  })
  @ApiNotFoundResponse({
    description: 'Filme não encontrado.',
  })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
