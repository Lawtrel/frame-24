import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { TicketsRepository } from '../repositories/tickets.repository';
import { ShowtimesRepository } from 'src/modules/operations/showtime_schedule/repositories/showtime.repository';
import { SessionSeatStatusRepository } from 'src/modules/operations/session_seat_status/repositories/session-seat-status.repository';
import { SeatStatusRepository } from 'src/modules/operations/seat-status/repositories/seat-status.repository';
import { SeatsRepository } from 'src/modules/operations/seats/repositories/seats.repository';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly showtimesRepository: ShowtimesRepository,
    private readonly sessionSeatStatusRepository: SessionSeatStatusRepository,
    private readonly seatStatusRepository: SeatStatusRepository,
    public readonly seatsRepository: SeatsRepository,
    private readonly logger: LoggerService,
  ) {}

  async validateAndReserveSeats(
    showtime_id: string,
    seat_ids: string[],
    company_id: string,
  ): Promise<void> {
    // Validar sessão
    const showtime = await this.showtimesRepository.findById(showtime_id);
    if (!showtime) {
      throw new NotFoundException('Sessão não encontrada');
    }

    // Validar que a sessão pertence à empresa
    if (showtime.cinema_complexes?.company_id !== company_id) {
      throw new BadRequestException('A sessão não pertence à sua empresa');
    }

    // Validar que a sessão ainda não começou
    if (new Date(showtime.start_time) < new Date()) {
      throw new BadRequestException('A sessão já começou');
    }

    // Buscar status "vendido" ou "ocupado"
    const soldStatus = await this.seatStatusRepository.findByNameAndCompany(
      'Vendido',
      company_id,
    );
    const occupiedStatus = await this.seatStatusRepository.findByNameAndCompany(
      'Ocupado',
      company_id,
    );

    if (!soldStatus && !occupiedStatus) {
      throw new NotFoundException(
        'Status de assento "Vendido" ou "Ocupado" não configurado',
      );
    }

    const reservedStatusId = soldStatus?.id || occupiedStatus?.id;

    // Validar cada assento
    for (const seat_id of seat_ids) {
      const seat = await this.seatsRepository.findById(seat_id);
      if (!seat) {
        throw new NotFoundException(`Assento não encontrado`);
      }

      const sessionSeatStatus =
        await this.sessionSeatStatusRepository.findBySeatAndShowtime(
          showtime_id,
          seat_id,
        );

      if (!sessionSeatStatus) {
        throw new NotFoundException(
          `Assento ${seat_id} não está disponível nesta sessão`,
        );
      }

      // Verificar se o assento já está vendido/ocupado
      if (
        sessionSeatStatus.status === reservedStatusId ||
        sessionSeatStatus.sale_id
      ) {
        throw new ConflictException(
          `Assento ${seat.seat_code} já está ocupado`,
        );
      }
    }
  }

  @Transactional()
  async reserveSeats(
    showtime_id: string,
    seat_ids: string[],
    sale_id: string,
    company_id: string,
  ): Promise<void> {
    // Buscar status "vendido"
    const soldStatus = await this.seatStatusRepository.findByNameAndCompany(
      'Vendido',
      company_id,
    );

    if (!soldStatus) {
      throw new NotFoundException(
        'Status de assento "Vendido" não configurado',
      );
    }

    // Atualizar status dos assentos diretamente no banco
    for (const seat_id of seat_ids) {
      await this.sessionSeatStatusRepository[
        'prisma'
      ].session_seat_status.updateMany({
        where: {
          showtime_id,
          seat_id,
        },
        data: {
          status: soldStatus.id,
          sale_id,
          // IMPORTANTE: Limpar campos de reserva ao vender
          reservation_uuid: null,
          reservation_date: null,
          expiration_date: null,
        },
      });
    }

    // Atualizar contadores da sessão
    const showtime = await this.showtimesRepository.findById(showtime_id);
    if (showtime) {
      const currentSold = showtime.sold_seats || 0;
      const currentAvailable = showtime.available_seats || 0;

      await this.showtimesRepository.update(showtime_id, {
        sold_seats: currentSold + seat_ids.length,
        available_seats: Math.max(0, currentAvailable - seat_ids.length),
      });
    }
  }

  async calculateTicketPrice(
    showtime_id: string,
    seat_id: string | undefined,
    ticket_type_id: string | undefined,
    company_id: string,
  ): Promise<{
    face_value: number;
    service_fee: number;
    total_amount: number;
  }> {
    const showtime = await this.showtimesRepository.findById(showtime_id);
    if (!showtime) {
      throw new NotFoundException('Sessão não encontrada');
    }

    let basePrice = Number(showtime.base_ticket_price);

    // Adicionar valor adicional do tipo de assento (se houver)
    if (seat_id) {
      const seat = await this.seatsRepository['prisma'].seats.findUnique({
        where: { id: seat_id },
        include: { seat_types: true },
      });

      if (seat?.seat_types?.additional_value) {
        const additionalValue = Number(seat.seat_types.additional_value);
        basePrice += additionalValue;
      }
    }

    // Aplicar desconto do tipo de ingresso (se houver)
    let multiplier = 1;
    if (ticket_type_id) {
      const ticketType = await this.ticketsRepository[
        'prisma'
      ].ticket_types.findUnique({
        where: { id: ticket_type_id },
      });

      if (ticketType?.discount_percentage) {
        multiplier = 1 - Number(ticketType.discount_percentage) / 100;
      }
    }

    const face_value = basePrice * multiplier;
    const service_fee = 0; // TODO: Calcular taxa de serviço se houver
    const total_amount = face_value + service_fee;

    return {
      face_value,
      service_fee,
      total_amount,
    };
  }
}
