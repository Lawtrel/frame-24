import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SalesService } from 'src/modules/sales/services/sales.service';
import { SalesRepository } from 'src/modules/sales/repositories/sales.repository';
import { TicketsRepository } from 'src/modules/sales/repositories/tickets.repository';
import { CompanyCustomersRepository } from '../repositories/company-customers.repository';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { CustomerUser } from 'src/modules/identity/auth/strategies/jwt.strategy';
import { SaleResponseDto } from 'src/modules/sales/dto/sale-response.dto';
import { CreateSaleDto } from 'src/modules/sales/dto/create-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class CustomerPurchasesService {
  constructor(
    private readonly salesService: SalesService,
    private readonly salesRepository: SalesRepository,
    private readonly ticketsRepository: TicketsRepository,
    private readonly companyCustomersRepository: CompanyCustomersRepository,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) { }

  async purchase(
    dto: CreatePurchaseDto,
    customer: CustomerUser,
  ): Promise<SaleResponseDto> {
    // Validar pontos se for usar
    let pointsDiscount = 0;
    if (dto.use_points && dto.use_points > 0) {
      const companyCustomer =
        await this.companyCustomersRepository.findByCompanyAndCustomer(
          customer.company_id,
          customer.customer_id,
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

      // Converter pontos em desconto (exemplo: 1 ponto = R$ 0,01)
      pointsDiscount = dto.use_points * 0.01;
    }

    // Criar DTO de venda
    const createSaleDto: CreateSaleDto = {
      cinema_complex_id: dto.cinema_complex_id,
      customer_id: customer.customer_id,
      payment_method: dto.payment_method,
      tickets: dto.tickets,
      concession_items: dto.concession_items,
      discount_amount: (dto.discount_amount || 0) + pointsDiscount,
      promotion_code: dto.promotion_code,
    };

    // Criar venda usando SalesService (agora aceita CustomerUser)
    const sale = await this.salesService.create(createSaleDto, customer);

    // Acumular pontos de fidelidade
    await this.accumulateLoyaltyPoints(sale, customer);

    // Se usou pontos, deduzir
    if (dto.use_points && dto.use_points > 0) {
      await this.deductPoints(customer, dto.use_points);
    }

    // Confirmar reserva no WebSocket se houver
    if (dto.reservation_uuid) {
      // Isso será feito pelo frontend chamando o WebSocket
      // ou podemos criar um método aqui
    }

    return sale;
  }

  async findAll(customer: CustomerUser): Promise<SaleResponseDto[]> {
    // Buscar todas as vendas do cliente
    const sales = await this.prisma.sales.findMany({
      where: {
        customer_id: customer.customer_id,
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
    });

    // Collect all unique IDs for batch fetching
    const showtimeIds = [
      ...new Set(
        sales.flatMap((sale) =>
          sale.tickets.map((ticket: any) => ticket.showtime_id),
        ),
      ),
    ];
    const seatIds = [
      ...new Set(
        sales.flatMap((sale) =>
          sale.tickets.map((ticket: any) => ticket.seat_id).filter(Boolean),
        ),
      ),
    ];
    const productIds = [
      ...new Set(
        sales.flatMap((sale) =>
          sale.concession_sales.flatMap((concession: any) =>
            concession.concession_sale_items
              .filter((item: any) => item.item_type === 'PRODUCT')
              .map((item: any) => item.item_id),
          ),
        ),
      ),
    ];

    // Batch fetch all related data
    const [showtimes, seats, products] = await Promise.all([
      this.prisma.showtime_schedule.findMany({
        where: { id: { in: showtimeIds as string[] } },
        include: {
          cinema_complexes: true,
          rooms: true,
          projection_types: true,
          audio_types: true,
          session_languages: true,
        },
      }),
      this.prisma.seats.findMany({
        where: { id: { in: seatIds as string[] } },
        include: {
          seat_types: true,
        },
      }),
      this.prisma.products.findMany({
        where: { id: { in: productIds as string[] } },
      }),
    ]);

    // Create lookup maps
    const showtimeMap = new Map(showtimes.map((s) => [s.id, s]));
    const seatMap = new Map(seats.map((s) => [s.id, s]));
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Get unique movie IDs from showtimes
    const movieIds = [
      ...new Set(showtimes.map((s: any) => s.movie_id).filter(Boolean)),
    ];
    const movies = await this.prisma.movies.findMany({
      where: { id: { in: movieIds as string[] } },
      include: {
        age_rating: true,
        movie_media: {
          where: {
            active: true,
            media_types: {
              name: 'Poster'
            }
          },
          include: {
            media_types: true,
          },
          take: 1,
        },
      },
    });
    const movieMap = new Map(
      movies.map((m: any) => [
        m.id,
        {
          id: m.id,
          title: m.brazil_title || m.original_title,
          poster_url: m.movie_media?.[0]?.media_url || null,
          duration_minutes: m.duration_minutes,
          age_rating: m.age_rating?.code || null,
        },
      ]),
    );

    // Enrich sales with fetched data and map to DTO
    return sales.map((sale: any) => {
      const firstTicket = sale.tickets[0];
      const showtimeDetails = firstTicket
        ? showtimeMap.get(firstTicket.showtime_id)
        : null;
      const movieDetails = showtimeDetails
        ? movieMap.get((showtimeDetails as any).movie_id)
        : null;

      const ticketsWithSeats = sale.tickets.map((ticket: any) => {
        const seat = ticket.seat_id ? seatMap.get(ticket.seat_id) : null;
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
            cinema: showtimeDetails.cinema_complexes?.name,
            room: showtimeDetails.rooms?.name,
          }
          : undefined,
        movie: movieDetails || undefined,
        created_at: sale.created_at?.toISOString() || new Date().toISOString(),
      } as SaleResponseDto;
    });
  }

  async findOne(id: string, customer: CustomerUser): Promise<SaleResponseDto> {
    const sale = await this.salesRepository.findById(id, customer.company_id);

    if (!sale) {
      throw new NotFoundException('Compra não encontrada');
    }

    // Validar que a venda pertence ao cliente
    if (sale.customer_id !== customer.customer_id) {
      throw new ForbiddenException(
        'Você não tem permissão para ver esta compra',
      );
    }

    return this.mapToDto(sale);
  }

  async findTickets(customer: CustomerUser): Promise<any[]> {
    // Buscar todas as vendas do cliente
    const sales = await this.salesRepository.findAll(customer.company_id, {
      customer_id: customer.customer_id,
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
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return tickets.map((ticket) => ({
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
    }));
  }

  async findTicketById(id: string, customer: CustomerUser): Promise<any> {
    const ticket = await this.prisma.tickets.findFirst({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!ticket || !ticket.sales) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    if (ticket.sales.customer_id !== customer.customer_id) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este ingresso',
      );
    }

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

  async getTicketQrCode(
    id: string,
    customer: CustomerUser,
  ): Promise<{ payload: string; base64: string }> {
    const ticket = await this.prisma.tickets.findFirst({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!ticket || !ticket.sales) {
      throw new NotFoundException('Ingresso não encontrado');
    }

    if (ticket.sales.customer_id !== customer.customer_id) {
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
    customer: CustomerUser,
    reason = 'Cancelado pelo cliente',
  ): Promise<void> {
    const sale = await this.salesRepository.findById(id, customer.company_id);

    if (!sale) {
      throw new NotFoundException('Compra não encontrada');
    }

    if (sale.customer_id !== customer.customer_id) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta compra',
      );
    }

    await this.salesService.cancel(id, reason, customer);
  }

  async getHistory(customer: CustomerUser): Promise<{
    purchases: SaleResponseDto[];
    tickets: any[];
  }> {
    const purchases = await this.findAll(customer);
    const tickets = await this.findTickets(customer);

    return { purchases, tickets };
  }

  private async accumulateLoyaltyPoints(
    sale: SaleResponseDto,
    customer: CustomerUser,
  ): Promise<void> {
    const netAmount = parseFloat(sale.net_amount);

    // Calcular pontos (exemplo: R$ 1,00 = 1 ponto)
    const pointsToAdd = Math.floor(netAmount);

    if (pointsToAdd <= 0) {
      return;
    }

    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        customer.company_id,
        customer.customer_id,
      );

    if (!companyCustomer) {
      return;
    }

    const currentPoints = companyCustomer.accumulated_points || 0;
    const newPoints = currentPoints + pointsToAdd;

    // Atualizar pontos
    await this.companyCustomersRepository.update(
      customer.company_id,
      customer.customer_id,
      {
        accumulated_points: newPoints,
      },
    );

    // Verificar e atualizar nível de fidelidade
    await this.updateLoyaltyLevel(customer, newPoints);

    this.logger.log(
      `Pontos acumulados: ${pointsToAdd} para cliente ${customer.customer_id}. Total: ${newPoints}`,
      CustomerPurchasesService.name,
    );
  }

  private async deductPoints(
    customer: CustomerUser,
    points: number,
  ): Promise<void> {
    const companyCustomer =
      await this.companyCustomersRepository.findByCompanyAndCustomer(
        customer.company_id,
        customer.customer_id,
      );

    if (!companyCustomer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const currentPoints = companyCustomer.accumulated_points || 0;
    const newPoints = Math.max(0, currentPoints - points);

    await this.companyCustomersRepository.update(
      customer.company_id,
      customer.customer_id,
      {
        accumulated_points: newPoints,
      },
    );

    this.logger.log(
      `Pontos deduzidos: ${points} do cliente ${customer.customer_id}. Restante: ${newPoints}`,
      CustomerPurchasesService.name,
    );
  }

  private async updateLoyaltyLevel(
    customer: CustomerUser,
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
        customer.company_id,
        customer.customer_id,
      );

    if (companyCustomer && companyCustomer.loyalty_level !== newLevel) {
      await this.companyCustomersRepository.update(
        customer.company_id,
        customer.customer_id,
        {
          loyalty_level: newLevel,
        },
      );

      this.logger.log(
        `Nível de fidelidade atualizado: ${companyCustomer.loyalty_level} → ${newLevel} para cliente ${customer.customer_id}`,
        CustomerPurchasesService.name,
      );
    }
  }

  private mapToDto(sale: any): SaleResponseDto {
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
      tickets: (sale.tickets || []).map((ticket: any) => ({
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
}
