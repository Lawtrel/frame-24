import { Module } from '@nestjs/common';
import { UserManagementController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { IdentityRepository } from '../auth/repositories/identity.repository';
import { PersonRepository } from '../auth/repositories/person.repository';
import { CompanyUserRepository } from '../auth/repositories/company-user.repository';
import { CustomRoleRepository } from 'src/modules/identity/auth/repositories/custom-role.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UserManagementController],
  providers: [
    UsersService,
    IdentityRepository,
    PersonRepository,
    CompanyUserRepository,
    CustomRoleRepository,
    EmployeeIdGeneratorService,
  ],
  exports: [UsersService, EmployeeIdGeneratorService],
})
export class UsersModule {}
