import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ShowtimesService } from './shotimes.service';
import { ShowtimesRepository } from '../repositories/showtime.repository';
import { SessionSeatStatusRepository } from 'src/modules/operations/session_seat_status/repositories/session-seat-status.repository';
import { SessionStatusRepository } from 'src/modules/operations/session-status/repositories/session-status.repository';
import { RoomsRepository } from '../../rooms/repositories/rooms.repository';
import { SeatsRepository } from 'src/modules/operations/seats/repositories/seats.repository';
import { MovieRepository } from 'src/modules/catalog/movies/repositories/movie.repository';
import { CinemaComplexesRepository } from 'src/modules/operations/cinema-complexes/repositories/cinema-complexes.repository';
import { SeatStatusRepository } from 'src/modules/operations/seat-status/repositories/seat-status.repository';
import { ExhibitionContractsRepository } from 'src/modules/contracts/repositories/exhibition-contracts.repository';
import { MunicipalTaxParametersRepository } from 'src/modules/tax/repositories/municipal-tax-parameters.repository';
import { FederalTaxRatesRepository } from 'src/modules/tax/repositories/federal-tax-rates.repository';
import { SeatTypesRepository } from 'src/modules/operations/seat-types/repositories/seat-types.repository';
import { ProjectionTypesRepository } from 'src/modules/operations/projection-types/repositories/projection-types.repository';
import { AudioTypesRepository } from 'src/modules/operations/audio-types/repositories/audio-types.repository';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { RabbitMQPublisherService } from 'src/common/rabbitmq/rabbitmq-publisher.service';
import type { RequestUser } from 'src/modules/identity/auth/strategies/jwt.strategy';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let exhibitionContractsRepository: jest.Mocked<ExhibitionContractsRepository>;
  let municipalTaxParametersRepository: jest.Mocked<MunicipalTaxParametersRepository>;
  let federalTaxRatesRepository: jest.Mocked<FederalTaxRatesRepository>;
  let cinemaComplexesRepository: jest.Mocked<CinemaComplexesRepository>;
  let moviesRepository: jest.Mocked<MovieRepository>;
  let roomsRepository: jest.Mocked<RoomsRepository>;
  let seatsRepository: jest.Mocked<SeatsRepository>;
  let seatTypesRepository: jest.Mocked<SeatTypesRepository>;
  let projectionTypesRepository: jest.Mocked<ProjectionTypesRepository>;
  let audioTypesRepository: jest.Mocked<AudioTypesRepository>;

  const mockUser: RequestUser = {
    company_id: 'company-123',
    company_user_id: 'user-123',
    identity_id: 'identity-123',
  } as RequestUser;

  const mockMovie = {
    id: 'movie-123',
    company_id: 'company-123',
    duration_minutes: 120,
  };

  const mockRoom = {
    id: 'room-123',
    cinema_complex_id: 'complex-123',
    capacity: 100,
  };

  const mockComplex = {
    id: 'complex-123',
    company_id: 'company-123',
    ibge_municipality_code: '3550308',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: ShowtimesRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            findOverlappingSessions: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: SessionSeatStatusRepository,
          useValue: {
            createMany: jest.fn(),
            findByShowtimeId: jest.fn(),
          },
        },
        {
          provide: SessionStatusRepository,
          useValue: {
            findByNameAndCompany: jest.fn(),
          },
        },
        {
          provide: RoomsRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: SeatsRepository,
          useValue: {
            findByRoomId: jest.fn(),
          },
        },
        {
          provide: MovieRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CinemaComplexesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: SeatStatusRepository,
          useValue: {
            findDefaultByCompany: jest.fn(),
          },
        },
        {
          provide: ExhibitionContractsRepository,
          useValue: {
            findActiveContract: jest.fn(),
          },
        },
        {
          provide: MunicipalTaxParametersRepository,
          useValue: {
            findActiveByCompanyAndIbge: jest.fn(),
          },
        },
        {
          provide: FederalTaxRatesRepository,
          useValue: {
            findActiveByCompany: jest.fn(),
          },
        },
        {
          provide: SeatTypesRepository,
          useValue: {
            findByIds: jest.fn(),
          },
        },
        {
          provide: ProjectionTypesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: AudioTypesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: SnowflakeService,
          useValue: {
            generate: jest.fn(() => 'snowflake-id'),
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

    service = module.get<ShowtimesService>(ShowtimesService);
    exhibitionContractsRepository = module.get(ExhibitionContractsRepository);
    municipalTaxParametersRepository = module.get(
      MunicipalTaxParametersRepository,
    );
    federalTaxRatesRepository = module.get(FederalTaxRatesRepository);
    cinemaComplexesRepository = module.get(CinemaComplexesRepository);
    moviesRepository = module.get(MovieRepository);
    roomsRepository = module.get(RoomsRepository);
    seatsRepository = module.get(SeatsRepository);
    seatTypesRepository = module.get(SeatTypesRepository);
    projectionTypesRepository = module.get(ProjectionTypesRepository);
    audioTypesRepository = module.get(AudioTypesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateShowtimeFinancials', () => {
    const baseTicketPrice = 25.0;
    const movieId = 'movie-123';
    const cinemaComplexId = 'complex-123';
    const sessionDate = new Date('2025-11-17T20:00:00Z');
    const companyId = 'company-123';

    it('deve calcular breakdown financeiro com contrato e impostos encontrados', async () => {
      const mockContract = {
        id: 'contract-123',
        distributor_percentage: 47.5,
        exhibitor_percentage: 52.5,
        start_date: new Date('2025-11-10T00:00:00Z'),
        sliding_scales: [],
      };

      const mockMunicipalTax = {
        id: 'municipal-tax-123',
        iss_rate: 5.0,
      };

      const mockFederalTax = {
        id: 'federal-tax-123',
        pis_rate: 1.65,
        cofins_rate: 7.6,
      };

      exhibitionContractsRepository.findActiveContract.mockResolvedValue(
        mockContract as any,
      );
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        mockMunicipalTax as any,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(
        mockFederalTax as any,
      );

      const result = await (service as any).calculateShowtimeFinancials(
        baseTicketPrice,
        movieId,
        cinemaComplexId,
        sessionDate,
        companyId,
      );

      expect(result).toMatchObject({
        baseTicketPrice: 25.0,
        distributorShare: 11.875, // 25 * 0.475
        exhibitorGross: 13.125, // 25 * 0.525
        issRate: 5.0,
        pisRate: 1.65,
        cofinsRate: 7.6,
        contractUsed: true,
        distributorPercentage: 47.5,
        exhibitorPercentage: 52.5,
      });

      expect(result.issAmount).toBeCloseTo(0.65625, 2); // 13.125 * 0.05
      expect(result.pisAmount).toBeCloseTo(0.2165625, 2); // 13.125 * 0.0165
      expect(result.cofinsAmount).toBeCloseTo(0.9975, 2); // 13.125 * 0.076
      expect(result.totalTaxes).toBeCloseTo(1.8703125, 2);
      expect(result.netRevenue).toBeCloseTo(11.2546875, 2);
    });

    it('deve usar fallback quando não há contrato específico', async () => {
      const mockMunicipalTax = {
        id: 'municipal-tax-123',
        iss_rate: 5.0,
      };

      const mockFederalTax = {
        id: 'federal-tax-123',
        pis_rate: 1.65,
        cofins_rate: 7.6,
      };

      exhibitionContractsRepository.findActiveContract.mockResolvedValue(null);
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        mockMunicipalTax as any,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(
        mockFederalTax as any,
      );

      const result = await (service as any).calculateShowtimeFinancials(
        baseTicketPrice,
        movieId,
        cinemaComplexId,
        sessionDate,
        companyId,
      );

      expect(result).toMatchObject({
        baseTicketPrice: 25.0,
        distributorShare: 0,
        exhibitorGross: 25,
        contractUsed: false,
        distributorPercentage: 0,
        exhibitorPercentage: 100,
      });
    });

    it('deve usar valores zero quando não há impostos encontrados', async () => {
      exhibitionContractsRepository.findActiveContract.mockResolvedValue(null);
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        null,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(null);

      const result = await (service as any).calculateShowtimeFinancials(
        baseTicketPrice,
        movieId,
        cinemaComplexId,
        sessionDate,
        companyId,
      );

      expect(result).toMatchObject({
        baseTicketPrice: 25.0,
        issRate: 0,
        issAmount: 0,
        pisRate: 0,
        pisAmount: 0,
        cofinsRate: 0,
        cofinsAmount: 0,
        totalTaxes: 0,
        netRevenue: 25, // exhibitorGross sem impostos
      });
    });

    it('deve aplicar escala móvel quando disponível', async () => {
      const mockContract = {
        id: 'contract-123',
        distributor_percentage: 40,
        exhibitor_percentage: 60,
        start_date: new Date('2025-11-01T00:00:00Z'),
        sliding_scales: [
          {
            id: 'scale-1',
            week_number: 1,
            distributor_percentage: 60,
            exhibitor_percentage: 40,
          },
          {
            id: 'scale-3',
            week_number: 3,
            distributor_percentage: 45,
            exhibitor_percentage: 55,
          },
        ],
      };

      exhibitionContractsRepository.findActiveContract.mockResolvedValue(
        mockContract as any,
      );
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        null,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(null);

      const weekThreeDate = new Date('2025-11-20T00:00:00Z');

      const result = await (service as any).calculateShowtimeFinancials(
        baseTicketPrice,
        movieId,
        cinemaComplexId,
        weekThreeDate,
        companyId,
      );

      expect(result.distributorPercentage).toBe(45);
      expect(result.exhibitorPercentage).toBe(55);
      expect(result.distributorShare).toBeCloseTo(11.25);
      expect(result.exhibitorGross).toBeCloseTo(13.75);
    });

    it('deve lançar NotFoundException quando complexo não é encontrado', async () => {
      exhibitionContractsRepository.findActiveContract.mockResolvedValue(null);
      cinemaComplexesRepository.findById.mockResolvedValue(null);

      await expect(
        (service as any).calculateShowtimeFinancials(
          baseTicketPrice,
          movieId,
          cinemaComplexId,
          sessionDate,
          companyId,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('preview', () => {
    const mockDto = {
      movie_id: 'movie-123',
      room_id: 'room-123',
      start_time: new Date('2025-11-17T20:00:00Z'),
      base_ticket_price: 25.0,
      session_language: 'lang-123',
    };

    it('deve retornar projeção financeira calculada', async () => {
      const mockContract = {
        id: 'contract-123',
        distributor_percentage: 47.5,
        exhibitor_percentage: 52.5,
        start_date: new Date('2025-11-01T00:00:00Z'),
        sliding_scales: [],
      };

      const mockMunicipalTax = {
        id: 'municipal-tax-123',
        iss_rate: 5.0,
      };

      const mockFederalTax = {
        id: 'federal-tax-123',
        pis_rate: 1.65,
        cofins_rate: 7.6,
      };

      moviesRepository.findById.mockResolvedValue(mockMovie as any);
      roomsRepository.findById.mockResolvedValue(mockRoom as any);
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      exhibitionContractsRepository.findActiveContract.mockResolvedValue(
        mockContract as any,
      );
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        mockMunicipalTax as any,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(
        mockFederalTax as any,
      );
      seatsRepository.findByRoomId.mockResolvedValue([
        { id: 'seat-1', seat_type: null, active: true },
      ] as any);
      seatTypesRepository.findByIds.mockResolvedValue([]);

      const result = await service.preview(mockDto as any, mockUser);

      expect(result).toHaveProperty('baseTicketPrice', 25.0);
      expect(result).toHaveProperty('distributorShare');
      expect(result).toHaveProperty('exhibitorGross');
      expect(result).toHaveProperty('netRevenue');
      expect(result.ticketPricing).toMatchObject({
        requestedBasePrice: 25,
        basePriceWithModifiers: 25,
        averageSeatPrice: 25,
      });
      expect(result.ticketPricing?.seatTypes).toHaveLength(1);
    });

    it('deve considerar adicionais de áudio, projeção e tipos de assento', async () => {
      const dtoWithExtras = {
        ...mockDto,
        base_ticket_price: 20,
        projection_type: 'proj-123',
        audio_type: 'audio-123',
      };

      moviesRepository.findById.mockResolvedValue(mockMovie as any);
      roomsRepository.findById.mockResolvedValue(mockRoom as any);
      cinemaComplexesRepository.findById.mockResolvedValue(mockComplex as any);
      exhibitionContractsRepository.findActiveContract.mockResolvedValue(null);
      municipalTaxParametersRepository.findActiveByCompanyAndIbge.mockResolvedValue(
        null,
      );
      federalTaxRatesRepository.findActiveByCompany.mockResolvedValue(null);

      projectionTypesRepository.findById.mockResolvedValue({
        id: 'proj-123',
        company_id: mockUser.company_id,
        additional_value: 7,
      } as any);
      audioTypesRepository.findById.mockResolvedValue({
        id: 'audio-123',
        company_id: mockUser.company_id,
        additional_value: 3,
      } as any);

      const seatTypeId = 'seat-type-1';
      seatsRepository.findByRoomId.mockResolvedValue([
        { id: 'seat-1', seat_type: null, active: true },
        { id: 'seat-2', seat_type: seatTypeId, active: true },
      ] as any);
      seatTypesRepository.findByIds.mockResolvedValue([
        {
          id: seatTypeId,
          name: 'VIP',
          additional_value: 5,
        },
      ] as any);

      const result = await service.preview(dtoWithExtras as any, mockUser);

      expect(result.baseTicketPrice).toBe(32.5); // média ponderada
      expect(result.ticketPricing).toMatchObject({
        requestedBasePrice: 20,
        projectionAdditional: 7,
        audioAdditional: 3,
        basePriceWithModifiers: 30,
        minSeatPrice: 30,
        maxSeatPrice: 35,
        averageSeatPrice: 32.5,
      });
      expect(result.ticketPricing?.seatTypes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            seat_type_id: null,
            final_price: 30,
          }),
          expect.objectContaining({
            seat_type_id: seatTypeId,
            final_price: 35,
          }),
        ]),
      );
    });

    it('deve lançar NotFoundException quando filme não é encontrado', async () => {
      moviesRepository.findById.mockResolvedValue(null);

      await expect(service.preview(mockDto as any, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar NotFoundException quando sala não é encontrada', async () => {
      moviesRepository.findById.mockResolvedValue(mockMovie as any);
      roomsRepository.findById.mockResolvedValue(null);

      await expect(service.preview(mockDto as any, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ForbiddenException quando sala não pertence à empresa', async () => {
      const wrongCompanyComplex = {
        ...mockComplex,
        company_id: 'wrong-company',
      };

      moviesRepository.findById.mockResolvedValue(mockMovie as any);
      roomsRepository.findById.mockResolvedValue(mockRoom as any);
      cinemaComplexesRepository.findById.mockResolvedValue(
        wrongCompanyComplex as any,
      );

      await expect(service.preview(mockDto as any, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
