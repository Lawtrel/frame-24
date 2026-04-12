import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Prisma } from '@repo/db';
import { ClsService } from 'nestjs-cls';
import { SalesService } from 'src/modules/sales/services/sales.service';
import {
  SaleWithFullRelations,
  SalesRepository,
} from 'src/modules/sales/repositories/sales.repository';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { SaleResponseDto } from 'src/modules/sales/dto/sale-response.dto';
import { CreateSaleDto } from 'src/modules/sales/dto/create-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/services/logger.service';

type CustomerSaleWithRelations = Prisma.salesGetPayload<{
  include: {
    tickets: {
      include: {
        ticket_types: true;
      };
    };
    concession_sales: {
      include: {
        concession_sale_items: true;
      };
    };
    sale_types: true;
    payment_methods: true;
    sale_status: true;
  };
}>;

type ShowtimeWithRelations = Prisma.showtime_scheduleGetPayload<{
  include: {
    cinema_complexes: true;
    rooms: true;
    projection_types: true;
    audio_types: true;
    session_languages: true;
  };
}>;

type SeatWithType = Prisma.seatsGetPayload<{
  include: {
    seat_types: true;
  };
}>;

type MovieWithPoster = Prisma.moviesGetPayload<{
  include: {
    age_rating: true;
    movie_media: {
      include: {
        media_types: true;
      };
    };
  };
}>;

type TicketWithSaleSummary = Prisma.ticketsGetPayload<{
  include: {
    sales: {
      select: {
        id: true;
        sale_number: true;
        sale_date: true;
        cinema_complex_id: true;
        customer_id: true;
      };
    };
  };
}>;

type CustomerTicketResponse = {
  id: string;
  ticket_number: string;
  seat: string | null;
  face_value: string;
  service_fee: string;
  total_amount: string;
  used: boolean;
  usage_date?: string;
  sale: {
    id: string;
    sale_number: string;
    sale_date: string;
    cinema_complex_id: string;
  };
  created_at?: string;
};

@Injectable()
export class CustomerPurchasesService {
  constructor(
    private readonly salesService: SalesService,
    private readonly salesRepository: SalesRepository,
    private readonly companyCustomersRepository: CompanyCustomersRepository,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly cls: ClsService,
  ) {}

  private getCustomerContext(): { companyId: string; customerId: string } {
    const companyId = this.cls.get<string>('companyId');
    const customerId = this.cls.get<string>('customerId');

    if (!companyId || !customerId) {
      throw new ForbiddenException('Contexto do cliente não encontrado.');
    }

    return { companyId, customerId };
  }

  @Transactional()
  async purchase(dto: CreatePurchaseDto): Promise<SaleResponseDto> {
    const context = this.getCustomerContext();
    let pointsDiscount = 0;
    if (dto.use_points && dto.use_points > 0) {
      const companyCustomer =
        await this.companyCustomersRepository.findByCompanyAndCustomer(
          context.companyId,
          context.customerId,
        );

      if (!companyCustomer) {
        throw new NotFoundException('Cliente não encontrado');
      }

      const availablePoints = companyCustomer.accumulated_points || 0;
      if (dto.use_points > availablePoints) {
        throw new BadRequestException(
          `Pontos insuficientes. Disponível: ${availablePoints}, Solicitado: ${dto.use_points}`,
        );
      }

      const deducted =
        await this.companyCustomersRepository.decrementAccumulatedPointsIfAtLeast(
          context.companyId,
          context.customerId,
          dto.use_points,
        );
      if (!deducted) {
        throw new BadRequestException(
          'Não foi possível reservar os pontos (concorrência ou saldo alterado). Tente novamente.',
        );
      }

      pointsDiscount = dto.use_points * 0.01;
    }

    const createSaleDto: CreateSaleDto = {
      cinema_complex_id: dto.cinema_complex_id,
      payment_method: dto.payment_method,
      tickets: dto.tickets,
      concession_items: dto.concession_items,
      discount_amount: (dto.discount_amount || 0) + pointsDiscount,
      promotion_code: dto.promotion_code,
    };

    const sale = await this.salesService.create(createSaleDto);

    await this.accumulateLoyaltyPoints(sale, context);

    // Confirmar reserva no WebSocket se houver
    if (dto.reservation_uuid) {
      // Isso será feito pelo frontend chamando o WebSocket
      // ou podemos criar um método aqui
    }

    return sale;
  }

