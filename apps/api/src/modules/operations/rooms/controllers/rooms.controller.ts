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
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUpload } from 'src/common/decorators/file-upload.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { RoomsService } from '../services/rooms.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

@ApiTags('Operations', 'Rooms')
@ApiBearerAuth()
@Controller({ path: 'cinema-complexes/:cinemaComplexId/rooms', version: '1' })
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class RoomsController {
  constructor(private readonly service: RoomsService) { }

  @Post()
  @FileUpload('layout_image', false)
  @RequirePermission('rooms', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova sala em um complexo' })
  @ApiResponse({
    status: 201,
    description: 'Sala e assentos criados com sucesso.',
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou inconsistentes.' })
  @ApiNotFoundResponse({ description: 'Complexo de cinema não encontrado.' })
  @ApiConflictResponse({
    description: 'Número de sala já em uso neste complexo.',
  })
  async create(
    @Param('cinemaComplexId') cinemaComplexId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateRoomDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.create(cinemaComplexId, dto, user, file);
  }

  @Get()
  @RequirePermission('rooms', 'read')
  @ApiOperation({ summary: 'Listar todas as salas de um complexo' })
  @ApiResponse({ status: 200, description: 'Lista de salas retornada.' })
  @ApiNotFoundResponse({ description: 'Complexo de cinema não encontrado.' })
  async findAll(
    @Param('cinemaComplexId') cinemaComplexId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.findAll(cinemaComplexId, user.company_id);
  }

  @Get(':id')
  @RequirePermission('rooms', 'read')
  @ApiOperation({ summary: 'Buscar uma sala específica por ID' })
  @ApiResponse({ status: 200, description: 'Sala encontrada.' })
  @ApiNotFoundResponse({ description: 'Sala não encontrada.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.findOne(id, user.company_id);
  }

  @Put(':id')
  @FileUpload('layout_image', false)
  @RequirePermission('rooms', 'update')
  @ApiOperation({ summary: 'Atualizar uma sala' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Sala não encontrada.' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateRoomDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.service.update(id, dto, user, file);
  }

  @Delete(':id')
  @RequirePermission('rooms', 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir uma sala' })
  @ApiResponse({ status: 200, description: 'Sala excluída com sucesso.' })
  @ApiNotFoundResponse({ description: 'Sala não encontrada.' })
  async delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.service.delete(id, user);
  }
}
