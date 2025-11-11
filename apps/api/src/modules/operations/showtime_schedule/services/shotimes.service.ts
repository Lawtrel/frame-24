import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  movies,
  Prisma,
  session_status,
  showtime_schedule as Showtime,
} from '@repo/db';

import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';

import { RoomsRepository } from '../../rooms/repositories/rooms.repository';

import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { SessionSeatStatusRepository } from 'src/modules/operations/session_seat_status/repositories/session-seat-status.repository';
import { ShowtimesRepository } from 'src/modules/operations/showtime_schedule/repositories/showtime.repository';
import { MovieRepository } from 'src/modules/catalog/movies/repositories/movie.repository';
import { SeatsRepository } from 'src/modules/operations/seats/repositories/seats.repository';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';
import { SeatStatusRepository } from 'src/modules/operations/seat-status/repositories/seat-status.repository';
import { UpdateShowtimeDto } from 'src/modules/operations/showtime_schedule/dto/update-showtime.dto';
import { SessionStatusRepository } from 'src/modules/operations/session-status/repositories/session-status.repository';

export interface ShowtimeDetailsDto {
  id: string;
  start_time: string;
  end_time: string;
  base_ticket_price: string;
  available_seats: number | null;
  sold_seats: number | null;
  blocked_seats: number | null;
  movie: movies | null;
  room: {
    id: string;
    name: string | null;
    capacity: number;
  } | null;
  complex: { id: string; name: string } | null;
  projection_type: any;
  audio_type: any;
  language: any;
  status: session_status | null;
}

export interface ShowtimeSeatDto {
  seat_id: string;
  row: string;
  number: number;
  accessible: boolean | null;
  status: { id: string; name: string };
  seat_type_id: string | null;
}

@Injectable()
export class ShowtimesService {
  constructor(
    private readonly showtimesRepository: ShowtimesRepository,
    private readonly sessionSeatStatusRepository: SessionSeatStatusRepository,
    private readonly sessionStatusRepository: SessionStatusRepository,
    private readonly roomsRepository: RoomsRepository,
    private readonly seatsRepository: SeatsRepository,
    private readonly moviesRepository: MovieRepository,
    private readonly cinemaComplexesRepository: CinemaComplexesRepository,
    private readonly snowflake: SnowflakeService,
    private readonly rabbitmq: RabbitMQPublisherService,
    private readonly seatStatusRepository: SeatStatusRepository,
  ) {}

  async findOne(id: string, user: RequestUser): Promise<ShowtimeDetailsDto> {
    const showtime = await this.showtimesRepository.findById(id);

    if (!showtime) {
      throw new NotFoundException('Sessão não encontrada.');
    }

    if (
      !showtime.cinema_complexes ||
      showtime.cinema_complexes.company_id !== user.company_id
    ) {
      throw new ForbiddenException('Acesso negado a esta sessão.');
    }

    const movie = await this.moviesRepository.findById(showtime.movie_id);

    return {
      id: showtime.id,
      start_time: new Date(showtime.start_time).toISOString(),
      end_time: new Date(showtime.end_time).toISOString(),
      base_ticket_price: showtime.base_ticket_price.toString(),
      available_seats: showtime.available_seats,
      sold_seats: showtime.sold_seats,
      blocked_seats: showtime.blocked_seats,
      movie,
      room: showtime.rooms,
      complex: showtime.cinema_complexes,
      projection_type: showtime.projection_types,
      audio_type: showtime.audio_types,
      language: showtime.session_languages,
      status: showtime.session_status,
    };
  }

  async findAll(
    user: RequestUser,
    filters?: {
      cinema_complex_id?: string;
      room_id?: string;
      movie_id?: string;
      start_time?: Date;
      status?: string;
    },
  ): Promise<any[]> {
    const companyId = user.company_id;

    const where: Prisma.showtime_scheduleWhereInput = {
      cinema_complexes: { company_id: companyId },
      ...(filters?.cinema_complex_id && {
        cinema_complex_id: filters.cinema_complex_id,
      }),
      ...(filters?.room_id && { room_id: filters.room_id }),
      ...(filters?.movie_id && { movie_id: filters.movie_id }),
      ...(filters?.start_time && { start_time: filters.start_time }),
      ...(filters?.status && { status: filters.status }),
    };

    return this.showtimesRepository.findAll(where);
  }

