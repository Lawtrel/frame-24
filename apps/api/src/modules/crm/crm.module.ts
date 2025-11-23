import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/modules/identity/auth/auth.module';
import { CustomerAuthController } from './controllers/customer-auth.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerPurchasesController } from './controllers/customer-purchases.controller';
import { CustomerAuthService } from './services/customer-auth.service';
import { CustomerPurchasesService } from './services/customer-purchases.service';
import { CustomersRepository } from './repositories/customers.repository';
import { CompanyCustomersRepository } from './repositories/company-customers.repository';
import { SalesModule } from 'src/modules/sales/sales.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    AuthModule,
    SalesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [
    CustomerAuthController,
    CustomerController,
    CustomerPurchasesController,
  ],
  providers: [
    CustomerAuthService,
    CustomerPurchasesService,
    CustomersRepository,
    CompanyCustomersRepository,
  ],
  exports: [
    CustomerAuthService,
    CustomersRepository,
    CompanyCustomersRepository,
  ],
})
export class CrmModule {}
