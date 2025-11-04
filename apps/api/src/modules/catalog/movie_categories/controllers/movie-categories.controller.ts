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
import { MovieCategoriesService } from '../services/movie-categories.service';
import { CreateMovieCategoryDto } from '../dto/create-movie-category.dto';
import { UpdateMovieCategoryDto } from '../dto/update-movie-category.dto';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Movie Categories')
@Controller('movie-categories')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class MovieCategoriesController {
  constructor(private readonly service: MovieCategoriesService) {}

  @Post()
  @RequirePermission('movie_categories', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar categoria de filme',
    description:
      'Cria uma nova categoria de filme com slug único gerado automaticamente.',
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  async create(
    @Body() dto: CreateMovieCategoryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('movie_categories', 'read')
  @ApiOperation({ summary: 'Listar categorias de filmes' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(@CurrentUser() user: RequestUser) {
    return this.service.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('movie_categories', 'read')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada.' })
  @ApiNotFoundResponse({ description: 'Categoria não encontrada.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('movie_categories', 'update')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description:
      'Se o nome for alterado, o slug é recalculado automaticamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
  })
  @ApiNotFoundResponse({ description: 'Categoria não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieCategoryDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(id, dto, user.company_id);
  }

  @Delete(':id')
  @RequirePermission('movie_categories', 'delete')
  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiResponse({ status: 200, description: 'Categoria excluída com sucesso.' })
  @ApiNotFoundResponse({ description: 'Categoria não encontrada.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.delete(id, user.company_id);
  }
}
