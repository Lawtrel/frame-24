import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SeatStatusController } from './controllers/seat-status.controller';
import { SeatStatusRepository } from './repositories/seat-status.repository';
import { SeatStatusService } from './services/seat-status.service';

@Module({
  imports: [PrismaModule],
  controllers: [SeatStatusController],
  providers: [SeatStatusService, SeatStatusRepository],
  exports: [SeatStatusRepository],
})
export class SeatStatusModule {}
