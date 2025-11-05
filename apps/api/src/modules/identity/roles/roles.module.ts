import { Module, Global } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { RolesController } from './controllers/roles.controller';

import { RolesService } from './services/roles.service';
import { PermissionDiscoveryService } from './services/permission-discovery.service';

import { CustomRoleRepository } from './repositories/custom-role.repository';

import { PrismaModule } from 'src/prisma/prisma.module';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';
import { PermissionsController } from 'src/modules/identity/roles/controllers/permissions.controller';

@Global()
@Module({
  imports: [DiscoveryModule, PrismaModule],
  controllers: [RolesController, PermissionsController],
  providers: [
    RolesService,
    PermissionDiscoveryService,
    CustomRoleRepository,
    SnowflakeService,
    LoggerService,
  ],
  exports: [RolesService, CustomRoleRepository, PermissionDiscoveryService],
})
export class RolesModule {}
