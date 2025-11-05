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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from '../../auth/strategies/jwt.strategy';

import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleResponseDto } from '../dto/role-response.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('admin/roles')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission('roles', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar role customizada',
    description:
      'Cria uma nova role para a empresa com permissões específicas. Use GET /admin/permissions para listar permissões disponíveis.',
  })
  async createRole(
    @Body() dto: CreateRoleDto,
    @CurrentUser() user: RequestUser,
  ): Promise<RoleResponseDto> {
    return await this.rolesService.create(
      dto,
      user.company_id,
      user.identity_id,
    );
  }

  @Get()
  @RequirePermission('roles', 'read')
  @ApiOperation({
    summary: 'Listar todas as roles',
    description:
      'Retorna todas as roles (customizadas e do sistema) da empresa, ordenadas por nível hierárquico.',
  })
  async listRoles(
    @CurrentUser() user: RequestUser,
  ): Promise<RoleResponseDto[]> {
    return await this.rolesService.findAll(user.company_id);
  }

  @Get(':id')
  @RequirePermission('roles', 'read')
  @ApiOperation({
    summary: 'Buscar role por ID',
    description:
      'Retorna os detalhes de uma role específica, incluindo suas permissões.',
  })
  async getRole(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<RoleResponseDto> {
    return await this.rolesService.findOne(id, user.company_id);
  }

  @Put(':id')
  @RequirePermission('roles', 'update')
  @ApiOperation({
    summary: 'Atualizar role',
    description:
      'Atualiza uma role customizada. Roles do sistema não podem ser editadas. Ao atualizar permissões, a lista completa substitui as anteriores.',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: RequestUser,
  ): Promise<RoleResponseDto> {
    return await this.rolesService.update(
      id,
      dto,
      user.company_id,
      user.identity_id,
    );
  }

  @Delete(':id')
  @RequirePermission('roles', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar role',
    description:
      'Deleta uma role customizada permanentemente. Roles do sistema ou que estão sendo usadas por usuários não podem ser deletadas.',
  })
  async deleteRole(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    return await this.rolesService.delete(id, user.company_id);
  }
}
