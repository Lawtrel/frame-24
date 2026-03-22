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
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { UpdateShowtimeDto } from '../dto/update-showtime.dto';
import { UpdateShowtimeSeatStatusDto } from '../dto/update-showtime-seat-status.dto';
import {
  ShowtimeDetailsDto,
  ShowtimesService,
} from 'src/modules/operations/showtime_schedule/services/shotimes.service';

@ApiTags('Showtimes')
@ApiBearerAuth()
@Controller({ path: 'showtimes', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class ShowtimesController {
  constructor(private readonly service: ShowtimesService) {}

  @Post('preview')
  @RequirePermission('showtimes', 'create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preview da projeção financeira de uma sessão',
    description:
      'Retorna o breakdown financeiro calculado sem salvar a sessão no banco.',
  })
  @ApiResponse({
    status: 200,
    description: 'Projeção financeira calculada com sucesso.',
  })
  @ApiNotFoundResponse({ description: 'Filme ou sala não encontrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso negado. A sala não pertence à sua empresa.',
  })
  async preview(@Body() dto: CreateShowtimeDto) {
    return this.service.preview(dto);
  }

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
  async create(@Body() dto: CreateShowtimeDto) {
    return this.service.create(dto);
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
    @Query('cinema_complex_id') cinema_complex_id?: string,
    @Query('room_id') room_id?: string,
    @Query('movie_id') movie_id?: string,
    @Query('start_time') start_time?: Date,
    @Query('status') status?: string,
  ) {
    return this.service.findAll({
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
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ShowtimeDetailsDto> {
    return this.service.findOne(id);
  }

  @Get(':id/seats')
  @RequirePermission('showtimes', 'read')
  @ApiOperation({ summary: 'Obter o mapa de assentos de uma sessão' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  async getSeatsMap(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getSeatsMap(id);
  }

  @Patch(':id')
  @RequirePermission('showtimes', 'update')
  @ApiOperation({ summary: 'Atualizar uma sessão existente' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  @ApiConflictResponse({ description: 'Conflito de horário com outra sessão.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShowtimeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('showtimes', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar uma sessão' })
  @ApiResponse({ status: 200, description: 'Sessão cancelada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Sessão não encontrada.' })
  @ApiForbiddenResponse({ description: 'Acesso negado a esta sessão.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Put(':id/seats/:seatId/status')
  @RequirePermission('showtimes', 'update')
  @ApiOperation({
    summary: 'Atualizar o status manual de um assento em uma sessão',
  })
  async updateSeatStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('seatId') seatId: string,
    @Body() dto: UpdateShowtimeSeatStatusDto,
  ) {
    await this.service.updateSeatStatus(id, seatId, dto.status);
    return { success: true };
  }
}
