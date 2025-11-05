import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionDiscoveryService } from '../services/permission-discovery.service';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { RequestUser } from '../../auth/strategies/jwt.strategy';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('admin/permissions')
@UseGuards(AuthGuard('jwt'), AuthorizationGuard)
export class PermissionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionDiscovery: PermissionDiscoveryService,
  ) {}

  @Get()
  @RequirePermission('permissions', 'read')
  @ApiOperation({
    summary: 'Listar todas as permissões',
    description:
      'Retorna todas as permissões disponíveis no sistema, agrupadas por recurso. Use essas permissões ao criar roles.',
  })
  async listPermissions(@CurrentUser() user: RequestUser) {
    const permissions = await this.prisma.permissions.findMany({
      where: {
        company_id: user.company_id,
        active: true,
      },
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });

    const grouped = permissions.reduce(
      (acc, perm) => {
        if (!acc[perm.resource]) {
          acc[perm.resource] = [];
        }
        acc[perm.resource].push({
          id: perm.id,
          permission: perm.code,
          resource: perm.resource,
          action: perm.action,
          name: perm.name,
          description: perm.description,
        });
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return grouped;
  }

  @Post('sync')
  @RequirePermission('permissions', 'update')
  @ApiOperation({
    summary: 'Sincronizar permissões',
    description:
      'Força sincronização das permissões do código para o banco de dados. Útil após adicionar novos controllers.',
  })
  async syncPermissions(@CurrentUser() user: RequestUser) {
    await this.permissionDiscovery.syncCompanyPermissions(user.company_id);
    return { message: 'Permissions synced successfully' };
  }
}
