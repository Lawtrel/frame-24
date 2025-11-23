import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Prisma, custom_roles } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CustomRoleRepository } from '../repositories/custom-role.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleRepo: CustomRoleRepository,
    private readonly logger: LoggerService,
    private readonly snowflake: SnowflakeService,
  ) {}

  @Transactional()
  async create(
    dto: CreateRoleDto,
    company_id: string,
    granted_by?: string,
  ): Promise<RoleResponseDto> {
    const existing = await this.roleRepo.findByName(company_id, dto.name);
    if (existing) {
      throw new ConflictException('Role with this name already exists');
    }

    const permissionIds = await this.getPermissionIds(
      dto.permissions,
      company_id,
    );

    const role = await this.roleRepo.create({
      companies: { connect: { id: company_id } },
      name: dto.name,
      description: dto.description,
      is_system_role: false,
      hierarchy_level: dto.hierarchy_level || 50,
    } as Prisma.custom_rolesCreateInput);

    await this.prisma.role_permissions.createMany({
      data: permissionIds.map((permId) => ({
        id: this.snowflake.generate().toString(),
        role_id: role.id,
        permission_id: permId,
        granted_at: new Date(),
        granted_by: granted_by || null,
      })),
    });

    this.logger.log(
      `Role created: ${role.name} with ${permissionIds.length} permissions`,
      RolesService.name,
    );

    return this.mapToDto(role, dto.permissions);
  }

  async findAll(company_id: string): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepo.findAllByCompany(company_id);

    const result: RoleResponseDto[] = [];
    for (const role of roles) {
      const permissions = await this.roleRepo.getRolePermissions(role.id);
      result.push(this.mapToDto(role, permissions));
    }

    return result;
  }

  async findOne(id: string, company_id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepo.findByIdAndCompany(id, company_id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.roleRepo.getRolePermissions(id);

    return this.mapToDto(role, permissions);
  }

  @Transactional()
  async update(
    id: string,
    dto: UpdateRoleDto,
    company_id: string,
    granted_by?: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepo.findByIdAndCompany(id, company_id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.is_system_role) {
      throw new BadRequestException('Cannot edit system role');
    }

    if (dto.name && dto.name !== role.name) {
      const existing = await this.roleRepo.findByName(company_id, dto.name);
      if (existing) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    const updated = await this.roleRepo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.hierarchy_level !== undefined && {
        hierarchy_level: dto.hierarchy_level,
      }),
    });

    if (dto.permissions) {
      const permissionIds = await this.getPermissionIds(
        dto.permissions,
        company_id,
      );

      await this.prisma.role_permissions.deleteMany({
        where: { role_id: id },
      });

      // ✅ Usar Snowflake aqui também
      await this.prisma.role_permissions.createMany({
        data: permissionIds.map((permId) => ({
          id: this.snowflake.generate().toString(),
          role_id: id,
          permission_id: permId,
          granted_at: new Date(),
          granted_by: granted_by || null,
        })),
      });

      this.logger.log(
        `Role ${updated.name} permissions updated`,
        RolesService.name,
      );
    }

    const permissions =
      dto.permissions || (await this.roleRepo.getRolePermissions(id));

    return this.mapToDto(updated, permissions);
  }

  @Transactional()
  async delete(id: string, company_id: string): Promise<void> {
    const role = await this.roleRepo.findByIdAndCompany(id, company_id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.is_system_role) {
      throw new BadRequestException('Cannot delete system role');
    }

    const usersCount = await this.prisma.company_users.count({
      where: { role_id: id },
    });

    if (usersCount > 0) {
      throw new BadRequestException(
        `Cannot delete role: ${usersCount} users are using it`,
      );
    }

    await this.roleRepo.delete(id);

    this.logger.log(`Role deleted: ${role.name}`, RolesService.name);
  }

  private async getPermissionIds(
    codes: string[],
    company_id: string,
  ): Promise<string[]> {
    const permissions = await this.prisma.permissions.findMany({
      where: {
        company_id,
        code: { in: codes },
        active: true,
      },
      select: { id: true, code: true },
    });

    const foundCodes = new Set(permissions.map((p) => p.code));
    const missing = codes.filter((c) => !foundCodes.has(c));

    if (missing.length > 0) {
      throw new BadRequestException(
        `Invalid permissions: ${missing.join(', ')}. Use GET /admin/permissions to list available ones.`,
      );
    }

    return permissions.map((p) => p.id);
  }

  private mapToDto(role: custom_roles, permissions: string[]): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description ?? null,
      is_system_role: role.is_system_role ?? false,
      hierarchy_level: role.hierarchy_level ?? null,
      permissions,
      created_at: role.created_at?.toISOString() ?? '',
      updated_at: role.updated_at?.toISOString() ?? '',
    };
  }

  async roleHasPermission(
    roleId: string,
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'audit',
  ): Promise<boolean> {
    try {
      // ✅ Check if the role is a super admin or admin (hierarchy_level 0-10)
      const role = await this.prisma.custom_roles.findUnique({
        where: { id: roleId },
        select: { hierarchy_level: true },
      });

      // If super admin or admin, grant access to everything
      if (role && role.hierarchy_level !== null && role.hierarchy_level <= 10) {
        return true;
      }

      // ✅ Otherwise, check specific permission
      const hasPermission = await this.prisma.role_permissions.findFirst({
        where: {
          role_id: roleId,
          permissions: {
            code: `${resource}:${action}`,
            active: true,
          },
        },
      });

      return !!hasPermission;
    } catch (error) {
      this.logger.error(
        `Error checking role permission: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : '',
        'RolesService',
      );
      return false;
    }
  }
  async userHasPermissionSimple(
    companyUserId: string,
    companyId: string,
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'audit',
  ): Promise<boolean> {
    try {
      const companyUser = await this.prisma.company_users.findUnique({
        where: { id: companyUserId },
        select: { company_id: true },
      });

      if (!companyUser || companyUser.company_id !== companyId) {
        return false;
      }

      const hasPermission = await this.prisma.role_permissions.findFirst({
        where: {
          custom_roles: {
            company_users: {
              some: { id: companyUserId },
            },
          },
          permissions: {
            code: `${resource}:${action}`,
            active: true,
          },
        },
      });

      return !!hasPermission;
    } catch (error) {
      this.logger.error(
        `Error checking permission: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : '',
        'RolesService',
      );
      return false;
    }
  }
}
