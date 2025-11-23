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

import { AccountsReceivableService } from 'src/modules/finance/accounts-receivable/services/accounts-receivable.service';
import { TransactionsService } from 'src/modules/finance/transactions/services/transactions.service';
import { BankAccountsRepository } from 'src/modules/finance/cash-flow/repositories/bank-accounts.repository';

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
    private readonly accountsReceivableService: AccountsReceivableService,
    private readonly transactionsService: TransactionsService,
    private readonly bankAccountsRepository: BankAccountsRepository,
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

    // 1. Preparação de Dados em Lote
    // Coletar IDs para buscas em lote
    const seatIds = dto.tickets
      .map((t) => t.seat_id)
      .filter((id): id is string => Boolean(id));

    const productItemIds =
      dto.concession_items
        ?.filter((i) => i.item_type === 'PRODUCT')
        .map((i) => i.item_id) || [];

    // Buscas paralelas (Promise.all)
    const [productsMap, productPricesMap] = await Promise.all([
      // Buscar produtos
      productItemIds.length > 0
        ? this.productsRepository
            .findAllByIds(productItemIds, company_id)
            .then((items) => new Map(items.map((p) => [p.id, p])))
        : Promise.resolve(new Map()),

      // Buscar preços de produtos
      productItemIds.length > 0
        ? this.productPricesRepository
            .findActivePricesByProductIds(
              productItemIds,
              dto.cinema_complex_id,
              company_id,
            )
            .then((prices) => {
              // Mapear preço por produto_id
              const map = new Map();
              prices.forEach((p) => map.set(p.product_id, p));
              return map;
            })
        : Promise.resolve(new Map()),
    ]);

    // 2. Validação e Reserva de Assentos
    if (seatIds.length > 0) {
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

      // Paralelizar reservas por sessão
      await Promise.all(
        Array.from(showtimeSeats.entries()).map(([showtime_id, seats]) =>
          this.ticketsService.validateAndReserveSeats(
            showtime_id,
            Array.from(seats),
            company_id,
          ),
        ),
      );
    }

    // 3. Cálculo de Tickets (Otimizado)
    const ticketPromises = dto.tickets.map(async (ticketDto) => {
      const pricing = await this.ticketsService.calculateTicketPrice(
        ticketDto.showtime_id,
        ticketDto.seat_id,
        ticketDto.ticket_type,
        company_id,
      );
      return {
        ...ticketDto,
        pricing,
      };
    });

    const ticketData = await Promise.all(ticketPromises);
    const ticketsTotal = ticketData.reduce(
      (sum, t) => sum + t.pricing.total_amount,
      0,
    );

    // 4. Cálculo de Concessão (Otimizado)
    let concessionTotal = 0;
    const concessionItemsData: any[] = [];

    if (dto.concession_items && dto.concession_items.length > 0) {
      for (const item of dto.concession_items) {
        let unitPrice = 0;

        if (item.item_type === 'PRODUCT') {
          const product = productsMap.get(item.item_id);
          if (!product) {
            // Fallback se não veio no lote
            const found = await this.productsRepository.findById(
              item.item_id,
              company_id,
            );
            if (!found)
              throw new NotFoundException(
                `Produto ${item.item_id} não encontrado`,
              );
          }

          const price = productPricesMap.get(item.item_id);

          if (!price) {
            // Tentar buscar individualmente
            const foundPrice =
              await this.productPricesRepository.findActivePrice(
                item.item_id,
                dto.cinema_complex_id,
                company_id,
              );
            if (!foundPrice)
              throw new ProductPriceNotFoundException(
                product?.name || item.item_id,
              );
            unitPrice = Number(foundPrice.sale_price);
          } else {
            unitPrice = Number(price.sale_price);
          }
        } else if (item.item_type === 'COMBO') {
          unitPrice = await this.combosRepository.getComboPrice(
            item.item_id,
            company_id,
            new Date(),
          );
        }

        const totalPrice = unitPrice * item.quantity;
        concessionTotal += totalPrice;
        concessionItemsData.push({
          ...item,
          unitPrice,
          totalPrice,
        });
      }
    }

    const total_amount = ticketsTotal + concessionTotal;

    // 5. Promoções e Descontos
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

    // 6. Persistência (Transação)
    const sale_number =
      await this.salesRepository.generateSaleNumber(company_id);

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

    // Criar tickets em paralelo
    await Promise.all(
      ticketData.map(async (ticketInfo) => {
        const ticket_number = this.ticketsRepository.generateTicketNumber();

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

        if (ticketInfo.seat_id) {
          await this.ticketsService.reserveSeats(
            ticketInfo.showtime_id,
            [ticketInfo.seat_id],
            sale.id,
            company_id,
          );
        }
      }),
    );

    // Criar concessão
    if (concessionItemsData.length > 0) {
      const concessionSale = await this.concessionSalesRepository.create({
        sales: { connect: { id: sale.id } },
        sale_date: new Date(),
        total_amount: concessionTotal,
        discount_amount: 0,
        net_amount: concessionTotal,
      });

      await Promise.all(
        concessionItemsData.map((item) =>
          this.concessionSalesRepository.createItem({
            concession_sales: { connect: { id: concessionSale.id } },
            item_type: item.item_type,
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          }),
        ),
      );
    }

    // 7. Impostos (Assíncrono/Paralelo)
    const competenceDate = new Date();
    competenceDate.setHours(0, 0, 0, 0);

    try {
      const taxPromises = [];

      if (ticketsTotal > 0) {
        taxPromises.push(
          this.taxCalculationService
            .calculateTaxes({
              gross_amount: ticketsTotal,
              deductions_amount: discount_amount,
              cinema_complex_id: dto.cinema_complex_id,
              company_id,
              competence_date: competenceDate,
              revenue_type: 'BOX_OFFICE',
            })
            .then((calc) =>
              this.taxEntriesRepository.create({
                cinema_complex_id: dto.cinema_complex_id,
                source_type: 'SALE',
                source_id: sale.id,
                competence_date: competenceDate,
                gross_amount: calc.gross_amount,
                deductions_amount: calc.deductions_amount,
                calculation_base: calc.calculation_base,
                apply_iss: true,
                iss_rate: calc.iss_rate,
                iss_amount: calc.iss_amount,
                ibge_municipality_code: calc.ibge_municipality_code,
                ...(calc.iss_service_code && {
                  iss_service_code: calc.iss_service_code,
                }),
                pis_cofins_regime: calc.pis_cofins_regime,
                pis_rate: calc.pis_rate,
                pis_debit_amount: calc.pis_debit_amount,
                pis_credit_amount: calc.pis_credit_amount,
                pis_amount_payable: calc.pis_amount_payable,
                cofins_rate: calc.cofins_rate,
                cofins_debit_amount: calc.cofins_debit_amount,
                cofins_credit_amount: calc.cofins_credit_amount,
                cofins_amount_payable: calc.cofins_amount_payable,
                processing_user_id: user_id || null,
                processed: false,
              }),
            ),
        );
      }

      if (concessionTotal > 0) {
        taxPromises.push(
          this.taxCalculationService
            .calculateTaxes({
              gross_amount: concessionTotal,
              deductions_amount: 0,
              cinema_complex_id: dto.cinema_complex_id,
              company_id,
              competence_date: competenceDate,
              revenue_type: 'CONCESSION',
            })
            .then((calc) =>
              this.taxEntriesRepository.create({
                cinema_complex_id: dto.cinema_complex_id,
                source_type: 'SALE',
                source_id: sale.id,
                competence_date: competenceDate,
                gross_amount: calc.gross_amount,
                deductions_amount: calc.deductions_amount,
                calculation_base: calc.calculation_base,
                apply_iss: true,
                iss_rate: calc.iss_rate,
                iss_amount: calc.iss_amount,
                ibge_municipality_code: calc.ibge_municipality_code,
                ...(calc.iss_service_code && {
                  iss_service_code: calc.iss_service_code,
                }),
                pis_cofins_regime: calc.pis_cofins_regime,
                pis_rate: calc.pis_rate,
                pis_debit_amount: calc.pis_debit_amount,
                pis_credit_amount: calc.pis_credit_amount,
                pis_amount_payable: calc.pis_amount_payable,
                cofins_rate: calc.cofins_rate,
                cofins_debit_amount: calc.cofins_debit_amount,
                cofins_credit_amount: calc.cofins_credit_amount,
                cofins_amount_payable: calc.cofins_amount_payable,
                processing_user_id: user_id || null,
                processed: false,
              }),
            ),
        );
      }

      await Promise.all(taxPromises);
    } catch (error) {
      this.logger.error(
        `Erro ao criar lançamento fiscal para venda ${sale.id}: ${error}`,
        SalesService.name,
      );
    }

    // 8. Finalização
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

    // 9. Contas a Receber (Automático)
    try {
      // Criar título a receber
      const receivable = await this.accountsReceivableService.create(
        company_id,
        {
          cinema_complex_id: dto.cinema_complex_id,
          customer_id: resolvedCustomerId,
          sale_id: sale.id,
          document_number: sale_number,
          description: `Venda - Pedido ${sale_number}`,
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date().toISOString().split('T')[0], // Vencimento hoje (ajustar se for crédito)
          competence_date: new Date().toISOString().split('T')[0],
          original_amount: net_amount,
          interest_amount: 0,
          penalty_amount: 0,
          discount_amount: 0,
        },
      );

      // Se for pagamento imediato (não crédito), baixar o título
      // TODO: Verificar tipo de pagamento real. Assumindo imediato para simplificação por enquanto.
      // Em um cenário real, verificaríamos dto.payment_method para decidir se baixa agora ou não.
      // Vamos assumir que tudo que entra aqui já foi "pago" no POS, então baixamos para gerar o caixa.

      // Buscar conta bancária padrão
      const bankAccounts =
        await this.bankAccountsRepository.findAll(company_id);
      const defaultAccount = bankAccounts.find((acc: any) => acc.active);

      if (defaultAccount) {
        await this.transactionsService.settleReceivable(
          company_id,
          user_id || 'SYSTEM',
          {
            account_receivable_id: receivable.id,
            amount: net_amount,
            transaction_date: new Date().toISOString().split('T')[0],
            bank_account_id: defaultAccount.id,
            payment_method: dto.payment_method || 'CASH', // Fallback
            notes: `Baixa automática - Venda ${sale_number}`,
            interest_amount: 0,
            penalty_amount: 0,
            discount_amount: 0,
          },
        );
      } else {
        this.logger.warn(
          `Nenhuma conta bancária ativa encontrada para baixar venda ${sale_number}`,
          SalesService.name,
        );
      }
    } catch (error) {
      this.logger.error(
        `Erro ao criar conta a receber para venda ${sale.id}: ${error}`,
        SalesService.name,
      );
    }

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
