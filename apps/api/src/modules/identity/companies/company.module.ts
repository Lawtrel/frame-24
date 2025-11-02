import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompanyService } from './services/company.service';
import { CompanyRepository } from './repositories/company.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { AuthModule } from 'src/modules/identity/auth/auth.module';
import { SuppliersModule } from 'src/modules/inventory/suppliers/suppliers.module';

@Module({
  imports: [PrismaModule, AuthModule, SuppliersModule],
  controllers: [],
  providers: [
    CompanyRepository,
    CompanyService,
    LoggerService,
    SnowflakeService,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
