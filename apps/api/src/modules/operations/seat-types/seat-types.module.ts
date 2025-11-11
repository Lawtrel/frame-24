import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { SeatTypesController } from './controllers/seat-types.controller';
import { SeatTypesService } from './services/seat-types.service';
import { SeatTypesRepository } from './repositories/seat-types.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SeatTypesController],
  providers: [SeatTypesService, SeatTypesRepository],
  exports: [SeatTypesRepository],
})
export class SeatTypesModule {}
