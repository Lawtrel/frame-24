import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovieCategoriesController } from './controllers/movie-categories.controller';
import { MovieCategoriesService } from './services/movie-categories.service';
import { MovieCategoryRepository } from './repositories/movie-category.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { LoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [MovieCategoriesController],
  providers: [
    MovieCategoriesService,
    MovieCategoryRepository,
    SnowflakeService,
    LoggerService,
  ],
  exports: [MovieCategoriesService, MovieCategoryRepository],
})
export class MovieCategoriesModule {}
