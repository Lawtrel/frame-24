import { ForbiddenException } from '@nestjs/common';
import { TenantContextService } from 'src/common/services/tenant-context.service';
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
    getCompanyId: jest.fn(),
    getUserId: jest.fn(),
    getRequiredUserId: jest.fn(),
    getCustomerId: jest.fn(),
    getSessionContext: jest.fn(),
  } as unknown as jest.Mocked<TenantContextService>;

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
    cls.getCompanyId.mockReturnValue('company-123');
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
    cls.getCompanyId.mockReturnValue(undefined as any);

    await expect(service.findAll({})).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
