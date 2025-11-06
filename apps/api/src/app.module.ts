import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { IdentityModule } from 'src/modules/identity/identity.module';
import { SuppliersModule } from 'src/modules/inventory/suppliers/suppliers.module';
import { CatalogModule } from 'src/modules/catalog/catalog.module';
import { WorkersModule } from 'src/workers/workers.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
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
    IdentityModule,
    SuppliersModule,
    CatalogModule,
    WorkersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
