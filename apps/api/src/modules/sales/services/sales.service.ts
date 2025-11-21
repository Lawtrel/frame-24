import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ProductPriceNotFoundException } from '../exceptions/sales.exceptions';
import { Transactional } from '@nestjs-cls/transactional';
import { SalesRepository } from '../repositories/sales.repository';
import { TicketsRepository } from '../repositories/tickets.repository';
import { ConcessionSalesRepository } from '../repositories/concession-sales.repository';
import { TicketsService } from './tickets.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleResponseDto, TicketResponseDto } from '../dto/sale-response.dto';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';
import { ProductRepository } from 'src/modules/catalog/products/repositories/product.repository';
import { ProductPricesRepository } from 'src/modules/catalog/products/repositories/product-prices.repository';
import { CombosRepository } from 'src/modules/catalog/products/repositories/combos.repository';
import { TaxCalculationService } from 'src/modules/tax/services/tax-calculation.service';
import { TaxEntriesRepository } from 'src/modules/tax/repositories/tax-entries.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import {
  CampaignsService,
  PromotionApplicationResult,
} from 'src/modules/marketing/services/campaigns.service';
import type {
  RequestUser,
  CustomerUser,
} from 'src/modules/identity/auth/strategies/jwt.strategy';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly ticketsRepository: TicketsRepository,
    private readonly concessionSalesRepository: ConcessionSalesRepository,
    private readonly ticketsService: TicketsService,
    private readonly cinemaComplexesRepository: CinemaComplexesRepository,
    private readonly productsRepository: ProductRepository,
    private readonly productPricesRepository: ProductPricesRepository,
    private readonly combosRepository: CombosRepository,
    private readonly taxCalculationService: TaxCalculationService,
    private readonly taxEntriesRepository: TaxEntriesRepository,
    private readonly logger: LoggerService,
    private readonly rabbitmq: RabbitMQPublisherService,
    private readonly campaignsService: CampaignsService,
  ) {}

  async findAll(
    user: RequestUser,
    filters?: {
      cinema_complex_id?: string;
      customer_id?: string;
      start_date?: Date;
      end_date?: Date;
      status?: string;
    },
  ): Promise<SaleResponseDto[]> {
    const sales = await this.salesRepository.findAll(user.company_id, filters);

    return sales.map((sale) => this.mapToDto(sale));
  }

  async findOne(id: string, user: RequestUser): Promise<SaleResponseDto> {
    const sale = await this.salesRepository.findById(id, user.company_id);

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    return this.mapToDto(sale);
  }

  @Transactional()
  async create(
    dto: CreateSaleDto,
    user: RequestUser | CustomerUser,
  ): Promise<SaleResponseDto> {
    const company_id = user.company_id;
    const user_id =
      'company_user_id' in user ? user.company_user_id : undefined;
    const resolvedCustomerId =
      dto.customer_id || ('customer_id' in user ? user.customer_id : undefined);

    // Validar complexo
    const complex = await this.cinemaComplexesRepository.findById(
      dto.cinema_complex_id,
    );
    if (!complex || complex.company_id !== company_id) {
      throw new NotFoundException('Complexo de cinema não encontrado');
    }

    // Validar assentos e reservar
    const seatIds = dto.tickets
      .map((t) => t.seat_id)
      .filter((id): id is string => Boolean(id));

    if (seatIds.length > 0) {
      // Validar que todos os tickets da mesma sessão usam assentos únicos
      const showtimeSeats = new Map<string, Set<string>>();
      for (const ticket of dto.tickets) {
        if (ticket.seat_id) {
          if (!showtimeSeats.has(ticket.showtime_id)) {
            showtimeSeats.set(ticket.showtime_id, new Set());
          }
          const seats = showtimeSeats.get(ticket.showtime_id)!;
          if (seats.has(ticket.seat_id)) {
            throw new ConflictException(
              'Não é possível vender o mesmo assento duas vezes na mesma sessão',
            );
          }
          seats.add(ticket.seat_id);
        }
      }

      // Validar e reservar assentos
      for (const [showtime_id, seats] of showtimeSeats.entries()) {
        await this.ticketsService.validateAndReserveSeats(
          showtime_id,
          Array.from(seats),
          company_id,
        );
      }
    }

    // Calcular totais dos tickets
    let ticketsTotal = 0;
    const ticketData = [];

    for (const ticketDto of dto.tickets) {
      const pricing = await this.ticketsService.calculateTicketPrice(
        ticketDto.showtime_id,
        ticketDto.seat_id,
        ticketDto.ticket_type,
        company_id,
      );

      ticketsTotal += pricing.total_amount;
      ticketData.push({
        ...ticketDto,
        pricing,
      });
    }

    // Calcular totais de concessão (se houver)
    let concessionTotal = 0;
    if (dto.concession_items && dto.concession_items.length > 0) {
      for (const item of dto.concession_items) {
        let unitPrice = 0;

        if (item.item_type === 'PRODUCT') {
          // Buscar preço do produto
          const product = await this.productsRepository.findById(
            item.item_id,
            company_id,
          );
          if (!product) {
            throw new NotFoundException(
              `Produto ${item.item_id} não encontrado`,
            );
          }

          const price = await this.productPricesRepository.findActivePrice(
            item.item_id,
            dto.cinema_complex_id,
            company_id,
          );

          if (!price) {
            throw new ProductPriceNotFoundException(product.name);
          }

          unitPrice = Number(price.sale_price);
        } else if (item.item_type === 'COMBO') {
          // Buscar preço do combo
          unitPrice = await this.combosRepository.getComboPrice(
            item.item_id,
            company_id,
            new Date(),
          );
        }

        concessionTotal += unitPrice * item.quantity;
      }
    }

    const total_amount = ticketsTotal + concessionTotal;

    const manualDiscount = dto.discount_amount || 0;
    let promotionResult: PromotionApplicationResult | null = null;

    if (dto.promotion_code) {
      promotionResult = await this.campaignsService.applyPromotion({
        company_id,
        promotion_code: dto.promotion_code,
        order_amount: total_amount,
        customer_id: resolvedCustomerId,
      });
    }

    const promotionDiscount = promotionResult?.discount_amount || 0;
    const discount_amount = manualDiscount + promotionDiscount;
    const net_amount = total_amount - discount_amount;

    if (net_amount < 0) {
      throw new BadRequestException(
        'O valor do desconto não pode ser maior que o total',
      );
    }

    // Gerar número da venda
    const sale_number =
      await this.salesRepository.generateSaleNumber(company_id);

    // Criar venda
    const sale = await this.salesRepository.create({
      sale_number,
      sale_date: new Date(),
      cinema_complex_id: dto.cinema_complex_id,
      ...(dto.customer_id && { customer_id: dto.customer_id }),
      ...(dto.sale_type && {
        sale_types: { connect: { id: dto.sale_type } },
      }),
      ...(dto.payment_method && {
        payment_methods: { connect: { id: dto.payment_method } },
      }),
      total_amount,
      discount_amount,
      net_amount,
      ...(user_id && { user_id }),
    });

    // Criar tickets
    for (const ticketInfo of ticketData) {
      const ticket_number = this.ticketsRepository.generateTicketNumber();

      // Buscar assento se houver
      let seatCode: string | null = null;
      if (ticketInfo.seat_id) {
        const seat = await this.ticketsService.seatsRepository.findById(
          ticketInfo.seat_id,
        );
        seatCode = seat?.seat_code || null;
      }

      await this.ticketsRepository.create({
        sales: { connect: { id: sale.id } },
        ticket_number,
        showtime_id: ticketInfo.showtime_id,
        ...(ticketInfo.seat_id && { seat_id: ticketInfo.seat_id }),
        ...(ticketInfo.ticket_type && {
          ticket_types: { connect: { id: ticketInfo.ticket_type } },
        }),
        face_value: ticketInfo.pricing.face_value,
        service_fee: ticketInfo.pricing.service_fee,
        total_amount: ticketInfo.pricing.total_amount,
        seat: seatCode,
      });

      // Reservar assento se houver
      if (ticketInfo.seat_id) {
        await this.ticketsService.reserveSeats(
          ticketInfo.showtime_id,
          [ticketInfo.seat_id],
          sale.id,
          company_id,
        );
      }
    }

    // Criar venda de concessão (se houver)
    if (dto.concession_items && dto.concession_items.length > 0) {
      const concessionSale = await this.concessionSalesRepository.create({
        sales: { connect: { id: sale.id } },
        sale_date: new Date(),
        total_amount: concessionTotal,
        discount_amount: 0,
        net_amount: concessionTotal,
      });

      // Criar itens de concessão
      for (const item of dto.concession_items) {
        let unitPrice = 0;

        if (item.item_type === 'PRODUCT') {
          const price = await this.productPricesRepository.findActivePrice(
            item.item_id,
            dto.cinema_complex_id,
            company_id,
          );

          if (!price) {
            const product = await this.productsRepository.findById(
              item.item_id,
              company_id,
            );
            throw new ProductPriceNotFoundException(
              product?.name || item.item_id,
            );
          }

          unitPrice = Number(price.sale_price);
        } else if (item.item_type === 'COMBO') {
          unitPrice = await this.combosRepository.getComboPrice(
            item.item_id,
            company_id,
            new Date(),
          );
        }

        const totalPrice = unitPrice * item.quantity;

        await this.concessionSalesRepository.createItem({
          concession_sales: { connect: { id: concessionSale.id } },
          item_type: item.item_type,
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
        });
      }
    }

    // Criar lançamentos fiscais automaticamente
    const competenceDate = new Date();
    competenceDate.setHours(0, 0, 0, 0);

    try {
      // Tax entry para receita de bilheteria (tickets)
      if (ticketsTotal > 0) {
        const taxCalculation = await this.taxCalculationService.calculateTaxes({
          gross_amount: ticketsTotal,
          deductions_amount: discount_amount,
          cinema_complex_id: dto.cinema_complex_id,
          company_id,
          competence_date: competenceDate,
          revenue_type: 'BOX_OFFICE',
        });

        await this.taxEntriesRepository.create({
          cinema_complex_id: dto.cinema_complex_id,
          source_type: 'SALE',
          source_id: sale.id,
          competence_date: competenceDate,
          gross_amount: taxCalculation.gross_amount,
          deductions_amount: taxCalculation.deductions_amount,
          calculation_base: taxCalculation.calculation_base,
          apply_iss: true,
          iss_rate: taxCalculation.iss_rate,
          iss_amount: taxCalculation.iss_amount,
          ibge_municipality_code: taxCalculation.ibge_municipality_code,
          ...(taxCalculation.iss_service_code && {
            iss_service_code: taxCalculation.iss_service_code,
          }),
          pis_cofins_regime: taxCalculation.pis_cofins_regime,
          pis_rate: taxCalculation.pis_rate,
          pis_debit_amount: taxCalculation.pis_debit_amount,
          pis_credit_amount: taxCalculation.pis_credit_amount,
          pis_amount_payable: taxCalculation.pis_amount_payable,
          cofins_rate: taxCalculation.cofins_rate,
          cofins_debit_amount: taxCalculation.cofins_debit_amount,
          cofins_credit_amount: taxCalculation.cofins_credit_amount,
          cofins_amount_payable: taxCalculation.cofins_amount_payable,
          processing_user_id: user_id || null,
          processed: false,
        });
      }

      // Tax entry para receita de concessão
      if (concessionTotal > 0) {
        const taxCalculation = await this.taxCalculationService.calculateTaxes({
          gross_amount: concessionTotal,
          deductions_amount: 0,
          cinema_complex_id: dto.cinema_complex_id,
          company_id,
          competence_date: competenceDate,
          revenue_type: 'CONCESSION',
        });

        await this.taxEntriesRepository.create({
          cinema_complex_id: dto.cinema_complex_id,
          source_type: 'SALE',
          source_id: sale.id,
          competence_date: competenceDate,
          gross_amount: taxCalculation.gross_amount,
          deductions_amount: taxCalculation.deductions_amount,
          calculation_base: taxCalculation.calculation_base,
          apply_iss: true,
          iss_rate: taxCalculation.iss_rate,
          iss_amount: taxCalculation.iss_amount,
          ibge_municipality_code: taxCalculation.ibge_municipality_code,
          ...(taxCalculation.iss_service_code && {
            iss_service_code: taxCalculation.iss_service_code,
          }),
          pis_cofins_regime: taxCalculation.pis_cofins_regime,
          pis_rate: taxCalculation.pis_rate,
          pis_debit_amount: taxCalculation.pis_debit_amount,
          pis_credit_amount: taxCalculation.pis_credit_amount,
          pis_amount_payable: taxCalculation.pis_amount_payable,
          cofins_rate: taxCalculation.cofins_rate,
          cofins_debit_amount: taxCalculation.cofins_debit_amount,
          cofins_credit_amount: taxCalculation.cofins_credit_amount,
          cofins_amount_payable: taxCalculation.cofins_amount_payable,
          processing_user_id: user_id || null,
          processed: false,
        });
      }
    } catch (error) {
      // Log erro mas não falha a venda
      this.logger.error(
        `Erro ao criar lançamento fiscal para venda ${sale.id}: ${error}`,
        SalesService.name,
      );
    }

    // Buscar venda completa
    if (promotionResult) {
      await this.campaignsService.recordPromotionUsage(
        sale.id,
        promotionResult,
        resolvedCustomerId,
      );
    }

    const completeSale = await this.salesRepository.findById(
      sale.id,
      company_id,
    );

    if (!completeSale) {
      throw new NotFoundException('Erro ao buscar venda criada');
    }

    // Publicar evento
    const auditUserId =
      user_id || ('identity_id' in user ? user.identity_id : '');

    await this.rabbitmq.publish({
      pattern: 'audit.sale.created',
      data: {
        id: completeSale.id,
        values: completeSale,
      },
      metadata: { companyId: company_id, userId: auditUserId },
    });

    this.logger.log(
      `Venda criada: ${sale_number} - R$ ${net_amount.toFixed(2)}`,
      SalesService.name,
    );

    return this.mapToDto(completeSale);
  }

  @Transactional()
  async cancel(
    id: string,
    reason: string,
    user: RequestUser | CustomerUser,
  ): Promise<void> {
    const sale = await this.salesRepository.findById(id, user.company_id);

    if (!sale) {
      throw new NotFoundException('Venda não encontrada');
    }

    // Verificar se já foi cancelada
    if (sale.cancellation_date) {
      throw new BadRequestException('Venda já foi cancelada');
    }

    // Cancelar venda
    await this.salesRepository.update(id, {
      cancellation_date: new Date(),
      cancellation_reason: reason,
    });

    // Liberar assentos
    if (sale.tickets) {
      for (const ticket of sale.tickets) {
        if (ticket.seat_id) {
          // Buscar status "disponível" - precisamos injetar os repositórios
          // Por enquanto, vamos deixar comentado e implementar depois
          // TODO: Implementar liberação de assentos no cancelamento
        }
      }
    }

    // Publicar evento
    const userId =
      'company_user_id' in user ? user.company_user_id : user.identity_id;

    await this.rabbitmq.publish({
      pattern: 'audit.sale.cancelled',
      data: {
        id: sale.id,
        reason,
        old_values: sale,
      },
      metadata: {
        companyId: user.company_id,
        userId,
      },
    });

    this.logger.log(`Venda cancelada: ${sale.sale_number}`, SalesService.name);
  }

  private mapToDto(sale: any): SaleResponseDto {
    const promotionUsage =
      sale.promotions_used && sale.promotions_used.length > 0
        ? sale.promotions_used[0]
        : null;

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
      promotion_code: promotionUsage?.promotion_type_code ?? undefined,
      promotion_discount: promotionUsage?.discount_applied
        ? promotionUsage.discount_applied.toString()
        : undefined,
      tickets: (sale.tickets || []).map(
        (ticket: any): TicketResponseDto => ({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          seat: ticket.seat ?? undefined,
          face_value: ticket.face_value.toString(),
          service_fee: (ticket.service_fee || 0).toString(),
          total_amount: ticket.total_amount.toString(),
          used: ticket.used || false,
          usage_date: ticket.usage_date?.toISOString(),
        }),
      ),
      created_at: sale.created_at?.toISOString() || new Date().toISOString(),
    };
  }
}
