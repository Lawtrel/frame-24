import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AudioTypesController } from './controllers/audio-types.controller';
import { AudioTypesService } from './services/audio-types.service';
import { AudioTypesRepository } from './repositories/audio-types.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AudioTypesController],
  providers: [AudioTypesService, AudioTypesRepository],
  exports: [AudioTypesRepository],
})
export class AudioTypesModule {}