  async findAll(): Promise<SaleResponseDto[]> {
    const context = this.getCustomerContext();
    const sales: CustomerSaleWithRelations[] = await this.prisma.sales.findMany(
      {
        where: {
          customer_id: context.customerId,
        },
        include: {
          tickets: {
            include: {
              ticket_types: true,
            },
          },
          concession_sales: {
            include: {
              concession_sale_items: true,
            },
          },
          sale_types: true,
          payment_methods: true,
          sale_status: true,
        },
        orderBy: {
          sale_date: 'desc',
        },
      },
    );

    const showtimeIds = [
      ...new Set(
        sales.flatMap((sale) =>
          sale.tickets
            .map((ticket) => ticket.showtime_id)
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    ];
    const seatIds = [
      ...new Set(
        sales.flatMap((sale) =>
          sale.tickets
            .map((ticket) => ticket.seat_id)
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    ];

    const [showtimes, seats] = await Promise.all([
      this.prisma.showtime_schedule.findMany({
        where: { id: { in: showtimeIds } },
        include: {
          cinema_complexes: true,
          rooms: true,
          projection_types: true,
          audio_types: true,
          session_languages: true,
        },
      }),
      this.prisma.seats.findMany({
        where: { id: { in: seatIds } },
        include: {
          seat_types: true,
        },
      }),
    ]);

    const showtimeMap = new Map<string, ShowtimeWithRelations>(
      showtimes.map((showtime) => [showtime.id, showtime]),
    );
    const seatMap = new Map<string, SeatWithType>(
      seats.map((seat) => [seat.id, seat]),
    );

    const movieIds = [
      ...new Set(
        showtimes
          .map((showtime) => showtime.movie_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const movies: MovieWithPoster[] = await this.prisma.movies.findMany({
      where: { id: { in: movieIds } },
      include: {
        age_rating: true,
        movie_media: {
          where: {
            active: true,
            media_types: {
              name: 'Poster',
            },
          },
          include: {
            media_types: true,
          },
          take: 1,
        },
      },
    });
    const movieMap = new Map<
      string,
      {
        id: string;
        title: string;
        poster_url: string | null;
        duration_minutes: number;
        age_rating: string | null;
      }
    >(
      movies.map((movie) => [
        movie.id,
        {
          id: movie.id,
          title: movie.brazil_title || movie.original_title || '',
          poster_url: movie.movie_media[0]?.media_url || null,
          duration_minutes: movie.duration_minutes ?? 0,
          age_rating: movie.age_rating?.code || null,
        },
      ]),
    );

    return sales.map((sale): SaleResponseDto => {
      const firstTicket = sale.tickets[0];
      const showtimeDetails = firstTicket?.showtime_id
        ? showtimeMap.get(firstTicket.showtime_id)
        : undefined;
      const movieDetails = showtimeDetails?.movie_id
        ? movieMap.get(showtimeDetails.movie_id)
        : undefined;

      const ticketsWithSeats = sale.tickets.map((ticket) => {
        const seat = ticket.seat_id ? seatMap.get(ticket.seat_id) : undefined;
        return {
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          seat: seat
            ? {
                id: seat.id,
                seat_code: seat.seat_code,
                row_code: seat.row_code,
                column_number: seat.column_number,
                seat_type: seat.seat_types?.name || 'Padrão',
              }
            : undefined,
          face_value: ticket.face_value.toString(),
          service_fee: (ticket.service_fee || 0).toString(),
          total_amount: ticket.total_amount.toString(),
          used: ticket.used || false,
          usage_date: ticket.usage_date?.toISOString(),
          ticket_type: ticket.ticket_types?.name,
        };
      });

      return {
        id: sale.id,
        sale_number: sale.sale_number,
        cinema_complex_id: sale.cinema_complex_id,
        customer_id: sale.customer_id ?? undefined,
        sale_date: sale.sale_date.toISOString(),
        total_amount: sale.total_amount.toString(),
        discount_amount: (sale.discount_amount || 0).toString(),
        net_amount: sale.net_amount.toString(),
        sale_type: sale.sale_types?.name,
        payment_method: sale.payment_methods?.name,
        status: sale.sale_status?.name,
        tickets: ticketsWithSeats,
        showtime: showtimeDetails
          ? {
              id: showtimeDetails.id,
              start_time: showtimeDetails.start_time.toISOString(),
              cinema: showtimeDetails.cinema_complexes?.name || '',
              room: showtimeDetails.rooms?.name,
            }
          : undefined,
        movie: movieDetails,
        created_at: sale.created_at?.toISOString() || new Date().toISOString(),
      };
    });
  }

  async findOne(id: string): Promise<SaleResponseDto> {
    const context = this.getCustomerContext();
    const sale = await this.salesRepository.findById(id, context.companyId);

    if (!sale) {
      throw new NotFoundException('Compra não encontrada');
    }

    // Validar que a venda pertence ao cliente
    if (sale.customer_id !== context.customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver esta compra',
      );
    }

    return this.mapToDto(sale);
  }

  async findTickets(): Promise<CustomerTicketResponse[]> {
    const context = this.getCustomerContext();
    // Buscar todas as vendas do cliente
    const sales = await this.salesRepository.findAll(context.companyId, {
      customer_id: context.customerId,
    });

    const saleIds = sales.map((s) => s.id);

    // Buscar todos os tickets dessas vendas
    const tickets = await this.prisma.tickets.findMany({
      where: {
        sale_id: { in: saleIds },
      },
      include: {
        sales: {
          select: {
            id: true,
            sale_number: true,
            sale_date: true,
            cinema_complex_id: true,
            customer_id: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return tickets
      .filter((ticket): ticket is TicketWithSaleSummary =>
        Boolean(ticket.sales),
      )
      .map((ticket) => this.mapTicketToResponse(ticket));
  }

  async findTicketById(id: string): Promise<CustomerTicketResponse> {
    const context = this.getCustomerContext();
    const ticket: TicketWithSaleSummary | null =
      await this.prisma.tickets.findFirst({
        where: { id },
        include: {
          sales: {
            select: {
              id: true,
              sale_number: true,
              sale_date: true,
              cinema_complex_id: true,
              customer_id: true,
            },
          },
        },
      });

    if (!ticket || !ticket.sales) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    if (ticket.sales.customer_id !== context.customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este ingresso',
      );
    }

    return this.mapTicketToResponse(ticket);
  }

  async getTicketQrCode(
    id: string,
  ): Promise<{ payload: string; base64: string }> {
    const context = this.getCustomerContext();
    const ticket: TicketWithSaleSummary | null =
      await this.prisma.tickets.findFirst({
        where: { id },
        include: {
          sales: {
            select: {
              id: true,
              sale_number: true,
              sale_date: true,
              cinema_complex_id: true,
              customer_id: true,
            },
          },
        },
      });

    if (!ticket || !ticket.sales) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    if (ticket.sales.customer_id !== context.customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este ingresso',
      );
    }

    const payload = JSON.stringify({
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      sale_id: ticket.sales.id,
      sale_number: ticket.sales.sale_number,
      cinema_complex_id: ticket.sales.cinema_complex_id,
      showtime_id: ticket.showtime_id,
    });

    const base64 = Buffer.from(payload).toString('base64');

    return { payload, base64 };
  }

  async cancelPurchase(
    id: string,
    reason = 'Cancelado pelo cliente',
  ): Promise<void> {
    const context = this.getCustomerContext();
    const sale = await this.salesRepository.findById(id, context.companyId);

    if (!sale) {
      throw new NotFoundException('Compra não encontrada');
    }

    if (sale.customer_id !== context.customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta compra',
      );
    }

    await this.salesService.cancel(id, reason);
  }

  async getHistory(): Promise<{
    purchases: SaleResponseDto[];
    tickets: CustomerTicketResponse[];
  }> {
    const purchases = await this.findAll();
    const tickets = await this.findTickets();

    return { purchases, tickets };
  }

  private async accumulateLoyaltyPoints(
    sale: SaleResponseDto,
    context: { companyId: string; customerId: string },
  ): Promise<void> {
    const netAmount = parseFloat(sale.net_amount);

    // Calcular pontos (exemplo: R$ 1,00 = 1 ponto)
    const pointsToAdd = Math.floor(netAmount);

    if (pointsToAdd <= 0) {
      return;
    }

    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        context.companyId,
        context.customerId,
      );

    if (!companyCustomer) {
      return;
    }

    const currentPoints = companyCustomer.accumulated_points || 0;
    const newPoints = currentPoints + pointsToAdd;

    // Atualizar pontos
    await this.companyCustomersRepository.update(
      context.companyId,
      context.customerId,
      {
        accumulated_points: newPoints,
      },
    );

    // Verificar e atualizar nível de fidelidade
    await this.updateLoyaltyLevel(context, newPoints);

    this.logger.log(
      `Pontos acumulados: ${pointsToAdd} para cliente ${context.customerId}. Total: ${newPoints}`,
      CustomerPurchasesService.name,
    );
  }

  private async updateLoyaltyLevel(
    context: { companyId: string; customerId: string },
    totalPoints: number,
  ): Promise<void> {
    // Definir níveis de fidelidade
    let newLevel = 'BRONZE';
    if (totalPoints >= 5000) {
      newLevel = 'GOLD';
    } else if (totalPoints >= 2000) {
      newLevel = 'SILVER';
    }

    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        context.companyId,
        context.customerId,
      );

    if (companyCustomer && companyCustomer.loyalty_level !== newLevel) {
      await this.companyCustomersRepository.update(
        context.companyId,
        context.customerId,
        {
          loyalty_level: newLevel,
        },
      );

      this.logger.log(
        `Nível de fidelidade atualizado: ${companyCustomer.loyalty_level} → ${newLevel} para cliente ${context.customerId}`,
        CustomerPurchasesService.name,
      );
    }
  }

  private mapToDto(sale: SaleWithFullRelations): SaleResponseDto {
    return {
      id: sale.id,
      sale_number: sale.sale_number,
      cinema_complex_id: sale.cinema_complex_id,
      customer_id: sale.customer_id ?? undefined,
      sale_date: sale.sale_date.toISOString(),
      total_amount: sale.total_amount.toString(),
      discount_amount: (sale.discount_amount || 0).toString(),
      net_amount: sale.net_amount.toString(),
      sale_type: sale.sale_types?.name,
      payment_method: sale.payment_methods?.name,
      status: sale.sale_status?.name,
      tickets: (sale.tickets || []).map((ticket) => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        seat: ticket.seat ?? undefined,
        face_value: ticket.face_value.toString(),
        service_fee: (ticket.service_fee || 0).toString(),
        total_amount: ticket.total_amount.toString(),
        used: ticket.used || false,
        usage_date: ticket.usage_date?.toISOString(),
      })),
      created_at: sale.created_at?.toISOString() || new Date().toISOString(),
    };
  }

  private mapTicketToResponse(
    ticket: TicketWithSaleSummary,
  ): CustomerTicketResponse {
    return {
      id: ticket.id,
      ticket_number: ticket.ticket_number,
      seat: ticket.seat,
      face_value: ticket.face_value.toString(),
      service_fee: (ticket.service_fee || 0).toString(),
      total_amount: ticket.total_amount.toString(),
      used: ticket.used || false,
      usage_date: ticket.usage_date?.toISOString(),
      sale: {
        id: ticket.sales.id,
        sale_number: ticket.sales.sale_number,
        sale_date: ticket.sales.sale_date.toISOString(),
        cinema_complex_id: ticket.sales.cinema_complex_id,
      },
      created_at: ticket.created_at?.toISOString(),
    };
  }
}
