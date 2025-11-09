import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { UpdateShowtimeDto } from '../dto/update-showtime.dto';
import { ShowtimesService } from 'src/modules/operations/showtime_schedule/services/shotimes.service';

@ApiTags('Showtimes')
@ApiBearerAuth()
@Controller('showtimes')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class ShowtimesController {
  constructor(private readonly service: ShowtimesService) {}

  @Post()
  @RequirePermission('showtimes', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova sessão de cinema' })
  @ApiResponse({ status: 201, description: 'Sessão criada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Filme, sala ou status não encontrado.' })
  @ApiConflictResponse({
    description: 'Já existe uma sessão agendada nesta sala neste horário.',
  })
  @ApiForbiddenResponse({
    description: 'Acesso negado. A sala não pertence à sua empresa.',
  })
  async create(
    @Body() dto: CreateShowtimeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(dto, user);
  }

  @Get()
  @RequirePermission('showtimes', 'read')
  @ApiOperation({ summary: 'Listar todas as sessões' })
  @ApiQuery({ name: 'cinema_complex_id', required: false })
  @ApiQuery({ name: 'room_id', required: false })
  @ApiQuery({ name: 'movie_id', required: false })
  @ApiQuery({
    name: 'session_date',
    required: false,
    type: 'string',
    format: 'date',
  })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @CurrentUser() user: RequestUser,
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('room_id') room_id?: string,
    @Query('movie_id') movie_id?: string,
    @Query('start_time') start_time?: Date,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(user, {
      cinema_complex_id,
      room_id,
      movie_id,
      start_time,
      status,
    });
  }

  @Get(':id')
  @RequirePermission('showtimes', 'read')
  @ApiOperation({ summary: 'Buscar uma sessão específica por ID' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<any> {
    return this.service.findOne(id, user);
  }

  @Get(':id/seats')
  @RequirePermission('showtimes', 'read')
  @ApiOperation({ summary: 'Obter o mapa de assentos de uma sessão' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  async getSeatsMap(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.getSeatsMap(id, user);
  }

  @Patch(':id')
  @RequirePermission('showtimes', 'update')
  @ApiOperation({ summary: 'Atualizar uma sessão existente' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  @ApiConflictResponse({ description: 'Conflito de horário com outra sessão.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShowtimeDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermission('showtimes', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar uma sessão' })
  @ApiResponse({ status: 200, description: 'Sessão cancelada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  async remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.remove(id, user);
  }
}
