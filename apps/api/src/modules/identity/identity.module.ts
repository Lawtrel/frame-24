import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';
import { AuthModule } from 'src/modules/identity/auth/auth.module';
import { UsersModule } from 'src/modules/identity/users/users.module';
import { RolesModule } from 'src/modules/identity/roles/roles.module';

@Module({
  imports: [CompanyModule, UsersModule, RolesModule, AuthModule],
  exports: [CompanyModule, UsersModule, RolesModule, AuthModule],
})
export class IdentityModule {}
