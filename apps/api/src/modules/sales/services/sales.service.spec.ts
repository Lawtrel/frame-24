import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { SalesRepository } from '../repositories/sales.repository';
import { TicketsRepository } from '../repositories/tickets.repository';
import { ConcessionSalesRepository } from '../repositories/concession-sales.repository';
import { TicketsService } from './tickets.service';
import { ProductRepository } from 'src/modules/catalog/products/repositories/product.repository';
import { ProductPricesRepository } from 'src/modules/catalog/products/repositories/product-prices.repository';
import { CombosRepository } from 'src/modules/catalog/products/repositories/combos.repository';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';
import { LoggerService } from 'src/common/services/logger.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import { NotFoundException } from '@nestjs/common';
import { ProductPriceNotFoundException } from '../exceptions/sales.exceptions';

describe('SalesService', () => {
  let service: SalesService;
  let salesRepository: jest.Mocked<SalesRepository>;
  let ticketsRepository: jest.Mocked<TicketsRepository>;
  let productPricesRepository: jest.Mocked<ProductPricesRepository>;
  let combosRepository: jest.Mocked<CombosRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: SalesRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            generateSaleNumber: jest.fn(),
          },
        },
        {
          provide: TicketsRepository,
          useValue: {
            create: jest.fn(),
            generateTicketNumber: jest.fn(),
          },
        },
        {
          provide: ConcessionSalesRepository,
          useValue: {
            create: jest.fn(),
            createItem: jest.fn(),
          },
        },
        {
          provide: TicketsService,
          useValue: {
            validateAndReserveSeats: jest.fn(),
            reserveSeats: jest.fn(),
            calculateTicketPrice: jest.fn(),
            seatsRepository: {
              findById: jest.fn(),
            },
          },
        },
        {
          provide: ProductRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ProductPricesRepository,
          useValue: {
            findActivePrice: jest.fn(),
          },
        },
        {
          provide: CombosRepository,
          useValue: {
            getComboPrice: jest.fn(),
          },
        },
        {
          provide: CinemaComplexesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: RabbitMQPublisherService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    salesRepository = module.get(SalesRepository);
    ticketsRepository = module.get(TicketsRepository);
    productPricesRepository = module.get(ProductPricesRepository);
    combosRepository = module.get(CombosRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockUser = {
      company_id: 'company-1',
      company_user_id: 'user-1',
    } as any;

    const mockDto = {
      cinema_complex_id: 'complex-1',
      payment_method: 'payment-1',
      tickets: [
        {
          showtime_id: 'showtime-1',
          seat_id: 'seat-1',
        },
      ],
      concession_items: [
        {
          item_type: 'PRODUCT' as const,
          item_id: 'product-1',
          quantity: 2,
        },
      ],
    };

    it('should throw ProductPriceNotFoundException when product price not found', async () => {
      salesRepository.generateSaleNumber.mockResolvedValue('V202501000001');
      salesRepository.create.mockResolvedValue({
        id: 'sale-1',
        sale_number: 'V202501000001',
      } as any);

      productPricesRepository.findActivePrice.mockResolvedValue(null);

      await expect(service.create(mockDto, mockUser)).rejects.toThrow(
        ProductPriceNotFoundException,
      );
    });

    it('should create sale with concession items when prices are found', async () => {
      salesRepository.generateSaleNumber.mockResolvedValue('V202501000001');
      salesRepository.findById.mockResolvedValue({
        id: 'sale-1',
        sale_number: 'V202501000001',
        tickets: [],
      } as any);

      productPricesRepository.findActivePrice.mockResolvedValue({
        sale_price: 10.5,
      } as any);

      ticketsRepository.generateTicketNumber.mockReturnValue('TKT-123');
      ticketsRepository.create.mockResolvedValue({} as any);

      const result = await service.create(mockDto, mockUser);

      expect(result).toBeDefined();
      expect(salesRepository.create).toHaveBeenCalled();
    });
  });
});
