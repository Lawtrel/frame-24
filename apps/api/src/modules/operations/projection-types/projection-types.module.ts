import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ProjectionTypesController } from './controllers/projection-types.controller';
import { ProjectionTypesService } from './services/projection-types.service';
import { ProjectionTypesRepository } from './repositories/projection-types.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectionTypesController],
  providers: [ProjectionTypesService, ProjectionTypesRepository],
  exports: [ProjectionTypesRepository],
})
export class ProjectionTypesModule {}
