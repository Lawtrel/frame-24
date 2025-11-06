import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';

import { IdentityRepository } from './repositories/identity.repository';
import { PersonRepository } from './repositories/person.repository';
import { CompanyUserRepository } from './repositories/company-user.repository';
import { CustomRoleRepository } from './repositories/custom-role.repository';
import { CompanyRepository } from '../companies/repositories/company.repository';

import { AuthService } from './services/auth.service';
import { MasterDataSetupService } from 'src/modules/setup/services/master-data-setup.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './controllers/auth.controller';
import { EmployeeIdGeneratorService } from 'src/modules/identity/auth/services/employee-id-generator';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' },
    }),
    CommonModule,
  ],
  providers: [
    IdentityRepository,
    PersonRepository,
    CompanyUserRepository,
    CustomRoleRepository,
    CompanyRepository,
    EmployeeIdGeneratorService,
    AuthService,
    MasterDataSetupService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
