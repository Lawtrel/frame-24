import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { seats as Seat } from '@repo/db';

import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';

import { SeatsRepository } from '../repositories/seats.repository';
import { RoomsRepository } from '../../rooms/repositories/rooms.repository';
import { CinemaComplexesRepository } from '../../cinema-complexes/repositories/cinema-complexes.repository';
import { Transactional } from '@nestjs-cls/transactional';
import { UpdateSeatsStatusBatchDto } from 'src/modules/operations/seats/dto/update-seats-status-batch.dto';

@Injectable()
export class SeatsService {
  constructor(
    private readonly seatsRepository: SeatsRepository,
    private readonly roomsRepository: RoomsRepository,
    private readonly cinemaComplexesRepository: CinemaComplexesRepository,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  async updateStatus(
    seatId: string,
    active: boolean,
    user: RequestUser,
  ): Promise<Seat> {
    const companyId = user.company_id;

    const existingSeat = await this.validateSeatOwnership(seatId, companyId);

    const updatedSeat = await this.seatsRepository.update(seatId, { active });

    void this.rabbitmq.publish({
      pattern: 'audit.seat.updated',
      data: {
        id: updatedSeat.id,
        new_values: updatedSeat,
        old_values: existingSeat,
      },
      metadata: { companyId, userId: user.company_user_id },
    });

    return updatedSeat;
  }

  private async validateSeatOwnership(
    seatId: string,
    companyId: string,
  ): Promise<Seat> {
    const seat = await this.seatsRepository.findById(seatId);
    if (!seat) {
      throw new NotFoundException('Assento não encontrado.');
    }

    const room = await this.roomsRepository.findById(seat.room_id);
    if (!room) {
      throw new NotFoundException('Sala associada ao assento não encontrada.');
    }

    const complex = await this.cinemaComplexesRepository.findById(
      room.cinema_complex_id,
    );
    if (!complex || complex.company_id !== companyId) {
      throw new ForbiddenException('Acesso negado a este recurso.');
    }

    return seat;
  }

  @Transactional()
  async updateStatusBatch(
    dto: UpdateSeatsStatusBatchDto,
    user: RequestUser,
  ): Promise<{ updated: number }> {
    const companyId = user.company_id;
    const seatIds = dto.seats.map((s) => s.seat_id);

    await this.validateMultipleSeatsOwnership(seatIds, companyId);

    const idsToActivate = dto.seats
      .filter((s) => s.active)
      .map((s) => s.seat_id);

    const idsToDeactivate = dto.seats
      .filter((s) => !s.active)
      .map((s) => s.seat_id);

    let totalUpdated = 0;

    if (idsToActivate.length > 0) {
      const result = await this.seatsRepository.updateMany(
        { id: { in: idsToActivate } },
        { active: true },
      );
      totalUpdated += result.count;
    }

    if (idsToDeactivate.length > 0) {
      const result = await this.seatsRepository.updateMany(
        { id: { in: idsToDeactivate } },
        { active: false },
      );
      totalUpdated += result.count;
    }

    void this.rabbitmq.publish({
      pattern: 'audit.seat.batch_updated',
      data: {
        changes: dto.seats,
        total_affected: totalUpdated,
      },
      metadata: { companyId, userId: user.company_user_id },
    });

    return { updated: totalUpdated };
  }

  private async validateMultipleSeatsOwnership(
    seatIds: string[],
    companyId: string,
  ): Promise<void> {
    const uniqueSeatIds = [...new Set(seatIds)];

    const foundSeats = await this.seatsRepository.findManyWithOwnership(
      uniqueSeatIds,
      companyId,
    );

    if (foundSeats.length !== uniqueSeatIds.length) {
      throw new ForbiddenException(
        'Acesso negado. Um ou mais assentos não foram encontrados',
      );
    }
  }
}
