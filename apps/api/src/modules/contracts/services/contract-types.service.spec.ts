import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { SnowflakeService } from 'src/common/services/snowflake.service';
import { CreateContractTypeDto } from '../dto/create-contract-type.dto';
import { ContractTypesRepository } from '../repositories/contract-types.repository';
import { ContractTypesService } from './contract-types.service';

describe('ContractTypesService', () => {
  const repository = {
    create: jest.fn(),
    findAllByCompany: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ContractTypesRepository>;

  const snowflake = {
    generate: jest.fn(),
  } as unknown as jest.Mocked<SnowflakeService>;

  const cls = {
    get: jest.fn(),
  } as unknown as jest.Mocked<ClsService>;

  const service = new ContractTypesService(repository, snowflake, cls);

  beforeEach(() => {
    jest.clearAllMocks();
    snowflake.generate.mockReturnValue('ct-1');
    cls.get.mockImplementation((key?: string | symbol) => {
      if (key === 'companyId') return 'company-123';
      return undefined;
    });
  });

  it('deve criar tipo com company_id do contexto', async () => {
    const dto = { name: 'Percentual Fixo' } as CreateContractTypeDto;
    repository.create.mockResolvedValue({ id: 'ct-1' } as any);

    await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'ct-1',
        company_id: 'company-123',
      }),
    );
  });

  it('deve listar tipos da empresa do contexto', async () => {
    repository.findAllByCompany.mockResolvedValue([{ id: 'ct-1' }] as any);

    const result = await service.findAll();

    expect(repository.findAllByCompany).toHaveBeenCalledWith('company-123');
    expect(result).toEqual([{ id: 'ct-1' }]);
  });

  it('deve lançar not found para tipo de outra empresa', async () => {
    repository.findById.mockResolvedValue({
      id: 'ct-1',
      company_id: 'company-999',
    } as any);

    await expect(service.findOne('ct-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve lançar erro quando contexto da empresa não existir', async () => {
    cls.get.mockReturnValue(undefined);

    await expect(service.findAll()).rejects.toBeInstanceOf(ForbiddenException);
  });
});
