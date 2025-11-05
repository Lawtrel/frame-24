import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { SupplierRepository } from './repositories/supplier.repository';
import { SuppliersService } from './services/suppliers.service';
import { SuppliersController } from './controllers/suppliers.controller';

import { LoggerService } from 'src/common/services/logger.service';
import { SnowflakeService } from 'src/common/services/snowflake.service';

@Module({
  imports: [PrismaModule],
  providers: [
    SupplierRepository,
    SuppliersService,
    LoggerService,
    SnowflakeService,
  ],
  controllers: [SuppliersController],
  exports: [SuppliersService],
})
export class SuppliersModule {}
