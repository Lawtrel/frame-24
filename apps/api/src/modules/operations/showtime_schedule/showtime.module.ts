import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

// Módulos que este service precisa
import { CinemaComplexesModule } from '../cinema-complexes/cinema-complexes.module';
import { RoomsModule } from '../rooms/rooms.module';
import { SeatsModule } from '../seats/seats.module';
import { MoviesModule } from '../../catalog/movies/movies.module';
import { SeatStatusModule } from 'src/modules/operations/seat-status/seat-status.module';
import { SessionSeatStatusModule } from 'src/modules/operations/session_seat_status/session-seat-status.module';
import { ShowtimesController } from 'src/modules/operations/showtime_schedule/controllers/shotimes.controller';
import { ShowtimesService } from 'src/modules/operations/showtime_schedule/services/shotimes.service';
import { ShowtimesRepository } from 'src/modules/operations/showtime_schedule/repositories/showtime.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionStatusModule } from 'src/modules/operations/session-status/session-status.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    CinemaComplexesModule,
    RoomsModule,
    SeatsModule,
    MoviesModule,
    SeatStatusModule,
    SessionSeatStatusModule,
    SessionStatusModule,
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimesRepository],
})
export class ShowtimesModule {}
