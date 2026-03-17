import { ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { ExhibitionContractsRepository } from '../repositories/exhibition-contracts.repository';
import { ExhibitionContractsService } from './exhibition-contracts.service';

describe('ExhibitionContractsService', () => {
  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    deactivate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<ExhibitionContractsRepository>;

  const movieRepository = {
    findById: jest.fn(),
  } as any;

  const cinemaComplexesRepository = {
    findById: jest.fn(),
    findAllByCompany: jest.fn(),
  } as any;

  const supplierRepository = {
    findById: jest.fn(),
  } as any;

  const contractTypesRepository = {
    findById: jest.fn(),
  } as any;

  const snowflake = {
    generate: jest.fn(),
  } as unknown as jest.Mocked<SnowflakeService>;

  const cls = {
    get: jest.fn(),
  } as unknown as jest.Mocked<ClsService>;

  const service = new ExhibitionContractsService(
    repository,
    movieRepository,
    cinemaComplexesRepository,
    supplierRepository,
    contractTypesRepository,
    snowflake,
    cls,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    cls.get.mockImplementation((key?: string | symbol) => {
      if (key === 'companyId') return 'company-123';
      return undefined;
    });
  });

  it('deve listar usando company_id do contexto', async () => {
    cinemaComplexesRepository.findAllByCompany.mockResolvedValue([
      { id: 'cc-1' },
      { id: 'cc-2' },
    ]);
    repository.findAll.mockResolvedValue([{ id: 'ec-1' }] as any);

    const result = await service.findAll({ active: true });

    expect(cinemaComplexesRepository.findAllByCompany).toHaveBeenCalledWith(
      'company-123',
    );
    expect(repository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        cinema_complex_id: { in: ['cc-1', 'cc-2'] },
        active: true,
      }),
    );
    expect(result).toEqual([{ id: 'ec-1' }]);
  });

  it('deve retornar vazio quando empresa não possui complexos', async () => {
    cinemaComplexesRepository.findAllByCompany.mockResolvedValue([]);

    const result = await service.findAll({});

    expect(repository.findAll).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('deve lançar erro quando contexto da empresa não existir', async () => {
    cls.get.mockReturnValue(undefined);

    await expect(service.findAll({})).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
