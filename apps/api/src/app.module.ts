import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { StorageModule } from './modules/storage/storage.module';
import { IdentityModule } from 'src/modules/identity/identity.module';
import { SuppliersModule } from 'src/modules/inventory/suppliers/suppliers.module';
import { CatalogModule } from 'src/modules/catalog/catalog.module';
import { MarketingModule } from 'src/modules/marketing/marketing.module';
import { FinanceModule } from 'src/modules/finance/finance.module';
import { AdminModule } from 'src/modules/admin/admin.module';
import { WorkersModule } from 'src/workers/workers.module';
import { CommonModule } from 'src/common/common.module';
import { AuditModule } from 'src/common/audit/audit.module';
import { EmailModule } from 'src/modules/email/email.module';
import { OperationsModule } from 'src/modules/operations/operations.module';
import { SalesModule } from 'src/modules/sales/sales.module';
import { StockModule } from 'src/modules/stock/stock.module';
import { PublicModule } from 'src/modules/public/public.module';
import { CrmModule } from 'src/modules/crm/crm.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Security: Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    CommonModule,
    PrismaModule,
    StorageModule,
    IdentityModule,
    SuppliersModule,
    CatalogModule,
    MarketingModule,
    FinanceModule,
    AdminModule,
    WorkersModule,
    AuditModule,
    EmailModule,
    OperationsModule,
    SalesModule,
    StockModule,
    PublicModule,
    CrmModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
