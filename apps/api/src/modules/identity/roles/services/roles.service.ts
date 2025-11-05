import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Prisma, custom_roles } from '@repo/db'; // ✅ Importar tipo
import { PrismaService } from 'src/prisma/prisma.service';
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
        id: `${role.id}_${permId.substring(0, 10)}`,
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

      await this.prisma.role_permissions.createMany({
        data: permissionIds.map((permId) => ({
          id: `${id}_${permId.substring(0, 10)}`,
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
}
