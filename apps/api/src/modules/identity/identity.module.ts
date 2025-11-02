import { Module } from '@nestjs/common';
import { CompanyModule } from './companies/company.module';
import { AuthModule } from 'src/modules/identity/auth/auth.module';

@Module({
  imports: [CompanyModule, AuthModule],
  exports: [CompanyModule, AuthModule],
})
export class IdentityModule {}
