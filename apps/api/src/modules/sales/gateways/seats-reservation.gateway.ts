import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/common/services/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionSeatStatusRepository } from 'src/modules/operations/session_seat_status/repositories/session-seat-status.repository';
import { SeatStatusRepository } from 'src/modules/operations/seat-status/repositories/seat-status.repository';
import { OnModuleInit } from '@nestjs/common';

interface SeatReservation {
  showtime_id: string;
  seat_ids: string[];
  expires_at: Date;
  socket_id: string;
  reservation_uuid: string;
  user_id?: string;
  company_id: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/seats',
})
export class SeatsReservationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  // Reservas temporárias em memória (sincronizadas com o banco)
  private reservations = new Map<string, SeatReservation>();

  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
    private readonly sessionSeatStatusRepository: SessionSeatStatusRepository,
    private readonly seatStatusRepository: SeatStatusRepository,
  ) {
    // Limpar reservas expiradas a cada minuto
    setInterval(() => {
      this.cleanExpiredReservations();
    }, 60000);
  }

  async onModuleInit() {
    await this.loadActiveReservations();
  }

  private async loadActiveReservations() {
    try {
      this.logger.log(
        'Loading active reservations from database...',
        'SeatsReservationGateway',
      );
      const now = new Date();

      // Buscar todas as reservas ativas no banco
      const activeReservations = await this.prisma.session_seat_status.findMany(
        {
          where: {
            reservation_uuid: { not: null },
            expiration_date: { gt: now },
            sale_id: null,
          },
          include: {
            showtime_schedule: {
              include: {
                cinema_complexes: true,
              },
            },
          },
        },
      );

      // Agrupar por UUID
      const grouped = activeReservations.reduce(
        (acc, curr) => {
          if (!curr.reservation_uuid) return acc;
          if (!acc[curr.reservation_uuid]) {
            acc[curr.reservation_uuid] = {
              showtime_id: curr.showtime_id,
              seat_ids: [],
              expires_at: curr.expiration_date!,
              reservation_uuid: curr.reservation_uuid,
              socket_id: '', // Não temos o socket ID após restart, mas a reserva persiste
              // user_id: undefined // Não temos user_id no banco ainda
              company_id:
                curr.showtime_schedule?.cinema_complexes?.company_id || '',
            };
          }
          acc[curr.reservation_uuid].seat_ids.push(curr.seat_id);
          return acc;
        },
        {} as Record<string, SeatReservation>,
      );

      for (const res of Object.values(grouped)) {
        this.reservations.set(res.reservation_uuid, res);
      }

      this.logger.log(
        `Loaded ${this.reservations.size} active reservations.`,
        'SeatsReservationGateway',
      );
    } catch (error) {
      this.logger.error(
        `Failed to load active reservations: ${error}`,
        '',
        'SeatsReservationGateway',
      );
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(
      `WebSocket client connected: ${client.id}`,
      'SeatsReservationGateway',
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `WebSocket client disconnected: ${client.id}`,
      'SeatsReservationGateway',
    );
    // Não removemos imediatamente as reservas do banco, pois o cliente pode reconectar
    // A limpeza automática cuidará das expirações
  }

  @SubscribeMessage('join-showtime')
  handleJoinShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { showtime_id: string; user_id?: string },
  ) {
    const { showtime_id, user_id } = payload;
    client.join(`showtime:${showtime_id}`);
    this.logger.debug(
      `Client ${client.id} joined showtime ${showtime_id} (User: ${user_id || 'Guest'})`,
      'SeatsReservationGateway',
    );
    client.emit('joined-showtime', { showtime_id });

    // Tentar restaurar reserva se tiver user_id
    if (user_id) {
      this.restoreUserReservation(client, user_id, showtime_id);
    }
  }

  private restoreUserReservation(
    client: Socket,
    userId: string,
    showtimeId: string,
  ) {
    // Procurar reserva ativa para este usuário nesta sessão
    for (const reservation of this.reservations.values()) {
      if (
        reservation.user_id === userId &&
        reservation.showtime_id === showtimeId
      ) {
        // Atualizar socket_id
        reservation.socket_id = client.id;

        this.logger.log(
          `Restoring reservation ${reservation.reservation_uuid} for user ${userId}`,
          'SeatsReservationGateway',
        );

        // Enviar dados da reserva para o cliente
        client.emit('reservation-restored', {
          reservation_uuid: reservation.reservation_uuid,
          expires_at: reservation.expires_at.toISOString(),
          seat_ids: reservation.seat_ids,
        });
        return; // Assumindo apenas uma reserva ativa por vez por usuário/sessão
      }
    }
  }

  @SubscribeMessage('reserve-seats')
  async handleReserveSeats(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      showtime_id: string;
      seat_ids: string[];
      company_id: string;
      user_id?: string;
    },
  ) {
    const { showtime_id, seat_ids, company_id, user_id } = payload;

    try {
      // Buscar status "Reservado"
      const reservedStatus =
        await this.seatStatusRepository.findByNameAndCompany(
          'Reservado',
          company_id,
        );

      if (!reservedStatus) {
        client.emit('reservation-error', {
          message: 'Status de reserva não configurado',
        });
        return;
      }

      const reservationUuid = `${showtime_id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

      // Transação Atômica para garantir consistência
      await this.prisma.$transaction(async (tx) => {
        // Verificar disponibilidade e reservar atomicamente
        // Usamos updateMany com filtro para garantir que só atualiza se estiver disponível
        // Disponível = sale_id NULL E (reservation_uuid NULL OU expiration_date < NOW)

        const now = new Date();

        // Para cada assento, tentamos atualizar. Se algum falhar, a transação falha (mas updateMany retorna count)
        // Melhor abordagem: Verificar disponibilidade com lock ou update condicional

        // Vamos verificar primeiro se todos estão disponíveis
        const unavailable = await tx.session_seat_status.findFirst({
          where: {
            showtime_id,
            seat_id: { in: seat_ids },
            OR: [
              { sale_id: { not: null } },
              {
                AND: [
                  { reservation_uuid: { not: null } },
                  { expiration_date: { gt: now } },
                ],
              },
            ],
          },
        });

        if (unavailable) {
          throw new Error(`Assento ${unavailable.seat_id} não está disponível`);
        }

        // Se chegou aqui, teoricamente estão livres, mas precisamos garantir atomicidade no update
        // O updateMany não garante que TODOS foram atualizados se a condição for parcial,
        // mas como fizemos a verificação antes dentro da mesma transação (com nível de isolamento padrão),
        // deve ser seguro o suficiente para este caso de uso.
        // Para ser 100% bulletproof, deveríamos fazer um update com where clause estrita.

        const updateResult = await tx.session_seat_status.updateMany({
          where: {
            showtime_id,
            seat_id: { in: seat_ids },
            sale_id: null,
            OR: [
              { reservation_uuid: null },
              { expiration_date: null },
              { expiration_date: { lte: now } },
            ],
          },
          data: {
            status: reservedStatus.id,
            reservation_uuid: reservationUuid,
            reservation_date: new Date(),
            expiration_date: expiresAt,
          },
        });

        if (updateResult.count !== seat_ids.length) {
          throw new Error(
            'Não foi possível reservar todos os assentos (concorrência detectada)',
          );
        }
      });

      // Sucesso na transação

      // Armazenar reserva em memória
      this.reservations.set(reservationUuid, {
        showtime_id,
        seat_ids,
        expires_at: expiresAt,
        socket_id: client.id,
        reservation_uuid: reservationUuid,
        user_id,
        company_id,
      });

      // Notificar outros clientes na mesma sessão
      this.server.to(`showtime:${showtime_id}`).emit('seats-reserved', {
        seat_ids,
        reservation_uuid: reservationUuid,
        expires_at: expiresAt.toISOString(),
      });

      client.emit('reservation-success', {
        reservation_uuid: reservationUuid,
        expires_at: expiresAt.toISOString(),
        seat_ids,
      });

      this.logger.log(
        `Seats reserved: ${seat_ids.join(', ')} for showtime ${showtime_id}`,
        'SeatsReservationGateway',
      );
    } catch (error) {
      this.logger.error(
        `Error reserving seats: ${error}`,
        'SeatsReservationGateway',
      );
      client.emit('reservation-error', {
        message: (error as Error).message || 'Erro ao reservar assentos',
      });
    }
  }

  @SubscribeMessage('release-seats')
  async handleReleaseSeats(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { reservation_uuid: string; company_id: string },
  ) {
    const { reservation_uuid, company_id } = payload;
    await this.expireReservation(reservation_uuid, company_id);
    client.emit('seats-released', { reservation_uuid });
  }

  @SubscribeMessage('confirm-reservation')
  async handleConfirmReservation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { reservation_uuid: string; sale_id: string },
  ) {
    const { reservation_uuid, sale_id } = payload;
    const reservation = this.reservations.get(reservation_uuid);

    if (!reservation) {
      client.emit('confirmation-error', {
        message: 'Reserva não encontrada',
      });
      return;
    }

    try {
      // Atualizar reservas no banco com sale_id atomicamente
      await this.prisma.session_seat_status.updateMany({
        where: {
          showtime_id: reservation.showtime_id,
          seat_id: { in: reservation.seat_ids },
          reservation_uuid: reservation_uuid,
        },
        data: {
          sale_id,
          // Manter reservation_uuid para histórico ou limpar? Geralmente limpa ou mantém como ref.
          // Vamos manter por enquanto mas limpar expiração para não ser coletado
          expiration_date: null,
        },
      });

      // Remover da memória
      this.reservations.delete(reservation_uuid);

      // Notificar outros clientes
      this.server
        .to(`showtime:${reservation.showtime_id}`)
        .emit('seats-confirmed', {
          seat_ids: reservation.seat_ids,
          sale_id,
        });

      client.emit('reservation-confirmed', {
        reservation_uuid,
        sale_id,
      });
    } catch (error) {
      this.logger.error(
        `Error confirming reservation: ${error}`,
        '',
        'SeatsReservationGateway',
      );
      client.emit('confirmation-error', {
        message: 'Erro ao confirmar reserva',
      });
    }
  }

  private async expireReservation(
    reservationUuid: string,
    company_id?: string,
  ) {
    const reservation = this.reservations.get(reservationUuid);

    // Se company_id não foi passado, tentar pegar da reserva em memória
    let targetCompanyId = company_id;
    if (!targetCompanyId && reservation) {
      targetCompanyId = reservation.company_id;
    }

    // Mesmo se não estiver em memória (restart), tentamos limpar do banco pelo UUID
    try {
      // Se ainda não temos company_id, precisamos descobrir
      if (!targetCompanyId) {
        const seatsToFree = await this.prisma.session_seat_status.findMany({
          where: { reservation_uuid: reservationUuid },
          select: {
            showtime_schedule: {
              select: {
                cinema_complexes: {
                  select: { company_id: true },
                },
              },
            },
          },
          take: 1,
        });

        if (
          seatsToFree.length > 0 &&
          seatsToFree[0].showtime_schedule?.cinema_complexes?.company_id
        ) {
          targetCompanyId =
            seatsToFree[0].showtime_schedule.cinema_complexes.company_id;
        }
      }

      // Se ainda não temos company_id, não podemos continuar
      if (!targetCompanyId) {
        this.logger.warn(
          `Could not determine company_id for reservation ${reservationUuid}, skipping expiration.`,
          'SeatsReservationGateway',
        );
        return;
      }

      // Buscar status "Disponível"
      const availableStatus =
        await this.seatStatusRepository.findByNameAndCompany(
          'Disponível',
          targetCompanyId,
        );

      if (!availableStatus) {
        this.logger.warn(
          `Available status not found for company ${targetCompanyId}`,
          'SeatsReservationGateway',
        );
        return;
      }

      // Liberar assentos no banco
      // Se tivermos a reserva em memória, usamos os IDs, senão usamos o UUID
      // IMPORTANTE: Só liberar se NÃO foi vendido (sale_id null)

      if (reservation) {
        await this.prisma.session_seat_status.updateMany({
          where: {
            showtime_id: reservation.showtime_id,
            seat_id: { in: reservation.seat_ids },
            reservation_uuid: reservationUuid,
            sale_id: null, // IMPORTANTE: Só liberar se não foi vendido
          },
          data: {
            status: availableStatus.id,
            reservation_uuid: null,
            reservation_date: null,
            expiration_date: null,
          },
        });

        // Notificar outros clientes
        this.server
          .to(`showtime:${reservation.showtime_id}`)
          .emit('seats-released', {
            seat_ids: reservation.seat_ids,
            reservation_uuid: reservationUuid,
          });

        this.reservations.delete(reservationUuid);
      } else {
        // Fallback: limpar pelo UUID diretamente (pode ser necessário buscar showtime_id antes para notificar)
        const seatsToFree = await this.prisma.session_seat_status.findMany({
          where: { reservation_uuid: reservationUuid },
          select: { showtime_id: true, seat_id: true },
        });

        if (seatsToFree.length > 0) {
          const showtimeId = seatsToFree[0].showtime_id;
          const seatIds = seatsToFree.map((s) => s.seat_id);

          await this.prisma.session_seat_status.updateMany({
            where: {
              reservation_uuid: reservationUuid,
              sale_id: null, // IMPORTANTE: Só liberar se não foi vendido
            },
            data: {
              status: availableStatus.id,
              reservation_uuid: null,
              reservation_date: null,
              expiration_date: null,
            },
          });

          this.server.to(`showtime:${showtimeId}`).emit('seats-released', {
            seat_ids: seatIds,
            reservation_uuid: reservationUuid,
          });
        }
      }

      this.logger.log(
        `Reservation expired/released: ${reservationUuid}`,
        'SeatsReservationGateway',
      );
    } catch (error) {
      this.logger.error(
        `Error expiring reservation: ${error}`,
        '',
        'SeatsReservationGateway',
      );
    }
  }

  private async cleanExpiredReservations() {
    const now = new Date();
    const expiredUuids: string[] = [];

    // 1. Identificar expirados em memória
    for (const [uuid, reservation] of this.reservations.entries()) {
      if (reservation.expires_at < now) {
        expiredUuids.push(uuid);
      }
    }

    if (expiredUuids.length === 0) return;

    this.logger.log(
      `Cleaning ${expiredUuids.length} expired reservations...`,
      'SeatsReservationGateway',
    );

    try {
      // 2. Buscar company_ids para notificar corretamente (opcional, mas bom para manter consistência)
      // Para otimizar, vamos assumir que a limpeza do banco é o principal e a notificação
      // pode ser feita buscando os dados dos assentos que foram liberados.

      // 3. Limpar no banco em lote
      // Primeiro buscamos para saber quem notificar
      const seatsToFree = await this.prisma.session_seat_status.findMany({
        where: {
          reservation_uuid: { in: expiredUuids },
        },
        select: {
          showtime_id: true,
          seat_id: true,
          reservation_uuid: true,
          showtime_schedule: {
            select: {
              cinema_complexes: {
                select: {
                  company_id: true,
                },
              },
            },
          },
        },
      });

      if (seatsToFree.length > 0) {
        // Agrupar por company para buscar status "Disponível"
        // Assumindo que status "Disponível" tem o mesmo nome em todas as companies,
        // mas IDs diferentes. Precisamos buscar o ID do status para cada company.
        // Isso pode ser complexo em lote.
        // Simplificação: Vamos iterar por company encontrada.

        const companies = new Set(
          seatsToFree
            .map((s) => s.showtime_schedule?.cinema_complexes?.company_id)
            .filter((id): id is string => !!id),
        );

        for (const companyId of companies) {
          const availableStatus =
            await this.seatStatusRepository.findByNameAndCompany(
              'Disponível',
              companyId,
            );

          if (availableStatus) {
            const seatsForCompany = seatsToFree.filter(
              (s) =>
                s.showtime_schedule?.cinema_complexes?.company_id === companyId,
            );
            const uuidsForCompany = seatsForCompany
              .map((s) => s.reservation_uuid)
              .filter((uuid): uuid is string => !!uuid);

            if (uuidsForCompany.length > 0) {
              await this.prisma.session_seat_status.updateMany({
                where: {
                  reservation_uuid: { in: uuidsForCompany },
                },
                data: {
                  status: availableStatus.id,
                  reservation_uuid: null,
                  reservation_date: null,
                  expiration_date: null,
                },
              });
            }
          }
        }

        // 4. Notificar clientes
        // Agrupar por showtime
        const byShowtime = seatsToFree.reduce(
          (acc, curr) => {
            if (!acc[curr.showtime_id]) {
              acc[curr.showtime_id] = [];
            }
            acc[curr.showtime_id].push(curr);
            return acc;
          },
          {} as Record<string, typeof seatsToFree>,
        );

        for (const [showtimeId, seats] of Object.entries(byShowtime)) {
          const seatIds = seats.map((s) => s.seat_id);
          // Podemos emitir múltiplos eventos ou um agrupado.
          // O front espera { seat_ids, reservation_uuid }.
          // Se mandarmos array de seat_ids e um uuid null ou genérico, o front entende?
          // O protocolo atual parece ligar seat_ids a um reservation_uuid.
          // Vamos emitir um evento para cada grupo de UUID original para manter compatibilidade estrita,
          // ou melhor, emitir um evento genérico de liberação se o front suportar.
          // Olhando o código original: emit('seats-released', { seat_ids, reservation_uuid })
          // Vamos agrupar por UUID para notificar corretamente.

          const byUuid = seats.reduce(
            (acc, curr) => {
              const uuid = curr.reservation_uuid || 'unknown';
              if (!acc[uuid]) acc[uuid] = [];
              acc[uuid].push(curr.seat_id);
              return acc;
            },
            {} as Record<string, string[]>,
          );

          for (const [uuid, sIds] of Object.entries(byUuid)) {
            this.server.to(`showtime:${showtimeId}`).emit('seats-released', {
              seat_ids: sIds,
              reservation_uuid: uuid,
            });
          }
        }
      }

      // 5. Remover da memória
      for (const uuid of expiredUuids) {
        this.reservations.delete(uuid);
      }

      this.logger.log(
        `Cleaned ${expiredUuids.length} expired reservations.`,
        'SeatsReservationGateway',
      );
    } catch (error) {
      this.logger.error(
        `Error cleaning expired reservations: ${error}`,
        '',
        'SeatsReservationGateway',
      );
    }
  }
}