  @Transactional()
  async create(dto: CreateShowtimeDto, user: RequestUser): Promise<Showtime> {
    const companyId = user.company_id;

    if (dto.start_time < new Date()) {
      throw new ConflictException(
        'Não é possível criar uma sessão para uma data no passado.',
      );
    }
    const movie = await this.moviesRepository.findById(dto.movie_id);
    if (!movie || movie.company_id !== companyId) {
      throw new NotFoundException('Filme não encontrado.');
    }

    if (!movie.duration_minutes) {
      throw new BadRequestException(
        'O filme selecionado não tem uma duração cadastrada.',
      );
    }

    const room = await this.roomsRepository.findById(dto.room_id);
    if (!room) {
      throw new NotFoundException('Sala não encontrada.');
    }

    const startTime = dto.start_time;
    const endTime = new Date(
      startTime.getTime() + movie.duration_minutes * 60000,
    );
    const overlappingSessions =
      await this.showtimesRepository.findOverlappingSessions(
        dto.room_id,
        startTime,
        endTime,
      );

    if (overlappingSessions.length > 0) {
      throw new ConflictException(
        'Já existe uma sessão agendada que conflita com este horário.',
      );
    }

    const complex = await this.cinemaComplexesRepository.findById(
      room.cinema_complex_id,
    );
    if (!complex || complex.company_id !== companyId) {
      throw new ForbiddenException(
        'Acesso negado. Esta sala não pertence à sua empresa.',
      );
    }

    const showtimeId = this.snowflake.generate();
    const newShowtime = await this.showtimesRepository.create({
      id: showtimeId,
      cinema_complexes: { connect: { id: room.cinema_complex_id } },
      rooms: { connect: { id: dto.room_id } },
      movie_id: dto.movie_id,
      start_time: startTime,
      end_time: endTime,
      base_ticket_price: dto.base_ticket_price,
      available_seats: room.capacity,
      sold_seats: 0,
      blocked_seats: 0,
      ...(dto.projection_type && {
        projection_types: { connect: { id: dto.projection_type } },
      }),
      ...(dto.audio_type && {
        audio_types: { connect: { id: dto.audio_type } },
      }),
      ...(dto.session_language && {
        session_languages: { connect: { id: dto.session_language } },
      }),
      ...(dto.status && {
        session_status: { connect: { id: dto.status } },
      }),
    });

    const seats = await this.seatsRepository.findByRoomId(dto.room_id);
    const activeSeats = seats.filter((seat) => seat.active);

    const availableStatus =
      await this.seatStatusRepository.findDefaultByCompany(companyId);

    if (!availableStatus) {
      throw new NotFoundException(
        'Nenhum status de assento padrão foi configurado para esta empresa.',
      );
    }

    const seatStatusData = activeSeats.map((seat) => ({
      id: this.snowflake.generate(),
      showtime_id: showtimeId,
      seat_id: seat.id,
      status: availableStatus.id,
    }));

    await this.sessionSeatStatusRepository.createMany(seatStatusData);

    this.rabbitmq.publish({
      pattern: 'audit.showtime.created',
      data: { id: newShowtime.id, values: newShowtime },
      metadata: { companyId, userId: user.company_user_id },
    });

    return newShowtime;
  }

  @Transactional()
  async update(
    id: string,
    dto: UpdateShowtimeDto,
    user: RequestUser,
  ): Promise<Showtime> {
    const companyId = user.company_id;

    const existingShowtime = await this.findOne(id, user);
    let newStartTime = new Date(existingShowtime.start_time);
    let newEndTime = new Date(existingShowtime.end_time);

    if (dto.start_time) {
      if (dto.start_time < new Date()) {
        throw new BadRequestException(
          'Não é possível mover uma sessão para uma data ou hora no passado.',
        );
      }
      newStartTime = dto.start_time;

      const movie = await this.moviesRepository.findById(
        existingShowtime.movie!.id,
      );
      if (!movie || !movie.duration_minutes) {
        throw new NotFoundException('Filme ou sua duração não encontrados.');
      }
      newEndTime = new Date(
        newStartTime.getTime() + movie.duration_minutes * 60000,
      );

      const overlappingSessions =
        await this.showtimesRepository.findOverlappingSessions(
          existingShowtime.room!.id,
          newStartTime,
          newEndTime,
          id,
        );

      if (overlappingSessions.length > 0) {
        throw new ConflictException(
          'A alteração de horário conflita com outra sessão já agendada.',
        );
      }
    }
    const updateData: Prisma.showtime_scheduleUpdateInput = {
      start_time: newStartTime,
      end_time: newEndTime,
      ...(dto.base_ticket_price && {
        base_ticket_price: dto.base_ticket_price,
      }),
      ...(dto.projection_type !== undefined && {
        projection_types: dto.projection_type
          ? { connect: { id: dto.projection_type } }
          : { disconnect: true },
      }),
      ...(dto.audio_type !== undefined && {
        audio_types: dto.audio_type
          ? { connect: { id: dto.audio_type } }
          : { disconnect: true },
      }),
      ...(dto.session_language !== undefined && {
        session_languages: dto.session_language
          ? { connect: { id: dto.session_language } }
          : { disconnect: true },
      }),
      ...(dto.status && {
        session_status: { connect: { id: dto.status } },
      }),
    };

    const updatedShowtime = await this.showtimesRepository.update(
      id,
      updateData,
    );

    this.rabbitmq.publish({
      pattern: 'audit.showtime.updated',
      data: {
        id: updatedShowtime.id,
        new_values: updatedShowtime,
        old_values: existingShowtime,
      },
      metadata: { companyId, userId: user.company_user_id },
    });

    return updatedShowtime;
  }

  async getSeatsMap(id: string, user: RequestUser): Promise<ShowtimeSeatDto[]> {
    await this.findOne(id, user);

    const seatStatusList =
      await this.sessionSeatStatusRepository.findByShowtimeId(id);

    return seatStatusList.map((item) => ({
      seat_id: item.seat_id,
      row: item.seats.row_code,
      number: item.seats.column_number,
      accessible: item.seats.accessible ?? null,
      status: {
        id: item.seat_status.id,
        name: item.seat_status.name,
      },
      seat_type_id: item.seats.seat_type ?? null,
    }));
  }

  @Transactional()
  async remove(id: string, user: RequestUser): Promise<{ message: string }> {
    const companyId = user.company_id;
    const showtime = await this.findOne(id, user);

    const cancelledStatus =
      await this.sessionStatusRepository.findByNameAndCompany(
        'Cancelada',
        companyId,
      );

    if (!cancelledStatus) {
      throw new NotFoundException(
        'Status "Cancelada" não configurado para esta empresa. Não é possível cancelar a sessão.',
      );
    }

    await this.showtimesRepository.update(id, {
      session_status: { connect: { id: cancelledStatus.id } },
    });

    this.rabbitmq.publish({
      pattern: 'audit.showtime.cancelled',
      data: { id: showtime.id, old_values: showtime },
      metadata: { companyId, userId: user.company_user_id },
    });

    return { message: 'Sessão cancelada com sucesso.' };
  }
}
