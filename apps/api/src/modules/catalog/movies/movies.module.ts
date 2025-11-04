import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/identity/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { MovieRepository } from './repositories/movie.repository';

import { SupplierRepository } from 'src/modules/inventory/suppliers/repositories/supplier.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MovieRepository,
    SupplierRepository,
    SnowflakeService,
    LoggerService,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
