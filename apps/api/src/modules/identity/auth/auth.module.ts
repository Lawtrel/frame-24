import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from '../companies/company.module';

import { IdentityRepository } from './repositories/identity.repository';
import { PersonRepository } from './repositories/person.repository';
import { CompanyUserRepository } from './repositories/company-user.repository';
import { CustomRoleRepository } from './repositories/custom-role.repository';
import { CompanyRepository } from '../companies/repositories/company.repository';

import { AuthService } from './services/auth.service';
import { CredentialValidatorService } from './services/credential-validator.service';
import { AccountStatusCheckerService } from './services/account-status-checker.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { TokenGeneratorService } from './services/token-generator.service';
import { LoginTrackerService } from './services/login-tracker.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordResetService } from './services/password-reset.service';
import { IdentityCreatorService } from './services/identity-creator.service';
import { CompanyUserLinkerService } from './services/company-user-linker.service';
import { IdentityEventPublisherService } from './services/identity-event-publisher.service';
import { EmployeeIdGeneratorService } from './services/employee-id-generator';

import { MasterDataSetupService } from 'src/modules/setup/services/master-data-setup.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '8h' },
    }),
    CommonModule,
    forwardRef(() => CompanyModule),
  ],
  providers: [
    IdentityRepository,
    PersonRepository,
    CompanyUserRepository,
    CustomRoleRepository,
    CompanyRepository,
    AuthService,
    CredentialValidatorService,
    AccountStatusCheckerService,
    LoginAttemptService,
    TokenGeneratorService,
    LoginTrackerService,
    EmailVerificationService,
    PasswordResetService,
    IdentityCreatorService,
    CompanyUserLinkerService,
    IdentityEventPublisherService,
    EmployeeIdGeneratorService,
    MasterDataSetupService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    IdentityRepository,
    PersonRepository,
    CompanyUserRepository,
    CustomRoleRepository,
    EmployeeIdGeneratorService,
    JwtStrategy,
  ],
})
export class AuthModule {}
