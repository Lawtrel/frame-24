import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class UserManagementController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermission('users', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Administrador cria um novo usuário na empresa. O sistema gera um ID de funcionário automaticamente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Role inválida, CPF duplicado ou dados inválidos',
  })
  @ApiConflictResponse({
    description: 'Email ou CPF já cadastrado nesta empresa',
  })
  async createUser(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: RequestUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.create(dto, user.company_id);
  }

  @Get()
  @RequirePermission('users', 'read')
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista todos os usuários da empresa do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  async listUsers(
    @CurrentUser() user: RequestUser,
  ): Promise<UserResponseDto[]> {
    return await this.usersService.findAll(user.company_id);
  }

  @Get(':employee_id')
  @RequirePermission('users', 'read')
  @ApiOperation({
    summary: 'Buscar usuário por employee_id',
    description:
      'Retorna os detalhes de um usuário específico pelo seu employee_id.',
  })
  async getUser(
    @Param('employee_id') employee_id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.findOne(employee_id, user.company_id);
  }

  @Put(':employee_id')
  @RequirePermission('users', 'update')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza os dados de um usuário existente. Use o employee_id (ex: CE-0001) para identificar o usuário.',
  })
  async updateUser(
    @Param('employee_id') employee_id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: RequestUser,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(employee_id, dto, user.company_id);
  }

  @Delete(':employee_id')
  @RequirePermission('users', 'delete')
  @ApiOperation({
    summary: 'Deletar usuário',
    description:
      'Desativa um usuário (soft delete). O usuário permanece no banco mas fica inativo e não pode mais fazer login.',
  })
  async deleteUser(
    @Param('employee_id') employee_id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.usersService.softDelete(employee_id, user.company_id);
  }
}
